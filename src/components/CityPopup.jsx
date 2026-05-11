"use client";
import React, { useEffect, useState } from "react";
import "./Popup.css";
import City, { DEFAULT_USER_CITY } from "@/API/City/City.api";

const defaultCityStored = () =>
  JSON.stringify({ id: DEFAULT_USER_CITY.id, name: DEFAULT_USER_CITY.name });

const CityPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [city, setCity] = useState("");
  /** true حتى يكتمل أول طلب مدن — لا نستخدم localStorage هنا (غير متوفر في SSR) */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let savedCity = null;
    try {
      savedCity = localStorage.getItem("user_city");
    } catch {
      savedCity = null;
    }
    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      setShowPopup(true);
    }
    getAllCities();
  }, []);
  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  /** عند فشل أو عدم وجود مدن: تعيين الرياض في التخزين فور ظهور المودال بعد انتهاء التحميل */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!showPopup || loading) return;
    const failed = Boolean(error);
    const noCities = !Array.isArray(allCities) || allCities.length === 0;
    if (!failed && !noCities) return;
    const stored = defaultCityStored();
    try {
      localStorage.setItem("user_city", stored);
    } catch {
      /* ignore */
    }
    setCity(stored);
  }, [showPopup, loading, error, allCities]);

  const handleSubmit = () => {
    if (typeof window === "undefined") return;
    if (city) {
      try {
        localStorage.setItem("user_city", city);
      } catch {
        /* ignore */
      }
      setShowPopup(false);
    } else {
      alert("من فضلك اختر الاتجاه والمدينه");
    }
    window.location.reload();
  };

  if (!showPopup) return null;

  return (
    <div className="popup_overlay">
      <div className="popup_box animate-popup">
        <h2>مرحبًا بك 👋</h2>
        <p>يرجى اختيار المدينة</p>

        <div className="popup_input">
          <label>المدينة</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">اختر المدينة</option>
            {allCities.map((item, index) => {
              return (
                <option
                  key={index}
                  value={JSON.stringify({ id: item._id, name: item.name })}
                >
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <button onClick={handleSubmit}>موافق</button>
      </div>
    </div>
  );
};

export default CityPopup;
