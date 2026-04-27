const URL = "https://glow-card.onrender.com/api/v1/payment/pay/tamara";
const TamaraPayment = async (setloading, setError, data) => {
    const token = localStorage.getItem("token");
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            if (result && result.checkoutUrl) {
                if (result.orderId) {
                    localStorage.setItem("tamaraOrderId", result.orderId);
                }
                if (result.checkoutId) {
                    localStorage.setItem("tamaraCheckoutId", result.checkoutId);
                }
                window.location.href = result.checkoutUrl
            } else {
                alert("error")
                setError("failed to connect to your payment try again!!")
            }
            setloading(false);
        } else {
            if (response.status == 404) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default TamaraPayment;