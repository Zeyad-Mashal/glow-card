import normalizeMembershipType from "@/utils/normalizeMembershipType";
const URL = "https://glow-card.onrender.com/api/v1/payment/callback";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";

function resolveProductId(result) {
    const pendingProductId =
        typeof window !== "undefined"
            ? localStorage.getItem("pendingActivationProductId")
            : null;

    return (
        result?.product?._id ??
        result?.product?.id ??
        result?.productId ??
        (typeof result?.product === "string" ? result.product : null) ??
        pendingProductId
    );
}

function extractPayId(result) {
    return (
        result?._id ??
        result?.payId ??
        result?.paymentId ??
        result?.payment?._id ??
        result?.data?._id
    );
}

function activationPathFromCallback(productId, payId) {

    if (!productId || !payId) return "/";

    return `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(payId)}`;
}

function resolveActivationType(result) {
    const pendingType =
        typeof window !== "undefined"
            ? localStorage.getItem("pendingActivationType")
            : null;

    return normalizeMembershipType(
        result?.product?.type ??
        result?.type ??
        result?.cardType ??
        pendingType
    );
}

async function resolvePendingPayId(token, lang, invoiceId, productId) {
    if (!token) return null;

    try {
        const response = await fetch(NOT_COMPLETE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "accept-language": `${lang || "ar"}`,
            },
        });

        if (!response.ok) return null;

        const result = await response.json();
        const payments = Array.isArray(result?.payments) ? result.payments : [];
        if (!payments.length) return null;

        const invoiceValue = invoiceId != null ? String(invoiceId) : null;
        const productValue = productId != null ? String(productId) : null;

        const byInvoice = payments.find((payment) => {
            const candidates = [
                payment?.invoiceId,
                payment?.invoice_id,
                payment?.invoiceNumber,
                payment?.paymentId,
                payment?.payId,
            ]
                .filter((value) => value != null)
                .map((value) => String(value));

            return invoiceValue ? candidates.includes(invoiceValue) : false;
        });
        if (byInvoice?._id) return byInvoice._id;

        const productMatches = payments.filter((payment) => {
            const paymentProductId =
                payment?.product?._id ??
                payment?.product?.id ??
                payment?.productId ??
                (typeof payment?.product === "string" ? payment.product : null);

            return productValue && paymentProductId
                ? String(paymentProductId) === productValue
                : false;
        });
        if (productMatches.length) {
            const latestByProduct = [...productMatches].sort((a, b) => {
                const aDate = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
                const bDate = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
                return bDate - aDate;
            })[0];
            if (latestByProduct?._id) return latestByProduct._id;
        }
    } catch {
        /* ignore */
    }

    return null;
}

const PaymentCallback = async (setloading, setModel, setLoadingModel, setModelError) => {
    setloading(true)
    const invoiceId = localStorage.getItem("invoiceId")
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang") || "ar";
    try {
        const response = await fetch(`${URL}?invoiceId=${invoiceId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
        });
        const result = await response.json();

        if (response.ok) {
            setModel(true)
            setLoadingModel(false)
            setloading(false);

            setTimeout(() => {
                const productId = resolveProductId(result);
                const type = resolveActivationType(result);
                const directPayId = extractPayId(result);

                resolvePendingPayId(token, lang, invoiceId, productId).then((fallbackPayId) => {
                    // The callback payId is tied to the latest checkout session.
                    // Fallback to notComplete only when callback payload has no usable payId.
                    const finalPayId = directPayId || fallbackPayId;
                    const next = activationPathFromCallback(productId, finalPayId);

                    try {
                        if (type) {
                            localStorage.setItem("type", type);
                        }
                        localStorage.removeItem("pendingActivationProductId");
                        localStorage.removeItem("pendingActivationType");
                    } catch {
                        /* ignore */
                    }
                    window.location.href = next;
                });
            }, 500);
        } else {
            if (response.status == 404) {
                setloading(false);
                setModelError(true)
                setLoadingModel(false)
            } else if (response.status == 400) {
                setloading(false);
                setModelError(true)
                setLoadingModel(false)
            }
        }
    } catch (error) {
        setloading(false);
        setModelError(true)
        setLoadingModel(false)
    }
}
export default PaymentCallback;