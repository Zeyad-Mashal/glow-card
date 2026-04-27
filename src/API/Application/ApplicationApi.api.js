import normalizeMembershipType from "@/utils/normalizeMembershipType";
const URL = "https://glow-card.onrender.com/api/v1/card/create/";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";

const buildHeaders = (token, lang) => ({
    "Content-Type": "application/json",
    "authorization": `glowONW${token}`,
    "accept-language": `${lang || "ar"}`
});

const activateCardRequest = async (productId, payId, data, token, lang) => {
    return fetch(`${URL}${productId}?payId=${encodeURIComponent(payId || "")}`, {
        method: "POST",
        headers: buildHeaders(token, lang),
        body: JSON.stringify(data)
    });
};

const resolveFallbackPayId = async (token, lang, productId, invoiceId, tamaraOrderId) => {
    if (!token) return null;

    try {
        const response = await fetch(NOT_COMPLETE_URL, {
            method: "GET",
            headers: buildHeaders(token, lang),
        });
        if (!response.ok) return null;

        const result = await response.json();
        const payments = Array.isArray(result?.payments) ? result.payments : [];
        if (!payments.length) return null;

        const invoiceValue = invoiceId != null ? String(invoiceId) : null;
        const orderValue = tamaraOrderId != null ? String(tamaraOrderId) : null;
        if (invoiceValue || orderValue) {
            const byInvoiceOrOrder = payments.find((payment) => {
                const candidates = [
                    payment?.invoiceId,
                    payment?.invoice_id,
                    payment?.invoiceNumber,
                    payment?.paymentId,
                    payment?.payId,
                    payment?.orderId,
                    payment?.order_id,
                    payment?.tamaraOrderId,
                    payment?.checkoutId,
                    payment?.checkout_id,
                ]
                    .filter((value) => value != null)
                    .map((value) => String(value));

                const invoiceMatched = invoiceValue
                    ? candidates.includes(invoiceValue)
                    : false;
                const orderMatched = orderValue
                    ? candidates.includes(orderValue)
                    : false;

                return invoiceMatched || orderMatched;
            });
            if (byInvoiceOrOrder?._id) return byInvoiceOrOrder._id;
        }

        const productValue = productId != null ? String(productId) : null;
        const byProduct = payments.filter((payment) => {
            const paymentProductId =
                payment?.product?._id ??
                payment?.product?.id ??
                payment?.productId ??
                (typeof payment?.product === "string" ? payment.product : null);

            return productValue && paymentProductId
                ? String(paymentProductId) === productValue
                : false;
        });

        if (!byProduct.length) return null;

        const latest = [...byProduct].sort((a, b) => {
            const aTime = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
            const bTime = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
            if (aTime !== bTime) return bTime - aTime;
            return String(b?._id || "").localeCompare(String(a?._id || ""));
        })[0];

        return latest?._id || null;
    } catch {
        return null;
    }
};

const resolveTypeByPayId = async (token, lang, payId, productId) => {
    if (!token || !payId) return null;

    try {
        const response = await fetch(NOT_COMPLETE_URL, {
            method: "GET",
            headers: buildHeaders(token, lang),
        });
        if (!response.ok) return null;

        const result = await response.json();
        const payments = Array.isArray(result?.payments) ? result.payments : [];
        if (!payments.length) return null;

        const payValue = String(payId);
        const productValue = productId != null ? String(productId) : null;

        const matched = payments.find((payment) => {
            if (String(payment?._id || "") !== payValue) return false;
            if (!productValue) return true;

            const paymentProductId =
                payment?.product?._id ??
                payment?.product?.id ??
                payment?.productId ??
                (typeof payment?.product === "string" ? payment.product : null);

            return paymentProductId ? String(paymentProductId) === productValue : true;
        });

        if (!matched) return null;

        const rawType =
            matched?.product?.type ??
            matched?.type ??
            matched?.cardType ??
            "";

        return {
            rawType: String(rawType || "").trim(),
            normalizedType: normalizeMembershipType(rawType),
        };
    } catch {
        return null;
    }
};

const ApplicationApi = async (setLoading, setError, data, productId, setShowModal, payId) => {
    const token = localStorage.getItem("token");
    const invoiceId = localStorage.getItem("invoiceId");
    const tamaraOrderId = localStorage.getItem("tamaraOrderId");
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const payTypeMeta = await resolveTypeByPayId(token, lang, payId, productId);
        const resolvedType =
            payTypeMeta?.rawType ||
            payTypeMeta?.normalizedType ||
            normalizeMembershipType(data?.type);
        const payload = {
            ...data,
            type: resolvedType,
        };

        console.log("[Activation][create] Initial request", {
            productId,
            payId,
            type: payload?.type,
            payTypeMeta,
            invoiceId,
            tamaraOrderId,
        });
        let finalResponse = await activateCardRequest(productId, payId, payload, token, lang);
        let finalResult = await finalResponse.json();
        console.log("[Activation][create] Initial response", {
            status: finalResponse.status,
            ok: finalResponse.ok,
            message: finalResult?.message,
        });

        // If payId from callback is stale/invalid, retry once using notComplete.
        if (!finalResponse.ok && [400, 403, 404].includes(finalResponse.status)) {
            const fallbackPayId = await resolveFallbackPayId(
                token,
                lang,
                productId,
                invoiceId,
                tamaraOrderId
            );
            console.log("[Activation][create] Fallback payId", { fallbackPayId });
            if (fallbackPayId && String(fallbackPayId) !== String(payId || "")) {
                const fallbackTypeMeta = await resolveTypeByPayId(
                    token,
                    lang,
                    fallbackPayId,
                    productId
                );
                const fallbackPayload = {
                    ...payload,
                    type:
                        fallbackTypeMeta?.rawType ||
                        fallbackTypeMeta?.normalizedType ||
                        payload?.type,
                };
                finalResponse = await activateCardRequest(
                    productId,
                    fallbackPayId,
                    fallbackPayload,
                    token,
                    lang
                );
                finalResult = await finalResponse.json();
                console.log("[Activation][create] Retry response", {
                    status: finalResponse.status,
                    ok: finalResponse.ok,
                    message: finalResult?.message,
                    retryPayId: fallbackPayId,
                    retryType: fallbackPayload?.type,
                });
            }
        }

        if (finalResponse.ok) {
            setShowModal(true)
            setLoading(false);
        } else {
            if (finalResponse.status == 403) {
                setError(finalResult.message)
                setLoading(false);
            } else if (finalResponse.status == 404) {
                console.log(finalResult.message);
                setError(finalResult.message)
                setLoading(false);
            } else if (finalResponse.status == 500) {
                console.log(finalResult.message);
                setError(finalResult.message)
                setLoading(false);
            } else {
                setError(finalResult?.message || "Activation failed, please try again.");
                setLoading(false);
            }
            setLoading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default ApplicationApi;