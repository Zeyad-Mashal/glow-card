"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./network.css"; // ضمّن التعديلات هنا
// import Foundation from "@/API/Foundation/Foundation.api";
import getCategories from "@/API/Category/getCategories.api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AllFoundations from "@/API/Foundation/AllFoundations";
import { Lang } from "@/Lang/lang";
const NetworkClient = () => {
  /* -------------------- state -------------------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foundations, setFoundations] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filters, setFilters] = useState([]); // ← حالة الفلاتر
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState(""); // حقل البحث
  const [lang, setLang] = useState("ar");
  const [cityId, setCityId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [categoriesIds, setCategoriesIds] = useState([]);
  /* -------------------- طرق المساعد -------------------- */
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const langValue = Lang[lang];

  /* -------------------- Effects -------------------- */
  /* ثبّت اللغة */
  useEffect(() => {
    setLang(localStorage.getItem("lang") || "en");
  }, []);

  /* جلب البيانات عند دخول الصفحة أو تغيّر id */
  useEffect(() => {
    getAllFoundations([]);
    getAllCategories();
    AOS.init({ duration: 800, once: true });
  }, [id]);

  /* مزامنة filters مع allCategories */
  useEffect(() => {
    setFilters(
      allCategories.map((cat) => ({
        id: cat.id ?? cat._id ?? cat.name,
        name: cat.name,
        checked: false,
      }))
    );
  }, [allCategories]);

  /* -------------------- API Calls -------------------- */
  const getAllFoundations = (selectedCategories = categoriesIds) => {
    const cityData = JSON.parse(localStorage.getItem("user_city"));
    const name = cityData?.name || "";
    let region = "";
    let city = "";

    if (name === "الرياض" || name === "جده") {
      setRegionId(id);
      region = id;
    } else {
      setCityId(id);
      city = id;
    }

    AllFoundations(
      setLoading,
      setError,
      setFoundations,
      city,
      region,
      selectedCategories
    );
  };

  console.log(foundations);

  const getAllCategories = () =>
    getCategories(setLoading, setError, setAllCategories);

  /* -------------------- فلترة وتفعيل -------------------- */
  const toggleFilter = (fid) => {
    const updatedFilters = filters.map((f) =>
      f.id === fid ? { ...f, checked: !f.checked } : f
    );
    setFilters(updatedFilters);

    const selectedIds = updatedFilters
      .filter((f) => f.checked)
      .map((f) => f.id);

    setCategoriesIds(selectedIds);

    // نعيد جلب الجهات حسب الفلاتر الجديدة
    getAllFoundations(selectedIds);
  };

  /* فلتر التأسيسات حسب الفلاتر المختارة */
  const activeFilterIds = filters.filter((f) => f.checked).map((f) => f.id);
  const displayedFoundations = foundations.filter((item) => {
    const byFilter =
      activeFilterIds.length === 0 ||
      item.categories?.some((cat) => activeFilterIds.includes(cat._id));
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byFilter && bySearch;
  });

  const clearAllFilters = () => {
    const resetFilters = filters.map((f) => ({ ...f, checked: false }));
    setFilters(resetFilters);
    setCategoriesIds([]);
    getAllFoundations([]); // بدون فلاتر
  };

  const specialtyKeys = ["networkSpec1", "networkSpec2", "networkSpec3", "networkSpec4", "networkSpec5", "networkSpec6", "networkSpec7", "networkSpec8", "networkSpec9"];

  /* -------------------- JSX -------------------- */
  return (
    <div className="Network">
      <div className="network_container">
        {/* ======= عنوان ووصف الصفحة ======= */}
        <header className="network_header">
          <h1 className="network_title">{langValue["networkPageTitle"]}</h1>
          <p className="network_desc">{langValue["networkPageDesc"]}</p>
        </header>

        {/* ======= التخصصات ======= */}
        <section className="network_specialties">
          <h2 className="network_spec_heading">{lang === "ar" ? "التخصصات" : "Specialties"}</h2>
          <div className="network_spec_grid">
            {specialtyKeys.map((key, i) => (
              <div key={key} className="network_spec_card" data-aos="fade-up" data-aos-delay={i * 50}>
                <span className="network_spec_text">{langValue[key]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ======= شريط البحث والفلاتر ======= */}
        <div className="netword_controller">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث عن مؤسسة..." : "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="filter_btn" onClick={() => setModalOpen(true)}>
            <img src="/images/filter.png" alt="" />
          </button>
        </div>

        {/* ======= المودال ======= */}
        {modalOpen && (
          <div className="modal_backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{lang === "ar" ? "جميع الفلاتر" : "Filters"}</h2>

              <div className="modal_filters">
                <div className="modal_filter_item" key="all">
                  <span>{lang === "ar" ? "الكل" : "All"}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={activeFilterIds.length === 0}
                      onChange={clearAllFilters}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {filters.map((cat) => (
                  <div className="modal_filter_item" key={cat.id}>
                    <span>{cat.name}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={cat.checked}
                        onChange={() => toggleFilter(cat.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="actions">
                <button className="btn" onClick={() => setModalOpen(false)}>
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======= قائمة الجهات ======= */}
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
                {/* SVG Animated Icon */}
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
    </div>
  );
};

export default NetworkClient;
