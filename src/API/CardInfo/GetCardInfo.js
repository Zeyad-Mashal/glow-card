const URL = "https://glow-card.onrender.com/api/v1/card/info";

const GetCardInfo = async (setloading, setError, setCardInfo) => {
    setloading(true)
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setCardInfo(result.cards)
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
export default GetCardInfo;