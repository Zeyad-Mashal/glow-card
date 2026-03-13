"use client";
import React, { useState, useEffect } from "react";
import { Lang } from "@/Lang/lang";
import AOS from "aos";
import "aos/dist/aos.css";
import "./WhyGlowCard.css";

const WhyGlowCard = () => {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "ar");
    AOS.init({ duration: 800, once: true });
  }, []);

  const t = Lang[lang];
  const items = [
    { title: t["why1Title"], text: t["why1Text"] },
    { title: t["why2Title"], text: t["why2Text"] },
    { title: t["why3Title"], text: t["why3Text"] },
    { title: t["why4Title"], text: t["why4Text"] },
  ];

  return (
    <section className="why_section">
      <h2 className="why_title">{t["whySectionTitle"]}</h2>
      <div className="why_grid">
        {items.map((item, i) => (
          <div
            key={i}
            className="why_card"
            data-aos="fade-up"
            data-aos-delay={i * 80}
          >
            <span className="why_icon" aria-hidden="true">💜</span>
            <h3 className="why_card_title">{item.title}</h3>
            <p className="why_card_text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyGlowCard;
