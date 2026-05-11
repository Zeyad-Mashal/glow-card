const URL = "https://glow-card.onrender.com/api/v1/coupon/apply";
const ApplayCoupon = async (setloading, setError, data, setDiscount, setPrice) => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang")
    const price = localStorage.getItem("price")
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "accept-language": `${lang}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setDiscount(result.discount)
            let finalPrice = Math.ceil(price - (price * result.discount / 100));
            setPrice(finalPrice)
        } else {
            if (response.status == 404) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 502) {
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
export default ApplayCoupon;