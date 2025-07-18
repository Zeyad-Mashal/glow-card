const URL = "https://glow-card.onrender.com/api/v1/payment/pay";
const Payment = async (setloading, setError, data) => {
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
            if (result && result.Url) {
                window.location.href = `${result.Url}?invoiceId=${result.invoiceId}`;
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
export default Payment;

/* 
const URL = "https://glow-card.onrender.com/api/v1/payment/pay";
const Payment = async (setloading, setError, data) => {
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
            if (result && result.Url) {
                localStorage.setItem("invoiceId", result.invoiceId)
                window.location.href = result.Url
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
export default Payment;

*/