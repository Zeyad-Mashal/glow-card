"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./network.css";
import getCategories from "@/API/Category/getCategories.api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AllFoundations from "@/API/Foundation/AllFoundations";
import { Lang } from "@/Lang/lang";
import City from "@/API/City/City.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIconForName } from "./networkFilters";
import NearbyMapModal from "@/components/NearbyMapModal";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const NetworkClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foundations, setFoundations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("ar");
  const [categoriesIds, setCategoriesIds] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const viewAll = searchParams.get("view") === "all";

  const categoriesIdsRef = useRef(categoriesIds);
  useEffect(() => {
    categoriesIdsRef.current = categoriesIds;
  }, [categoriesIds]);

  const langValue = Lang[lang];

  const getAllCategories = () =>
    getCategories(setLoading, setError, setAllCategories);

  const getAllFoundations = useCallback(
    (selectedCategories) => {
      const ids =
        selectedCategories !== undefined
          ? selectedCategories
          : categoriesIdsRef.current;

      if (viewAll) {
        AllFoundations(setLoading, setError, setFoundations, "", "", ids);
        return;
      }

      let region = "";
      let city = "";

      try {
        const raw = localStorage.getItem("user_city");
        const cityData = raw ? JSON.parse(raw) : null;
        const name = cityData?.name || "";

        if (name === "الرياض" || name === "جده") {
          region = id || "";
        } else {
          city = id || "";
        }
      } catch {
        city = id || "";
      }

      AllFoundations(
        setLoading,
        setError,
        setFoundations,
        city,
        region,
        ids
      );
    },
    [id, viewAll]
  );

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "ar");
  }, []);

  useEffect(() => {
    if (id || viewAll) return;
    try {
      const raw = localStorage.getItem("user_city");
      if (!raw) return;
      const c = JSON.parse(raw);
      if (c?.id && c?.name) {
        const url =
          c.name === "الرياض" || c.name === "جده"
            ? `/central?id=${c.id}`
            : `/network?id=${c.id}`;
        window.location.replace(url);
      }
    } catch {
      /* ignore */
    }
  }, [id, viewAll]);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    getAllFoundations(categoriesIdsRef.current);
    AOS.init({ duration: 800, once: true });
  }, [id, viewAll, getAllFoundations]);

  useEffect(() => {
    setFilters(
      allCategories.map((cat) => ({
        id: cat.id ?? cat._id ?? cat.name,
        name: cat.name,
        checked: false,
      }))
    );
  }, [allCategories]);

  useEffect(() => {
    City(setCitiesLoading, setCitiesError, setAllCities);
  }, []);

  const toggleFilter = (fid) => {
    const updatedFilters = filters.map((f) =>
      f.id === fid ? { ...f, checked: !f.checked } : f
    );
    setFilters(updatedFilters);

    const selectedIds = updatedFilters
      .filter((f) => f.checked)
      .map((f) => f.id);

    setCategoriesIds(selectedIds);
    getAllFoundations(selectedIds);
  };

  const clearAllFilters = () => {
    const resetFilters = filters.map((f) => ({ ...f, checked: false }));
    setFilters(resetFilters);
    setCategoriesIds([]);
    getAllFoundations([]);
  };

  const activeFilterIds = filters.filter((f) => f.checked).map((f) => f.id);
  const displayedFoundations = foundations.filter((item) => {
    const byFilter =
      activeFilterIds.length === 0 ||
      item.categories?.some((cat) => activeFilterIds.includes(cat._id));
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byFilter && bySearch;
  });

  const selectCity = (item) => {
    localStorage.setItem(
      "user_city",
      JSON.stringify({ id: item._id, name: item.name })
    );
    const url =
      item.name === "الرياض" || item.name === "جده"
        ? `/central?id=${item._id}`
        : `/network?id=${item._id}`;
    window.location.href = url;
  };

  const selectAllCitiesView = () => {
    window.location.href = "/network?view=all";
  };

  const allCitiesLabel = lang === "ar" ? "الكل" : "All";
  const citiesSectionLabel = lang === "ar" ? "المدن" : "Cities";
  const specialtiesLabel = lang === "ar" ? "التخصصات" : "Specialties";

  const isCityTabActive = (cityItem) => {
    if (viewAll) return false;
    return cityItem._id === id;
  };

  return (
    <div className="Network">
      <div className="network_container">
        <header className="network_header">
          <h1 className="network_title">{langValue["networkPageTitle"]}</h1>
          <p className="network_desc">{langValue["networkPageDesc"]}</p>
        </header>
      </div>

      <section
        className="network_filters_shell"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="network_filters_inner">
          <p className="network_filters_label">{citiesSectionLabel}</p>
          <div className="network_city_tabs">
            <button
              type="button"
              className={`network_city_tab ${viewAll ? "network_city_tab_active" : ""}`}
              onClick={selectAllCitiesView}
            >
              {allCitiesLabel}
            </button>
            {citiesLoading && (
              <span className="network_filters_muted">…</span>
            )}
            {citiesError && (
              <span className="network_filters_muted">{citiesError}</span>
            )}
            {!citiesLoading &&
              allCities.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`network_city_tab ${isCityTabActive(item) ? "network_city_tab_active" : ""}`}
                  onClick={() => selectCity(item)}
                >
                  {item.name}
                </button>
              ))}
          </div>

          <div className="network_filters_divider" />

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
            <FontAwesomeIcon icon={faMapLocationDot} />
            {lang === "ar" ? "الخريطة" : "Map"}
          </button>
        </div>

        <div className="network_list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            displayedFoundations.map((item, index) => (
              <div
                key={item._id ?? index}
                className="network_item"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link href={`/foundation-details?id=${item._id}`}>
                  <img src={item.images[0]} alt={item.name} />
                  <h3>{item.name}</h3>
                </Link>
              </div>
            ))
          )}
          {!loading && displayedFoundations.length === 0 && (
            <div className="no-results" data-aos="fade-up">
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
      </div>

      <NearbyMapModal open={mapOpen} onClose={() => setMapOpen(false)} lang={lang} />
    </div>
  );
};

export default NetworkClient;
