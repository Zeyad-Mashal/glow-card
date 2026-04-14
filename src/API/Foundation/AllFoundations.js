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

    const lng =
      coords != null && coords.lat != null && coords.lat !== ""
        ? String(coords.lat)
        : null;
    const lat =
      coords != null && coords.lng != null && coords.lng !== ""
        ? String(coords.lng)
        : null;
    const hasLngLat =
      lng != null &&
      lat != null &&
      !Number.isNaN(Number(lng)) &&
      !Number.isNaN(Number(lat));

    const city = encodeURIComponent(cityId || "");
    const region = encodeURIComponent(regionId || "");
    const categories = encodeURIComponent(categoriesValue);
    const page = encodeURIComponent(String(pageNumber));
    const limitEnc = encodeURIComponent(String(limit));

    let queryString = `city=${city}`;
    if (hasLngLat) {
      queryString += `&lng=${encodeURIComponent(lng)}&lat=${encodeURIComponent(lat)}`;
    }
    queryString += `&region=${region}&categories=${categories}&pageNumber=${page}&page=${page}&limit=${limitEnc}`;

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