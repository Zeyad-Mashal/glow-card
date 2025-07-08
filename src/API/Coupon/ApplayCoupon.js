const URL = "https://glow-card.onrender.com/api/v1/coupon/apply";
const ApplayCoupon = async (setloading, setError, data) => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang")

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
            // setDiscount(result.discount)
            console.log(result);

        } else {
            if (response.status == 403) {
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