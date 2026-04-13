const URL = "https://glow-card.onrender.com/api/v1/foundation/get";

function getGeoCoords() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  });
}

const AllFoundations = async (
  setloading,
  setError,
  setFoundations,
  cityId,
  regionId,
  categoriesIds,
  pageNumber = 1,
  limit = 20,
) => {
  setloading(true);
  const lang = localStorage.getItem("lang");
  try {
    const coords = await getGeoCoords();

    const categoriesValue = Array.isArray(categoriesIds)
      ? categoriesIds.join(",")
      : categoriesIds || "";

    const parts = [];
    parts.push(`city=${encodeURIComponent(cityId || "")}`);
    if (coords) {
      parts.push(`lng=${encodeURIComponent(String(coords.lng))}`);
      parts.push(`lat=${encodeURIComponent(String(coords.lat))}`);
    }
    parts.push(`region=${encodeURIComponent(regionId || "")}`);
    parts.push(`categories=${encodeURIComponent(categoriesValue)}`);
    parts.push(`pageNumber=${encodeURIComponent(String(pageNumber))}`);
    // keep both keys to support backend variants
    parts.push(`page=${encodeURIComponent(String(pageNumber))}`);
    parts.push(`limit=${encodeURIComponent(String(limit))}`);

    const queryString = parts.join("&");

    const response = await fetch(`${URL}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "accept-language": `${lang}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      const foundations = Array.isArray(result?.foundations)
        ? result.foundations
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];
      setFoundations(foundations);
      setloading(false);
      return foundations;
    }

    if (response.status == 404) {
      setError(result.message);
    } else if (response.status == 500) {
      console.log(result.message);
      setError(result.message);
    } else {
      setError(result.message || "Request failed");
    }
    setloading(false);
    return [];
  } catch (error) {
    setError("An error occurred");
    setloading(false);
    return [];
  }
};
export default AllFoundations;