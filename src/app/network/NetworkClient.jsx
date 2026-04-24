"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./network.css";
import getCategories from "@/API/Category/getCategories.api";
import Link from "next/link";
import AllFoundations from "@/API/Foundation/AllFoundations";
import { Lang } from "@/Lang/lang";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIconForName } from "./networkFilters";
import NearbyMapModal from "@/components/NearbyMapModal";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const NetworkClient = () => {
  const PAGE_SIZE = 20;
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState(null);
  const [foundations, setFoundations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("ar");
  const [cityId, setCityId] = useState("");
  const [categoriesIds, setCategoriesIds] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);

  const categoriesIdsRef = useRef(categoriesIds);
  useEffect(() => {
    categoriesIdsRef.current = categoriesIds;
  }, [categoriesIds]);

  const langValue = Lang[lang];

  const getAllCategories = () =>
    getCategories(setLoading, setError, setAllCategories);

  const getAllFoundations = useCallback(
    async (selectedCategories, pageToLoad = 1) => {
      const ids =
        selectedCategories !== undefined
          ? selectedCategories
          : categoriesIdsRef.current;
      const region = "";

      const payload = await AllFoundations(
        setLoading,
        setError,
        setFoundations,
        cityId,
        region,
        ids,
        pageToLoad,
        PAGE_SIZE,
      );
      setHasNextPage((payload?.length ?? 0) >= PAGE_SIZE);
    },
    [cityId],
  );

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "ar");
    try {
      const raw = localStorage.getItem("user_city");
      if (!raw) return;
      const c = JSON.parse(raw);
      if (c?.id) setCityId(c.id);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 320,
      once: true,
      offset: 16,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    setPageNumber(1);
    setHasNextPage(true);
  }, [cityId]);

  useEffect(() => {
    getAllFoundations(undefined, pageNumber);
  }, [pageNumber, cityId, categoriesIds, getAllFoundations]);

  useEffect(() => {
    setFilters(
      allCategories.map((cat) => ({
        id: cat.id ?? cat._id ?? cat.name,
        name: cat.name,
        checked: false,
      })),
    );
  }, [allCategories]);

  const toggleFilter = (fid) => {
    const updatedFilters = filters.map((f) =>
      f.id === fid ? { ...f, checked: !f.checked } : f,
    );
    setFilters(updatedFilters);

    const selectedIds = updatedFilters
      .filter((f) => f.checked)
      .map((f) => f.id);

    setCategoriesIds(selectedIds);
    setPageNumber(1);
    setHasNextPage(true);
  };

  const clearAllFilters = () => {
    const resetFilters = filters.map((f) => ({ ...f, checked: false }));
    setFilters(resetFilters);
    setCategoriesIds([]);
    setPageNumber(1);
    setHasNextPage(true);
  };

  const goNextPage = async () => {
    if (loading || !hasNextPage) return;
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
  };

  const goPrevPage = async () => {
    if (loading || pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    setPageNumber(prevPage);
  };

  const activeFilterIds = filters.filter((f) => f.checked).map((f) => f.id);
  const displayedFoundations = foundations.filter((item) => {
    const byFilter =
      activeFilterIds.length === 0 ||
      item.categories?.some((cat) => activeFilterIds.includes(cat._id));
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byFilter && bySearch;
  });

  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      AOS.refresh();
    }, 0);
    return () => window.clearTimeout(t);
  }, [
    loading,
    foundations,
    pageNumber,
    search,
    activeFilterIds.join(","),
    displayedFoundations.length,
  ]);

  const allCitiesLabel = lang === "ar" ? "الكل" : "All";
  const specialtiesLabel = lang === "ar" ? "التخصصات" : "Specialties";

  const categoryDisplayName = (cat) => {
    const n = cat?.name;
    if (n == null) return "";
    if (typeof n === "string") return n;
    if (typeof n === "object") {
      return n[lang] ?? n.ar ?? n.en ?? "";
    }
    return "";
  };

  const formatDistance = (d) => {
    if (d == null || d === "") return null;
    const meters = typeof d === "string" ? parseFloat(d) : Number(d);
    if (!Number.isFinite(meters)) return typeof d === "string" ? d : null;
    const km = meters / 1000;
    const unit = lang === "ar" ? "كم" : "km";
    return `${km.toFixed(1)} ${unit}`;
  };

  return (
    <div className="Network">
      <section className="network_hero_shell">
        <div className="network_hero_inner">
          <header className="network_header">
            <h1 className="network_title">{langValue["networkPageTitle"]}</h1>
            <p className="network_desc">{langValue["networkPageDesc"]}</p>
          </header>
        </div>
      </section>

      <section
        className="network_filters_shell"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="network_filters_inner">
          <p className="network_filters_label">{specialtiesLabel}</p>
          <div className="network_spec_chips">
            <button
              type="button"
              className={`network_spec_chip ${activeFilterIds.length === 0 ? "network_spec_chip_active" : ""}`}
              onClick={clearAllFilters}
            >
              <FontAwesomeIcon icon={categoryIconForName("all")} />
              <span>{allCitiesLabel}</span>
            </button>
            {filters.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`network_spec_chip ${cat.checked ? "network_spec_chip_active" : ""}`}
                onClick={() => toggleFilter(cat.id)}
              >
                <FontAwesomeIcon icon={categoryIconForName(cat.name)} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="network_container">
        <div className="netword_controller">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن مؤسسة..." : "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="network_map_btn"
            onClick={() => setMapOpen(true)}
          >
            ww <FontAwesomeIcon icon={faMapLocationDot} />
            {lang === "ar" ? "الخريطة" : "Map"}
          </button>
        </div>

        <div className="network_list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            displayedFoundations.map((item, index) => {
              const distLabel = formatDistance(item.distance);
              return (
                <div
                  key={item._id ?? index}
                  className="network_item"
                  data-aos="fade-up"
                  data-aos-duration="320"
                  data-aos-delay={Math.min(index * 24, 160)}
                >
                  <Link href={`/foundation-details?id=${item._id}`}>
                    <img src={item.images[0]} alt={item.name} />
                    {distLabel && (
                      <p className="network_item_distance">
                        {lang === "ar" ? "المسافة: " : "Distance: "}
                        {distLabel}
                      </p>
                    )}
                    <h3>{item.name}</h3>
                    {Array.isArray(item.categories) &&
                      item.categories.length > 0 && (
                        <div className="network_item_categories">
                          {item.categories.map((cat, catIndex) => {
                            const label = categoryDisplayName(cat);
                            if (!label) return null;
                            return (
                              <span
                                key={
                                  cat._id ?? cat.id ?? `${catIndex}-${label}`
                                }
                                className="network_item_category"
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                  </Link>
                </div>
              );
            })
          )}
          {!loading && displayedFoundations.length === 0 && (
            <div
              className="no-results"
              data-aos="fade-up"
              data-aos-duration="320"
            >
              <div className="no-results-icon">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#aaa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3>
                {lang === "ar" ? "لا توجد مؤسسات" : "No Foundations Found"}
              </h3>
              <p>
                {lang === "ar"
                  ? "لم يتم العثور على نتائج تطابق الفلاتر أو البحث الحالي."
                  : "No results were found that match your filters or current search."}
              </p>
            </div>
          )}
        </div>
        {!loading && displayedFoundations.length > 0 && (
          <div className="network_pagination">
            <button
              type="button"
              className="network_page_btn"
              onClick={goPrevPage}
              disabled={pageNumber <= 1}
            >
              {lang === "ar" ? "السابق" : "Previous"}
            </button>
            <span className="network_page_number">
              {lang === "ar" ? `صفحة ${pageNumber}` : `Page ${pageNumber}`}
            </span>
            <button
              type="button"
              className="network_page_btn"
              onClick={goNextPage}
              disabled={!hasNextPage}
            >
              {lang === "ar" ? "التالي" : "Next"}
            </button>
          </div>
        )}
      </div>

      <NearbyMapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        lang={lang}
      />
    </div>
  );
};

export default NetworkClient;
