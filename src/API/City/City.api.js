const URL = "https://glow-card.onrender.com/api/v1/city/get";

/** مدينة افتراضية عند فشل جلب القائمة (الرياض من بيانات الـ API الإنتاجية) */
export const DEFAULT_USER_CITY = {
    id: "69d18f0ede880d01856c6f68",
    name: "الرياض",
};

const getLangSafe = () => {
    try {
        if (typeof window === "undefined") return "ar";
        return localStorage.getItem("lang") || "ar";
    } catch {
        return "ar";
    }
};

const City = async (setloading, setError, setAllCities) => {
    setloading(true)
    const lang = getLangSafe()
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "accept-language": `${lang}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllCities(result.cities)
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
export default City;