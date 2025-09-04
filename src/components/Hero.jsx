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
        <div className="hero_content">
          <h1 data-aos="zoom-in-up" data-aos-delay="100">
            {langValue["hero"]}
          </h1>
          <p data-aos="zoom-in-up" data-aos-delay="250">
            {langValue["heroSub"]}
          </p>
          <Link href={"/our_cards"} data-aos="zoom-in-up" data-aos-delay="350">
            {langValue["heroBtn"]}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
