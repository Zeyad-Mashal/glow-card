"use client";
import React, { useState, useEffect } from "react";
import "./Request.css";
import { Lang } from "@/Lang/lang";
import City from "@/API/City/City.api";
import RequestCustom from "@/API/RequestCustom/RequestCustom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const saudiCities = [
    { ar: "الرياض", en: "Riyadh" },
    { ar: "جدة", en: "Jeddah" },
    { ar: "مكة المكرمة", en: "Makkah" },
    { ar: "المدينة المنورة", en: "Madinah" },
    { ar: "الدمام", en: "Dammam" },
    { ar: "الخبر", en: "Khobar" },
    { ar: "الظهران", en: "Dhahran" },
    { ar: "الأحساء", en: "Al-Ahsa" },
    { ar: "الطائف", en: "Taif" },
    { ar: "بريدة", en: "Buraidah" },
    { ar: "عنيزة", en: "Unaizah" },
    { ar: "حائل", en: "Hail" },
    { ar: "تبوك", en: "Tabuk" },
    { ar: "أبها", en: "Abha" },
    { ar: "خميس مشيط", en: "Khamis Mushait" },
    { ar: "جازان", en: "Jazan" },
    { ar: "نجران", en: "Najran" },
    { ar: "الباحة", en: "Al Baha" },
    { ar: "سكاكا", en: "Sakaka" },
    { ar: "عرعر", en: "Arar" },
    { ar: "المجمعة", en: "Al Majma'ah" },
    { ar: "الزلفي", en: "Al Zulfi" },
    { ar: "الخفجي", en: "Khafji" },
    { ar: "رأس تنورة", en: "Ras Tanura" },
    { ar: "القطيف", en: "Qatif" },
    { ar: "صفوى", en: "Safwa" },
    { ar: "سيهات", en: "Saihat" },
    { ar: "الجبيل", en: "Jubail" },
    { ar: "ينبع", en: "Yanbu" },
    { ar: "الليث", en: "Al Lith" },
    { ar: "القنفذة", en: "Al Qunfudhah" },
    { ar: "بيشة", en: "Bisha" },
    { ar: "محايل عسير", en: "Muhayil Asir" },
    { ar: "رنية", en: "Ranyah" },
    { ar: "تربة", en: "Turabah" },
    { ar: "الدوادمي", en: "Al Duwadimi" },
    { ar: "الخرج", en: "Al Kharj" },
    { ar: "وادي الدواسر", en: "Wadi Ad Dawasir" },
    { ar: "شقراء", en: "Shaqra" },
    { ar: "حوطة بني تميم", en: "Hotat Bani Tamim" },
    { ar: "السليل", en: "As Sulayyil" },
    { ar: "الرس", en: "Ar Rass" },
    { ar: "البكيرية", en: "Al Bukayriyah" },
    { ar: "رياض الخبراء", en: "Riyadh Al Khabra" },
    { ar: "البدائع", en: "Al Badai" },
    { ar: "المذنب", en: "Al Mithnab" },
    { ar: "النماص", en: "Al Namas" },
    { ar: "رجال ألمع", en: "Rijal Alma" },
    { ar: "بلقرن", en: "Balqarn" },
    { ar: "خيبر", en: "Khaybar" },
    { ar: "العلا", en: "AlUla" },
    { ar: "الوجه", en: "Al Wajh" },
    { ar: "ضباء", en: "Duba" },
    { ar: "أملج", en: "Umluj" },
    { ar: "حفر الباطن", en: "Hafar Al-Batin" },
    { ar: "النعيرية", en: "An Nuayriyah" },
    { ar: "قرية العليا", en: "Qaryat Al Ulya" },
    { ar: "بقيق", en: "Buqayq" },
    { ar: "رابغ", en: "Rabigh" },
    { ar: "الخرمة", en: "Al Khurma" },
    { ar: "المويه", en: "Al Muwayh" },
    { ar: "الطوال", en: "At Tuwal" },
    { ar: "صامطة", en: "Samtah" },
    { ar: "صبيا", en: "Sabya" },
    { ar: "بيش", en: "Baish" },
    { ar: "أبو عريش", en: "Abu Arish" },
    { ar: "العارضة", en: "Al Aridhah" },
    { ar: "الريث", en: "Ar Rayth" },
    { ar: "فيفاء", en: "Fayfa" },
    { ar: "الدرب", en: "Ad Darb" },
  ];

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employeesNumber, setEmployeesNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [selectedLang, setSelectedLang] = useState("ar");
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLang(lang);
    getAllCities();
  }, []);

  const langValue = Lang[selectedLang] || Lang["ar"];

  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  const handleSubmit = async () => {
    if (
      !fullName ||
      !companyName ||
      !employeesNumber ||
      !email ||
      !phone ||
      !city
    ) {
      toast.error(langValue["AllFieldsRequired"] || "Please fill all fields", {
        position: "top-right",
      });
      return;
    }

    const data = {
      fullName,
      companyName,
      employeesNumber,
      email,
      phone,
      city,
    };

    try {
      setRequestLoading(true);
      await RequestCustom(setRequestLoading, null, data);
      toast.success(
        langValue["RequestSuccess"] || "Request sent successfully!",
        {
          position: "top-right",
        }
      );
      // Reset form after success
      setFullName("");
      setCompanyName("");
      setEmployeesNumber("");
      setEmail("");
      setPhone("");
      setCity("");
    } catch (err) {
      toast.error(langValue["RequestFailed"] || "Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="request_card">
      <ToastContainer />
      <h1>{langValue["RequestCompanyCard"]}</h1>
      <div className="request_form">
        <label>
          <span>{langValue["userName"]}:</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
        <label>
          <span>{langValue["companyName"]}:</span>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </label>
        <label>
          <span>{langValue["city"]}:</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="choose"></option>
            {saudiCities.map((city) => (
              <option key={city.ar} value={city.ar}>
                {city.ar}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{langValue["CompanyEmployees"]}:</span>
          <input
            type="text"
            value={employeesNumber}
            onChange={(e) => setEmployeesNumber(e.target.value)}
          />
        </label>
        <label>
          <span>{langValue["email"]}:</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>{langValue["phone"]}:</span>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit} disabled={requestLoading}>
          {requestLoading
            ? langValue["Loading"] || "Loading..."
            : langValue["RequestCard"]}
        </button>
      </div>
    </div>
  );
};

export default Page;
