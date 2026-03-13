"use client";
import React, { useState, useEffect } from "react";
import { Lang } from "@/Lang/lang";
import AOS from "aos";
import "aos/dist/aos.css";
import "./HowItWorksSection.css";

const HowItWorksSection = () => {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "ar");
    AOS.init({ duration: 800, once: true });
  }, []);

  const t = Lang[lang];

  return (
    <section className="how_section">
      <h2 className="how_title">{t["howSectionTitle"]}</h2>
      <ol className="how_steps">
        <li data-aos="fade-up" data-aos-delay="50">{t["howStep1"]}</li>
        <li data-aos="fade-up" data-aos-delay="100">{t["howStep2"]}</li>
        <li data-aos="fade-up" data-aos-delay="150">{t["howStep3"]}</li>
        <li data-aos="fade-up" data-aos-delay="200">{t["howStep4"]}</li>
      </ol>
    </section>
  );
};

export default HowItWorksSection;
