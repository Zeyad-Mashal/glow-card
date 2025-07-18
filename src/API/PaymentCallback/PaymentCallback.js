const URL = "https://glow-card.onrender.com/api/v1/payment/callback";
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
                window.location.href = "/"
            }, 400000);
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