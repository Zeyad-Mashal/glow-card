"use client";
import React, { useState, useEffect } from "react";
import "./Join.css";
import { Lang } from "@/Lang/lang";
import JoinUs from "@/API/Join/JoinUs";
import getCategories from "@/API/Category/getCategories.api";
import Image from "next/image";
const Join = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState([]);
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
    getAllFilters();
  }, []);

  const langValue = Lang[selectedLanguage];

  const getAllFilters = () => {
    getCategories(setloading, setError, setAllCategories);
  };

  const cities = [
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
    "الخبر",
    "الظهران",
    "الجبيل",
    "القطيف",
    "الأحساء",
    "الهفوف",
    "الطائف",
    "ينبع",
    "تبوك",
    "حائل",
    "عرعر",
    "سكاكا",
    "الجوف",
    "نجران",
    "جازان",
    "أبها",
    "خميس مشيط",
    "بيشة",
    "الباحة",
    "القنفذة",
    "صبيا",
    "محايل عسير",
    "شرورة",
    "رفحاء",
    "طبرجل",
    "المجمعة",
    "الزلفي",
    "الدوادمي",
    "عنيزة",
    "بريدة",
    "الرس",
    "الخرج",
    "وادي الدواسر",
    "السليل",
    "الحوطة",
    "ليلى",
    "رنية",
    "تربة",
    "المهد",
    "العلا",
    "خيبر",
    "رابغ",
    "بحرة",
    "الليث",
    "الخرمة",
    "بارق",
    "النماص",
    "بلقرن",
    "تنومة",
    "رجال ألمع",
    "أحد رفيدة",
    "ظهران الجنوب",
    "الحرجة",
    "المضة",
    "بللسمر",
    "بللحمر",
    "المجاردة",
    "العيدابي",
    "الدرب",
    "ضمد",
    "أبوعريش",
    "صامطة",
    "فرسان",
    "العارضة",
    "الريث",
    "فيفاء",
    "بدر",
    "البدائع",
    "رياض الخبراء",
    "عيون الجواء",
    "الشماسية",
  ];

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const filteredCities = cities.filter((city) => city.includes(search));

  return (
    <div className="join">
      <div className="join_banner">
        <Image
          src={"/images/join.png"}
          width={500}
          height={200}
          alt="join us banner"
        />
      </div>
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
                placeholder="example@gmail.com"
                className="join_input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            {/* المدينة */}
            <label className="city-label">
              <span>المدينة</span>
              <input
                type="text"
                placeholder="ابحث عن المدينة"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="">اختر المدينة</option>
                {filteredCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
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
                {allCategories.map((category, index) => {
                  return (
                    <div key={index} className="category-item">
                      <input
                        type="checkbox"
                        value={category.name}
                        onChange={handleCategoryChange}
                        checked={selectedCategories.includes(category.name)}
                      />
                      <span>{category.name}</span>
                    </div>
                  );
                })}
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
