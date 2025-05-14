import React, { useState, useEffect } from "react";
import "./hero.css";
import { Lang } from "@/Lang/lang";
const Hero = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="hero">
      <div className="hero_container">
        <div className="hero_content animateLuxuryFadeIn lux-delay-2">
          <h1>{langValue["hero"]}</h1>
          <p>{langValue["heroSub"]}</p>
          <button>{langValue["heroBtn"]}</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
