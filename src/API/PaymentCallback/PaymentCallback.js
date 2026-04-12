const URL = "https://glow-card.onrender.com/api/v1/payment/callback";

function activationPathFromCallback(result, invoiceId) {
    const pendingProductId =
        typeof window !== "undefined"
            ? localStorage.getItem("pendingActivationProductId")
            : null;

    const productId =
        result?.product?._id ??
        result?.product?.id ??
        result?.productId ??
        (typeof result?.product === "string" ? result.product : null) ??
        pendingProductId;

    const payId =
        result?._id ??
        result?.payId ??
        result?.paymentId ??
        result?.payment?._id ??
        result?.data?._id ??
        invoiceId;

    if (!productId || !payId) return "/";

    return `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(payId)}`;
}

const PaymentCallback = async (setloading, setModel, setLoadingModel, setModelError) => {
    setloading(true)
    const invoiceId = localStorage.getItem("invoiceId")
    const token = localStorage.getItem("token");
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
                const next = activationPathFromCallback(result, invoiceId);
                try {
                    localStorage.removeItem("pendingActivationProductId");
                } catch {
                    /* ignore */
                }
                window.location.href = next;
            }, 4000);
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