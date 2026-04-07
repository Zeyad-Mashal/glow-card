const URL = "https://glow-card.onrender.com/api/v1/foundation/get";

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
    const query = new URLSearchParams({
      city: cityId || "",
      region: regionId || "",
      categories: Array.isArray(categoriesIds)
        ? categoriesIds.join(",")
        : categoriesIds || "",
      pageNumber: String(pageNumber),
      // keep both keys to support backend variants
      page: String(pageNumber),
      limit: String(limit),
    });

    const response = await fetch(`${URL}?${query.toString()}`, {
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