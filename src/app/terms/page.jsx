"use client";
import React, { useState, useEffect } from "react";
import "./Terms.css";
import { Lang } from "@/Lang/lang";

const Terms = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);

  const t = Lang[selectedLanguage];

  return (
    <div className="policy">
      <h1>{t.termsTitle}</h1>

      <h2>{t.termsSection1Title}</h2>
      <ul>
        <li>{t.termsSection1_1}</li>
      </ul>

      <h2>{t.termsSection2Title}</h2>
      <ul>
        <li>{t.termsSection2_1}</li>
        <li>{t.termsSection2_2}</li>
      </ul>

      <h2>{t.termsSection3Title}</h2>
      <ul>
        <li>{t.termsSection3_1}</li>
        <li>{t.termsSection3_2}</li>
      </ul>

      <h2>{t.termsSection4Title}</h2>
      <ul>
        <li>{t.termsSection4_1}</li>
        <li>{t.termsSection4_2}</li>
      </ul>

      <h2>{t.termsSection5Title}</h2>
      <ul>
        <li>{t.termsSection5_1}</li>
        <li>{t.termsSection5_2}</li>
      </ul>

      <h2>{t.termsSection6Title}</h2>
      <ul>
        <li>{t.termsSection6_1}</li>
        <li>{t.termsSection6_2}</li>
      </ul>

      <h2>{t.termsSection7Title}</h2>
      <ul>
        <li>{t.termsSection7_1}</li>
        <li>{t.termsSection7_2}</li>
      </ul>

      <h2>{t.termsSection8Title}</h2>
      <ul>
        <li>{t.termsSection8_1}</li>
        <li>{t.termsSection8_2}</li>
      </ul>

      <h2>{t.termsSection9Title}</h2>
      <ul>
        <li>{t.termsSection9_1}</li>
        <li>{t.termsSection9_2}</li>
      </ul>

      <h2>{t.termsSection10Title}</h2>
      <ul>
        <li>{t.termsSection10_1}</li>
        <li>{t.termsSection10_2}</li>
      </ul>
    </div>
  );
};

export default Terms;
