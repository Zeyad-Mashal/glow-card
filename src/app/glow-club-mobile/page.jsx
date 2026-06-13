"use client";
import React, { useEffect, useState } from "react";
import "./glowclubmobile.css";
import Image from "next/image";
import { Lang } from "@/Lang/lang";
const items = [
  {
    id: 1,
    title: "نون",
    discount: "10%",
    code: "GLO10",
    image: "/images/noon.jpeg",
  },
  {
    id: 2,
    title: "Ziebart",
    discount: "خصم 40% علي التلميع و التظليل و يطبق الخصم بالفرع",
    code: "https://www.ziebart.com.sa/ar/branches",
    image: "/images/ziebart.png",
  },
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
        <div className="glowClub_container">
          {/* <h2>{langValue["club"]}</h2> */}

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
                <Image
                  src={item.image}
                  alt="Glow Logo"
                  width={150}
                  height={150}
                />
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
              {selectedLanguage === "ar" ? "انسخ الكود" : "Copy Code"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
