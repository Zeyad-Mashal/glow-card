const URL = "https://glow-card.onrender.com/api/v1/foundation/nearby";

const getNearbyFoundations = async (
  setloading,
  setError,
  setFoundations,
  lat,
  lng
) => {
  setloading(true);
  const lang = localStorage.getItem("lang");

  try {
    const response = await fetch(
      `${URL}?lat=${lat}&&lng=${lng}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "accept-language": `${lang}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      setloading(false);
      // backend may return different shapes; keep the most likely arrays
      const payload = Array.isArray(result)
        ? result
        : result?.foundations ?? result?.nearby ?? result?.data ?? [];
      setFoundations(Array.isArray(payload) ? payload : []);
    } else {
      if (response.status == 404) {
        setError(result.message);
        setloading(false);
      } else if (response.status == 500) {
        setError(result.message);
        setloading(false);
      } else {
        setError(result.message || "Request failed");
        setloading(false);
      }
      setloading(false);
    }
  } catch (error) {
    setError("An error occurred");
    setloading(false);
  }
};

export default getNearbyFoundations;

