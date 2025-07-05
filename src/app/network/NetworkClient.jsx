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
  /* -------------------- طرق المساعد -------------------- */
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  /* -------------------- Effects -------------------- */
  /* ثبّت اللغة */
  useEffect(() => {
    setLang(localStorage.getItem("lang") || "en");
  }, []);

  /* جلب البيانات عند دخول الصفحة أو تغيّر id */
  useEffect(() => {
    getAllFoundations();
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
  const getAllFoundations = () => {
    const cityData = JSON.parse(localStorage.getItem("user_city"));
    const name = cityData.name;
    let region = "";
    let city = "";
    if (name === "الرياض" || name === "جده") {
      setRegionId(id);
      region = id;
    } else {
      setCityId(id);
      city = id;
    }
    AllFoundations(setLoading, setError, setFoundations, city, region);
  };

  const getAllCategories = () =>
    getCategories(setLoading, setError, setAllCategories);

  /* -------------------- فلترة وتفعيل -------------------- */
  const toggleFilter = (fid) =>
    setFilters((prev) =>
      prev.map((f) => (f.id === fid ? { ...f, checked: !f.checked } : f))
    );

  /* فلتر التأسيسات حسب الفلاتر المختارة */
  const activeFilterIds = filters.filter((f) => f.checked).map((f) => f.id);
  const displayedFoundations = foundations.filter((item) => {
    const byFilter =
      activeFilterIds.length === 0 || activeFilterIds.includes(item.category);
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
    return byFilter && bySearch;
  });

  /* -------------------- JSX -------------------- */
  return (
    <div className="Network">
      <div className="network_container">
        {/* <h2>{lang === "ar" ? "شبكة الجهات" : "Glow Card Foundations"}</h2> */}

        {/* ======= شريط البحث والفلاتر ======= */}
        <div className="netword_controller">
          <input
            type="text"
            placeholder="ابحث"
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
              <h2>كل الفلاتر</h2>

              <div className="modal_filters">
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
                  إغلاق
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
                <img src={item.images[0]} alt={item.name} />
                <Link href={`/foundation-details?id=${item._id}`}>
                  <h3>{item.name}</h3>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkClient;
