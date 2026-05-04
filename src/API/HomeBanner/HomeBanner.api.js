const HomeBanner = async (setloading, setError, getAllBanners, lang, cityId) => {
    setloading(true);
    const l = lang || "ar";
    const c = cityId != null && cityId !== "" ? String(cityId) : "";
    const URL = `https://glow-card.onrender.com/api/v1/ads/get?lang=${l}&city=${c}`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        console.log(URL);

        if (response.ok) {
            setloading(false);
            getAllBanners(Array.isArray(result.ads) ? result.ads : []);
            return;
        }

        // السيرفر يرجّع 404 مع رسالة "لا يوجد إعلانات" — نعتبرها قائمة فارغة وليست خطأ في الرابط
        if (response.status === 404) {
            setloading(false);
            setError("");
            getAllBanners(Array.isArray(result.ads) ? result.ads : []);
            return;
        }

        if (response.status === 500) {
            console.log(result.message);
        }
        setError(result.message || "Request failed");
        setloading(false);
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default HomeBanner;