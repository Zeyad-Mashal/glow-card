import React, { useState, useEffect } from "react";
import "./banner3.css";
import { Lang } from "@/Lang/lang";
const Banner3 = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="banner3">
      <div className="banner_container">
        <h1>{langValue["banner2"]}</h1>
        <p>{langValue["banner3"]}</p>
        <button
          onClick={() => {
            window.location.href = "/our_cards";
          }}
        >
          {langValue["banner4"]}
        </button>
      </div>
    </div>
  );
};

export default Banner3;
