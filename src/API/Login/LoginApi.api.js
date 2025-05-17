const URL = "https://glow-card.onrender.com/api/v1/auth/login";

const LoginApi = async (setloading, setError, data, router) => {
    setloading(true)
    const lang = localStorage.getItem("lang")

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "accept-language": `${lang}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            router.push(`/otp?phone=${data.identifier}`);
            localStorage.setItem("phone", data.identifier)
        } else {
            if (response.status == 403) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 404) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            }
            else if (response.status == 500) {
                console.log(result.message);

            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default LoginApi;