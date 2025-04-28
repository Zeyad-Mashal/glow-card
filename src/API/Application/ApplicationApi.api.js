const URL = "https://glow-card.onrender.com/api/v1/card/create/";
const token = localStorage.getItem("token");
const ApplicationApi = async (setLoading, setError, data, id, setShowModal) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setShowModal(true)
            setLoading(false);
        } else {
            if (response.status == 403) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 404) {
                console.log(result.message);
                setError(result.message)
                setLoading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setLoading(false);
            }
            setLoading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default ApplicationApi;