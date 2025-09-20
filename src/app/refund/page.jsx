"use client";
import React, { useState, useEffect } from "react";
import "./refund.css";
import { Lang } from "@/Lang/lang";

const ReturnPolicy = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);

  const t = Lang[selectedLanguage];

  return (
    <div className="policy">
      <h1>{t.returnTitle}</h1>

      <h2>{t.returnSection1Title}</h2>
      <ul>
        <li>{t.returnSection1_1}</li>
      </ul>

      <h2>{t.returnSection2Title}</h2>
      <ul>
        <li>{t.returnSection2_1}</li>
        <li>{t.returnSection2_2}</li>
      </ul>

      <h2>{t.returnSection3Title}</h2>
      <ul>
        <li>{t.returnSection3_1}</li>
        <li>{t.returnSection3_2}</li>
        <li>{t.returnSection3_3}</li>
      </ul>

      <h2>{t.returnSection4Title}</h2>
      <ul>
        <li>{t.returnSection4_1}</li>
        <li>{t.returnSection4_2}</li>
        <li>{t.returnSection4_3}</li>
      </ul>

      <h2>{t.returnSection5Title}</h2>
      <ul>
        <li>{t.returnSection5_1}</li>
        <li>{t.returnSection5_2}</li>
      </ul>
    </div>
  );
};

export default ReturnPolicy;
