const URL = "https://glow-card.onrender.com/api/v1/auth/login";

const LoginApi = async (setloading, setError, data, router) => {
    setloading(true)
    const lang = localStorage.getItem("lang") || "ar";

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
            const flowId = result.id ?? result.data?.id;
            if (flowId != null && flowId !== "") {
                localStorage.setItem("loginOtpId", String(flowId));
            }
            localStorage.setItem("phone", data.identifier);
            router.push(`/otp?phone=${encodeURIComponent(data.identifier)}`);
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
                setError(result.message || "حدث خطأ في السيرفر. حاول مرة أخرى.");
            } else {
                setError(result.message || "تعذر تسجيل الدخول.");
            }
            setloading(false);
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default LoginApi;