"use client";
import React, { useState, useEffect } from "react";
import "./Join.css";
import { Lang } from "@/Lang/lang";

const Join = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000); // يخفي الرسالة بعد 3 ثواني
  };

  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="join">
      <div className="join_container">
        <h1>{langValue["joinUs"]}</h1>

        {formSubmitted && (
          <div className="success-popup">
            <span>✅ {langValue["success"]}</span>
          </div>
        )}

        <div className="join_list">
          <form className="join_form" onSubmit={handleSubmit}>
            <label>
              <span>اسم</span>
              <input
                type="text"
                placeholder="اسم"
                className="join_input"
                required
              />
            </label>
            <label>
              <span>رقم الجوال</span>
              <input
                type="text"
                placeholder="05XXX XXX"
                className="join_input"
                required
              />
            </label>
            <label>
              <span>البريد الالكتروني</span>
              <input
                type="email"
                placeholder="glowcard@gmail.com"
                className="join_input"
                required
              />
            </label>
            <label>
              <span>المدينه</span>
              <select required>
                <option value="">اختر المدينه</option>
                <option value="الرياض">الرياض</option>
                <option value="جده">جده</option>
              </select>
            </label>
            <label>
              <span>التخصصات:</span>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 1</span>
              </div>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 2</span>
              </div>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 3</span>
              </div>
            </label>
            <button type="submit">ارسال طلب</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
