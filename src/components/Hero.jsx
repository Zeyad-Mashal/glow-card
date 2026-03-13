import React, { useState, useEffect } from "react";
import "./hero.css";
import { Lang } from "@/Lang/lang";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
const Hero = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    AOS.init({ duration: 1200, once: true, easing: "ease-out-back" });
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="hero">
      <div className="hero_container">
        <div className="hero_overlay" aria-hidden="true" />
        <div className="hero_content">
          <h1 data-aos="zoom-in-up" data-aos-delay="100">
            {langValue["hero"]}
          </h1>
          <ul className="hero_bullets" data-aos="zoom-in-up" data-aos-delay="200">
            <li>{langValue["heroBullet1"]}</li>
            <li>{langValue["heroBullet2"]}</li>
            <li>{langValue["heroBullet3"]}</li>
          </ul>
          <div className="hero_cta" data-aos="zoom-in-up" data-aos-delay="300">
            <Link href={"/our_cards"} className="hero_btn">
              {langValue["heroBtn"]}
            </Link>
            <p className="hero_trust">{langValue["heroTrust"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
