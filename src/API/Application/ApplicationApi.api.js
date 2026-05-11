import normalizeMembershipType from "@/utils/normalizeMembershipType";
const URL = "https://glow-card.onrender.com/api/v1/card/create/";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";
const CALLBACK_URL = "https://glow-card.onrender.com/api/v1/payment/callback";

const CALLBACK_QUERY_KEYS = [
    "invoiceId",
    "orderId",
    "order_id",
    "checkoutId",
    "checkout_id",
];

const extractPaymentRowId = (payment) =>
    payment?._id ??
    payment?.id ??
    payment?.paymentId ??
    payment?.payId ??
    payment?.payment_id ??
    null;

const buildHeaders = (token, lang) => ({
    "Content-Type": "application/json",
    "authorization": `glowONW${token}`,
    "accept-language": `${lang || "ar"}`
});

const readToken = () => {
    const token = String(localStorage.getItem("token") || "").trim();
    if (!token || token === "null" || token === "undefined") return "";
    return token;
};

const activateCardRequest = async (productId, payId, data, token, lang) => {
    return fetch(`${URL}${productId}?payId=${encodeURIComponent(payId || "")}`, {
        method: "POST",
        headers: buildHeaders(token, lang),
        body: JSON.stringify(data)
    });
};

const resolvePaymentProductId = (payment) =>
    payment?.product?._id ??
    payment?.product?.id ??
    payment?.productId ??
    (typeof payment?.product === "string" ? payment.product : null);

const resolvePaymentType = (payment) =>
    normalizeMembershipType(
        payment?.product?.type ??
        payment?.type ??
        payment?.cardType ??
        ""
    );

const resolvePaymentDate = (payment) =>
    new Date(payment?.createdAt ?? payment?.updatedAt ?? 0).getTime();

const sortPaymentsByLatest = (payments) =>
    [...payments].sort((a, b) => {
        const aTime = resolvePaymentDate(a);
        const bTime = resolvePaymentDate(b);
        if (aTime !== bTime) return bTime - aTime;
        return String(b?._id || "").localeCompare(String(a?._id || ""));
    });

const isTamaraPayment = (payment) => {
    const provider = String(
        payment?.gateway ??
        payment?.provider ??
        payment?.paymentProvider ??
        payment?.method ??
        payment?.paymentMethod ??
        ""
    )
        .trim()
        .toLowerCase();

    if (provider.includes("tamara")) return true;

    return Boolean(
        payment?.tamaraOrderId ??
        payment?.orderId ??
        payment?.order_id ??
        payment?.checkoutId ??
        payment?.checkout_id
    );
};

const resolveFallbackPayIds = async (
    token,
    lang,
    productId,
    invoiceId,
    tamaraOrderId,
    tamaraCheckoutId,
    pendingPaymentProvider,
    expectedType
) => {
    if (!token) return [];

    try {
        const response = await fetch(NOT_COMPLETE_URL, {
            method: "GET",
            headers: buildHeaders(token, lang),
        });
        if (!response.ok) return [];

        const result = await response.json();
        const payments = Array.isArray(result?.payments) ? result.payments : [];
        if (!payments.length) return [];
        const providerFilteredPayments =
            pendingPaymentProvider === "tamara"
                ? payments.filter((payment) => isTamaraPayment(payment))
                : payments;
        const sourcePayments =
            providerFilteredPayments.length > 0
                ? providerFilteredPayments
                : payments;

        const invoiceValue = invoiceId != null ? String(invoiceId) : null;
        const orderValue = tamaraOrderId != null ? String(tamaraOrderId) : null;
        const productValue = productId != null ? String(productId) : null;
        const expectedTypeValue = normalizeMembershipType(expectedType);
        const checkoutValue =
            tamaraCheckoutId != null ? String(tamaraCheckoutId) : null;

        const withScores = sourcePayments.map((payment) => {
            const candidates = [
                payment?._id,
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
                payment?.reference,
                payment?.orderReference,
                payment?.merchantReference,
                payment?.externalOrderId,
            ]
                .filter((value) => value != null)
                .map((value) => String(value));

            const paymentProductId = resolvePaymentProductId(payment);
            const paymentType = resolvePaymentType(payment);
            const invoiceMatched = invoiceValue ? candidates.includes(invoiceValue) : false;
            const orderMatched = orderValue ? candidates.includes(orderValue) : false;
            const checkoutMatched = checkoutValue ? candidates.includes(checkoutValue) : false;
            const productMatched =
                productValue && paymentProductId
                    ? String(paymentProductId) === productValue
                    : false;
            const typeMatched =
                expectedTypeValue && paymentType
                    ? paymentType === expectedTypeValue
                    : false;

            let score = 0;
            if (invoiceMatched) score += 8;
            if (orderMatched) score += 12;
            if (checkoutMatched) score += 12;
            if (productMatched) score += 10;
            if (typeMatched) score += 6;

            return { payment, score };
        });

        const prioritized = sortPaymentsByLatest(
            withScores
                .filter((item) => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map((item) => item.payment)
        );

        if (!prioritized.length) {
            const byProduct = sortPaymentsByLatest(
                sourcePayments.filter((payment) => {
                    const paymentProductId = resolvePaymentProductId(payment);
                    return productValue && paymentProductId
                        ? String(paymentProductId) === productValue
                        : false;
                })
            );

            return byProduct
                .map((payment) => extractPaymentRowId(payment))
                .filter(Boolean)
                .map((value) => String(value));
        }

            return prioritized
                .map((payment) => extractPaymentRowId(payment))
                .filter(Boolean)
                .map((value) => String(value));
    } catch {
        return [];
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

        const paymentMatchesPayId = (payment) => {
            const keys = [
                payment?._id,
                payment?.id,
                payment?.paymentId,
                payment?.payId,
                payment?.payment_id,
                payment?.orderId,
                payment?.order_id,
                payment?.tamaraOrderId,
                payment?.checkoutId,
                payment?.checkout_id,
            ]
                .filter((v) => v != null)
                .map((v) => String(v));
            return keys.includes(payValue);
        };

        const matched = payments.find((payment) => {
            if (!paymentMatchesPayId(payment)) return false;
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

const resolveMetaFromCallback = async (
    token,
    invoiceId,
    tamaraOrderId,
    tamaraCheckoutId,
    pendingProductId,
    pendingType
) => {
    if (!token) return null;

    const identifiers = [tamaraOrderId, tamaraCheckoutId, invoiceId]
        .filter((value) => value != null && String(value).trim() !== "")
        .map((value) => String(value));
    if (!identifiers.length) return null;

    for (const identifier of identifiers) {
        for (const key of CALLBACK_QUERY_KEYS) {
            try {
                const response = await fetch(
                    `${CALLBACK_URL}?${key}=${encodeURIComponent(identifier)}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `glowONW${token}`,
                        },
                    }
                );
                if (!response.ok) continue;
                const result = await response.json();
                const callbackProductId =
                    result?.product?._id ??
                    result?.product?.id ??
                    result?.productId ??
                    (typeof result?.product === "string"
                        ? result.product
                        : null) ??
                    pendingProductId;
                const callbackPayId =
                    result?._id ??
                    result?.payId ??
                    result?.paymentId ??
                    result?.payment?._id ??
                    result?.data?._id;
                const callbackType = normalizeMembershipType(
                    result?.product?.type ??
                    result?.type ??
                    result?.cardType ??
                    pendingType
                );

                if (!callbackPayId) continue;
                return {
                    payId: String(callbackPayId),
                    productId: callbackProductId ? String(callbackProductId) : null,
                    type: callbackType || null,
                };
            } catch {
                /* ignore and continue */
            }
        }
    }

    return null;
};

const ApplicationApi = async (setLoading, setError, data, productId, setShowModal, payId) => {
    const token = readToken();
    const invoiceId = localStorage.getItem("invoiceId");
    const tamaraOrderId = localStorage.getItem("tamaraOrderId");
    const tamaraCheckoutId = localStorage.getItem("tamaraCheckoutId");
    const pendingPaymentProvider = localStorage.getItem("pendingPaymentProvider");
    const pendingProductId = localStorage.getItem("pendingActivationProductId");
    const pendingType = normalizeMembershipType(localStorage.getItem("pendingActivationType"));
    if (!token) {
        setError("يرجى تسجيل الدخول أولاً قبل تفعيل العضوية.");
        setLoading(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            window.location.href = "/login";
        }
        return;
    }
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const callbackMeta = await resolveMetaFromCallback(
            token,
            invoiceId,
            tamaraOrderId,
            tamaraCheckoutId,
            pendingProductId || productId,
            pendingType || data?.type
        );
        const effectiveProductId = callbackMeta?.productId || productId || pendingProductId;
        const effectivePayId = callbackMeta?.payId || payId;
        const payTypeMeta = await resolveTypeByPayId(
            token,
            lang,
            effectivePayId,
            effectiveProductId
        );
        const typeSource =
            callbackMeta?.type ||
            payTypeMeta?.rawType ||
            payTypeMeta?.normalizedType ||
            pendingType ||
            data?.type ||
            "";
        const resolvedType =
            normalizeMembershipType(typeSource) || String(typeSource).trim();
        const payload = {
            ...data,
            type: resolvedType,
        };

        console.log("[Activation][create] Initial request", {
            productId: effectiveProductId,
            payId: effectivePayId,
            type: payload?.type,
            payTypeMeta,
            callbackMeta,
            invoiceId,
            tamaraOrderId,
            tamaraCheckoutId,
            pendingPaymentProvider,
        });
        let finalResponse = await activateCardRequest(
            effectiveProductId,
            effectivePayId,
            payload,
            token,
            lang
        );
        let finalResult = await finalResponse.json();
        console.log("[Activation][create] Initial response", {
            status: finalResponse.status,
            ok: finalResponse.ok,
            message: finalResult?.message,
        });

        // If payId from callback is stale/invalid, retry with candidate payIds from notComplete.
        if (!finalResponse.ok && [400, 403, 404].includes(finalResponse.status)) {
            const fallbackPayIds = await resolveFallbackPayIds(
                token,
                lang,
                effectiveProductId,
                invoiceId,
                tamaraOrderId,
                tamaraCheckoutId,
                pendingPaymentProvider,
                payload?.type
            );
            console.log("[Activation][create] Fallback payIds", { fallbackPayIds });
            for (const fallbackPayId of fallbackPayIds) {
                if (!fallbackPayId || String(fallbackPayId) === String(effectivePayId || "")) {
                    continue;
                }
                const fallbackTypeMeta = await resolveTypeByPayId(
                    token,
                    lang,
                    fallbackPayId,
                    effectiveProductId
                );
                const fbTypeSource =
                    fallbackTypeMeta?.rawType ||
                    fallbackTypeMeta?.normalizedType ||
                    payload?.type ||
                    "";
                const fallbackPayload = {
                    ...payload,
                    type:
                        normalizeMembershipType(fbTypeSource) ||
                        String(fbTypeSource).trim(),
                };
                finalResponse = await activateCardRequest(
                    effectiveProductId,
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
                if (finalResponse.ok) break;
            }
        }

        if (finalResponse.ok) {
            try {
                if (payload?.type) {
                    localStorage.setItem("type", normalizeMembershipType(payload.type));
                }
                localStorage.removeItem("pendingActivationProductId");
                localStorage.removeItem("pendingActivationType");
                localStorage.removeItem("pendingPaymentProvider");
                localStorage.removeItem("tamaraOrderId");
                localStorage.removeItem("tamaraCheckoutId");
            } catch {
                /* ignore */
            }
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