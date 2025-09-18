"use client";
import React, { useState, useEffect } from "react";
import "./policy.css";
import { Lang } from "@/Lang/lang";

const Page = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);

  const t = Lang[selectedLanguage];

  return (
    <div className="policy">
      <h1>{t.policyTitle}</h1>
      <span>{t.policyDate}</span>
      <p>{t.policyIntro}</p>

      <h2>1. {t.policySection1Title}</h2>
      <ul>
        <li>{t.policySection1_1}</li>
        <li>{t.policySection1_2}</li>
        <li>{t.policySection1_3}</li>
      </ul>

      <h2>2. {t.policySection2Title}</h2>
      <ul>
        <li>{t.policySection2_1}</li>
        <li>{t.policySection2_2}</li>
        <li>{t.policySection2_3}</li>
        <li>{t.policySection2_4}</li>
      </ul>

      <h2>3. {t.policySection3Title}</h2>
      <p>{t.policySection3Intro}</p>
      <ul>
        <li>{t.policySection3_1}</li>
        <li>{t.policySection3_2}</li>
        <li>{t.policySection3_3}</li>
      </ul>

      <h2>4. {t.policySection4Title}</h2>
      <ul>
        <li>{t.policySection4_1}</li>
        <li>{t.policySection4_2}</li>
      </ul>

      <h2>5. {t.policySection5Title}</h2>
      <p>{t.policySection5Intro}</p>
      <ul>
        <li>{t.policySection5_1}</li>
        <li>{t.policySection5_2}</li>
        <li>{t.policySection5_3}</li>
        <li>{t.policySection5_4}</li>
      </ul>

      <h2>6. {t.policySection6Title}</h2>
      <ul>
        <li>{t.policySection6_1}</li>
      </ul>

      <h2>7. {t.policySection7Title}</h2>
      <ul>
        <li>{t.policySection7_1}</li>
      </ul>

      <h2>8. {t.policySection8Title}</h2>
      <p>
        {t.policySection8Intro}{" "}
        <a href="mailto:support@glowcard.com.sa">📩 support@glowcard.com.sa</a>
      </p>
    </div>
  );
};

export default Page;
