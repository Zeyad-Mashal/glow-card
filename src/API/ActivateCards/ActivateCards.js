const URL = "https://glow-card.onrender.com/api/v1/card/notComplete";

const ActivateCards = async (setloading, setError, setAllCardsActivations) => {
    setloading(true)
    const lang = localStorage.getItem("lang")
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "accept-language": `${lang}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllCardsActivations(result.payments)
            console.log("test");

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
export default ActivateCards;