"use client";
import React, { useState, useEffect } from "react";
import "./Join.css";
import { Lang } from "@/Lang/lang";
import JoinUs from "@/API/Join/JoinUs";
const Join = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  const initialFormData = {
    fullName: "",
    phone: "",
    email: "",
    message: "",
    city: "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const data = {
      ...formData,
      categories: selectedCategories,
    };
    JoinUs(setloading, setError, data);
    setTimeout(() => setFormSubmitted(false), 3000);

    setFormData(initialFormData);
    setSelectedCategories([]);
  };

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);

  const langValue = Lang[selectedLanguage];

  return (
    <div className="join">
      <div className="join_container">
        <h1>{langValue["joinUs"]}</h1>

        {/* نافذة النجاح */}
        {formSubmitted && (
          <div className="success-popup">
            <span>✅ {langValue["success"]}</span>
          </div>
        )}

        <div className="join_list">
          <form className="join_form" onSubmit={handleSubmit}>
            {/* اسم */}
            <label>
              <span>اسم</span>
              <input
                type="text"
                name="fullName"
                placeholder="اسم"
                className="join_input"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </label>

            {/* رقم الجوال */}
            <label>
              <span>رقم الجوال</span>
              <input
                type="text"
                name="phone"
                placeholder="05XXX XXX"
                className="join_input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>

            {/* البريد الإلكتروني */}
            <label>
              <span>البريد الالكتروني</span>
              <input
                type="email"
                name="email"
                placeholder="glowcard@gmail.com"
                className="join_input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            {/* المدينة */}
            <label>
              <span>المدينه</span>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر المدينه</option>
                <option value="الرياض">الرياض</option>
                <option value="جده">جده</option>
              </select>
            </label>
            <label>
              <span>رسالتك</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </label>

            {/* التخصصات */}
            <label>
              <span>التخصصات:</span>

              <div className="category">
                <input
                  type="checkbox"
                  value="تخصص 1"
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes("تخصص 1")}
                />
                <span>تخصص 1</span>
              </div>

              <div className="category">
                <input
                  type="checkbox"
                  value="تخصص 2"
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes("تخصص 2")}
                />
                <span>تخصص 2</span>
              </div>

              <div className="category">
                <input
                  type="checkbox"
                  value="تخصص 3"
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes("تخصص 3")}
                />
                <span>تخصص 3</span>
              </div>
            </label>

            <button type="submit">{loading ? "تحميل ..." : "ارسال طلب"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Join;
