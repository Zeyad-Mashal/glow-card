const URL = "https://glow-card.onrender.com/api/v1/foundation/allInMap";

const getAllInMapFoundations = async (setloading, setError, setFoundations) => {
  setloading(true);
  const lang = localStorage.getItem("lang");

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "accept-language": `${lang}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      const payload = Array.isArray(result)
        ? result
        : result?.foundations ?? result?.nearby ?? result?.data ?? [];
      setFoundations(Array.isArray(payload) ? payload : []);
      setloading(false);
      return;
    }

    if (response.status == 404) {
      setError(result.message);
    } else if (response.status == 500) {
      setError(result.message);
    } else {
      setError(result.message || "Request failed");
    }
    setloading(false);
  } catch (error) {
    setError("An error occurred");
    setloading(false);
  }
};

export default getAllInMapFoundations;

