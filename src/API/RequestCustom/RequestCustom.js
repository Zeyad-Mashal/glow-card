const URL = "https://glow-card.onrender.com/api/v1/contact/send?type=Company";

const RequestCustom = async (setRequestLoading, setRequestError, data) => {
    setRequestLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "accept-language": `${lang}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setRequestLoading(false);
        } else {
            if (response.status == 404) {
                setRequestError(result.message)
                setRequestLoading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setRequestError(result.message)
                setRequestLoading(false);
            }
            setRequestLoading(false)
        }
    } catch (error) {
        setRequestError('An error occurred');
        setRequestLoading(false)
    }
}
export default RequestCustom;