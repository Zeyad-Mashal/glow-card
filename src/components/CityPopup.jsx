"use client";
import React, { useEffect, useState } from "react";
import "./Popup.css";
import City from "@/API/City/City.api";
const CityPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [direction, setDirection] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    const savedDirection = localStorage.getItem("user_direction");
    const savedCity = localStorage.getItem("user_city");

    if (!savedDirection || !savedCity) {
      setShowPopup(true);
    }
    getAllCities();
  }, []);
  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  const handleSubmit = () => {
    if (direction && city) {
      localStorage.setItem("user_direction", direction);
      localStorage.setItem("user_city", city);
      setShowPopup(false);
    } else {
      alert("من فضلك اختر الاتجاه والمدينه");
    }
  };

  if (!showPopup) return null;

  return (
    <div className="popup_overlay">
      <div className="popup_box animate-popup">
        <h2>مرحبًا بك 👋</h2>
        <p>يرجى اختيار المنطقه والمدينة</p>

        <div className="popup_input">
          <label>المنطقه</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="">اختر المنطقه</option>
            <option value="شمال">شمال</option>
            <option value="جنوب">جنوب</option>
            <option value="وسط">وسط</option>
            <option value="شرق">شرق</option>
            <option value="غرب">غرب</option>
          </select>
        </div>

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
