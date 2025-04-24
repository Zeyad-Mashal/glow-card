const URL = "https://glow-card.onrender.com/api/v1/auth/web/google";

const Google = async (setError, data, router) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token);
            router.push(`/`);
        } else {
            if (response.status == 403) {
                setError(result.message)
            } else if (response.status == 502) {
                console.log(result.message);
                setError(result.message)
            }
        }
    } catch (error) {
        setError('An error occurred');
    }
}
export default Google;