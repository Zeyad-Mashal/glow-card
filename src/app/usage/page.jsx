"use client";
import React, { useState, useEffect } from "react";
import "./usage.css";
import { Lang } from "@/Lang/lang";

const SalesPolicy = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);

  const t = Lang[selectedLanguage];

  return (
    <div className="policy">
      <h1>{t.salesTitle}</h1>

      <h2>{t.salesSection1Title}</h2>
      <ul>
        <li>{t.salesSection1_1}</li>
        <li>{t.salesSection1_2}</li>
      </ul>

      <h2>{t.salesSection2Title}</h2>
      <ul>
        <li>{t.salesSection2_1}</li>
        <li>{t.salesSection2_2}</li>
      </ul>

      <h2>{t.salesSection3Title}</h2>
      <ul>
        <li>{t.salesSection3_1}</li>
        <li>{t.salesSection3_2}</li>
      </ul>

      <h2>{t.salesSection4Title}</h2>
      <ul>
        <li>{t.salesSection4_1}</li>
        <li>{t.salesSection4_2}</li>
        <li>{t.salesSection4_3}</li>
      </ul>

      <h2>{t.salesSection5Title}</h2>
      <ul>
        <li>{t.salesSection5_1}</li>
        <li>{t.salesSection5_2}</li>
      </ul>

      <h2>{t.salesSection6Title}</h2>
      <ul>
        <li>{t.salesSection6_1}</li>
        <li>{t.salesSection6_2}</li>
      </ul>

      <h2>{t.salesSection7Title}</h2>
      <ul>
        <li>{t.salesSection7_1}</li>
      </ul>
    </div>
  );
};

export default SalesPolicy;
