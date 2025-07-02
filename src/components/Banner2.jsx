import React, { useState, useEffect } from "react";
import "./banner2.css";
import { Lang } from "@/Lang/lang";
const Banner2 = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="banner2">
      <div className="banner2_container">{langValue["banner1"]}</div>
    </div>
  );
};

export default Banner2;
