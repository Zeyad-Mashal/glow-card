import normalizeMembershipType from "@/utils/normalizeMembershipType";
import {
  PAYMENT_PROVIDER_PRIMARY,
  markPrimaryPaymentContext,
  filterPaymentsByProvider,
} from "@/utils/paymentProviderContext";

const URL = "https://glow-card.onrender.com/api/v1/payment/callback";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";
const RETRY_COUNT = 10;
const RETRY_DELAY_MS = 1200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const extractPaymentRowId = (payment) =>
    payment?._id ??
    payment?.id ??
    payment?.paymentId ??
    payment?.payId ??
    payment?.payment_id ??
    null;

const resolvePaymentProductId = (payment) =>
    payment?.product?._id ??
    payment?.product?.id ??
    payment?.productId ??
    (typeof payment?.product === "string" ? payment.product : null);

const resolvePaymentType = (payment) =>
    normalizeMembershipType(
        payment?.product?.type ?? payment?.type ?? payment?.cardType ?? "",
    );

async function resolvePendingPayId(token, lang, invoiceId, productId, expectedType) {
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
        const allPayments = Array.isArray(result?.payments) ? result.payments : [];
        if (!allPayments.length) return null;

        const pendingPaymentProvider =
            localStorage.getItem("pendingPaymentProvider") || PAYMENT_PROVIDER_PRIMARY;
        const payments = filterPaymentsByProvider(allPayments, pendingPaymentProvider);

        const invoiceValue = invoiceId != null ? String(invoiceId) : null;
        const productValue = productId != null ? String(productId) : null;
        const expectedTypeValue = normalizeMembershipType(expectedType);

        const byInvoice = payments.find((payment) => {
            const candidates = [
                payment?.invoiceId,
                payment?.invoice_id,
                payment?.invoiceNumber,
                payment?.paymentId,
                payment?.payId,
                payment?._id,
            ]
                .filter((value) => value != null)
                .map((value) => String(value));

            return invoiceValue ? candidates.includes(invoiceValue) : false;
        });
        if (byInvoice) {
            const payRowId = extractPaymentRowId(byInvoice);
            if (payRowId) return payRowId;
        }

        const productMatches = payments.filter((payment) => {
            const paymentProductId = resolvePaymentProductId(payment);
            if (!(productValue && paymentProductId)) return false;
            if (String(paymentProductId) !== productValue) return false;

            if (!expectedTypeValue) return true;
            const paymentType = resolvePaymentType(payment);
            return paymentType ? paymentType === expectedTypeValue : true;
        });

        if (productMatches.length) {
            const latestByProduct = [...productMatches].sort((a, b) => {
                const aDate = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
                const bDate = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
                return bDate - aDate;
            })[0];
            const payRowId = extractPaymentRowId(latestByProduct);
            if (payRowId) return payRowId;
        }
    } catch {
        /* ignore */
    }

    return null;
}

async function fetchCallbackResult(token, invoiceId) {
    const response = await fetch(`${URL}?invoiceId=${encodeURIComponent(invoiceId)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": `glowONW${token}`,
        },
    });

    if (!response.ok) return null;
    return response.json();
}

const PaymentCallback = async (setloading, setModel, setLoadingModel, setModelError) => {
    setloading(true);
    const invoiceId = localStorage.getItem("invoiceId");
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang") || "ar";
    const pendingType = normalizeMembershipType(
        localStorage.getItem("pendingActivationType"),
    );

    if (!token || !invoiceId) {
        setloading(false);
        setModelError(true);
        setLoadingModel(false);
        return;
    }

    markPrimaryPaymentContext();

    try {
        let callbackResult = null;

        for (let attempt = 0; attempt < RETRY_COUNT; attempt += 1) {
            callbackResult = await fetchCallbackResult(token, invoiceId);
            const productId = resolveProductId(callbackResult);
            const directPayId = extractPayId(callbackResult);

            if (productId && directPayId) {
                break;
            }

            if (attempt < RETRY_COUNT - 1) {
                await sleep(RETRY_DELAY_MS);
            }
        }

        if (!callbackResult) {
            setloading(false);
            setModelError(true);
            setLoadingModel(false);
            return;
        }

        setModel(true);
        setLoadingModel(false);
        setloading(false);

        setTimeout(async () => {
            const productId = resolveProductId(callbackResult);
            const type = resolveActivationType(callbackResult);
            const directPayId = extractPayId(callbackResult);

            const fallbackPayId = await resolvePendingPayId(
                token,
                lang,
                invoiceId,
                productId,
                type || pendingType,
            );
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

            if (!finalPayId || !productId) {
                setModelError(true);
                setModel(false);
                window.location.href = "/our_cards";
                return;
            }

            window.location.href = next;
        }, 500);
    } catch {
        setloading(false);
        setModelError(true);
        setLoadingModel(false);
    }
};

export default PaymentCallback;
