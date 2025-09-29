"use client"; // لو كنت تعمل داخل مجلد app في Next.js
import React, { useEffect, useState } from "react";
import "./glowClub.css";
import Image from "next/image";
import { Lang } from "@/Lang/lang";
const items = [
  { id: 1, title: "Glow Card", discount: "15%", code: "GLOW15" },
  { id: 2, title: "Glow Card", discount: "15%", code: "GLOW15" },
  { id: 3, title: "Glow Card", discount: "15%", code: "GLOW15" },
  { id: 4, title: "Glow Card", discount: "15%", code: "GLOW15" },
  { id: 5, title: "Glow Card", discount: "15%", code: "GLOW15" },
  { id: 6, title: "Glow Card", discount: "15%", code: "GLOW15" },
];

export default function GlowClubPage() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [lang, setLang] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  const handleClick = (item) => {
    setCurrent(item);
    setOpen(true);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      alert("✅ تم نسخ الكوبون!");
    } catch (err) {
      alert("❌ لم يتم النسخ، جرّب يدويًا.");
    }
  };
  useEffect(() => {
    const langToken = localStorage.getItem("lang");
    setLang(langToken);
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];

  return (
    <>
      <div className="glowClub">
        <div className="glowClub_banner">
          {lang === "ar" ? (
            <Image
              src={"/images/glow card banners-04.png"}
              width={1000}
              height={500}
              alt="glow club banner"
            />
          ) : (
            <Image
              src={"/images/glow card banners-10.png"}
              width={1000}
              height={500}
              alt="glow club banner"
            />
          )}
        </div>
        <div className="glowClub_container">
          <h2>{langValue["club"]}</h2>

          <div className="glowClub_list">
            {items.map((item) => (
              <div
                key={item.id}
                className="glowClub_item"
                onClick={() => handleClick(item)}
              >
                <div className="item_content">
                  <h3>{item.title}</h3>
                  <p>{item.discount}</p>
                </div>
                <img src="/images/logo.png" alt="Glow Logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      {open && current && (
        <div
          className="popup_overlay"
          onClick={() => setOpen(false)} // كليك على الخلفية يقفل البوب‑أب
        >
          <div
            className="popup_card"
            onClick={(e) => e.stopPropagation()} // منع إغلاق البوب‑أب عند الضغط داخله
          >
            <button className="popup_close" onClick={() => setOpen(false)}>
              ×
            </button>

            <h3>{current.title}</h3>
            <p className="coupon_code">{current.code}</p>

            <button className="copy_btn" onClick={copyCode}>
              نسخ الكوبون
            </button>
          </div>
        </div>
      )}
    </>
  );
}
