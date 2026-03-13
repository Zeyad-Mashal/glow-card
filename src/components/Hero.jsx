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
          <div className="hero_cta" data-aos="zoom-in-up" data-aos-delay="200">
            <Link href={"/our_cards"} className="hero_btn">
              {langValue["heroBtn"]}
            </Link>
            <p className="hero_trust">{langValue["heroTrust"]}</p>
          </div>
        </div>
      </div>
      <div className="hero_ticker" aria-hidden="true">
        <div className="hero_ticker_inner">
          <div className="hero_ticker_track">
            <div className="hero_ticker_segment">
              <span className="hero_ticker_item">{langValue["heroBullet1"]}</span>
              <span className="hero_ticker_dot">✦</span>
              <span className="hero_ticker_item">{langValue["heroBullet2"]}</span>
              <span className="hero_ticker_dot">✦</span>
              <span className="hero_ticker_item">{langValue["heroBullet3"]}</span>
            </div>
            <div className="hero_ticker_segment">
              <span className="hero_ticker_item">{langValue["heroBullet1"]}</span>
              <span className="hero_ticker_dot">✦</span>
              <span className="hero_ticker_item">{langValue["heroBullet2"]}</span>
              <span className="hero_ticker_dot">✦</span>
              <span className="hero_ticker_item">{langValue["heroBullet3"]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
