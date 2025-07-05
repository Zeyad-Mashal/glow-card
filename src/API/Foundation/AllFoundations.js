const URL = "https://glow-card.onrender.com/api/v1/foundation/get";

const AllFoundations = async (setloading, setError, setFoundations, cityId, regionId) => {
    setloading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(`${URL}?city=${cityId}&&region=${regionId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "accept-language": `${lang}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setFoundations(result.foundations)
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
export default AllFoundations;