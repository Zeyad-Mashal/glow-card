const URL = "https://glow-card.onrender.com/api/v1/user/info";

const InvitationCode = async (setloading, setError, setCode) => {
    setloading(true);

    let token;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    } else {
        token = null; // لو عايز، ممكن تتعامل مع null بغير طريقة
    }

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "accept-language": "ar"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setCode(result.invitationCode);
            console.log(result.invitationCode);

        } else {
            if (response.status == 404) {
                setError(result.message);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message);
            }
            setloading(false);
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false);
    }
};

export default InvitationCode;
