"use client";
import React, { useEffect, useState } from "react";
import "./Popup.css";
import City from "@/API/City/City.api";
const CityPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    const savedCity = localStorage.getItem("user_city");

    if (!savedCity) {
      setShowPopup(true);
    }
    getAllCities();
  }, []);
  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  const handleSubmit = () => {
    if (city) {
      localStorage.setItem("user_city", city);
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
