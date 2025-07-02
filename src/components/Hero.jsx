import React, { useState, useEffect } from "react";
import "./hero.css";
import { Lang } from "@/Lang/lang";
import Link from "next/link";
import Image from "next/image";
const Hero = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="hero">
      <div className="hero_container">
        <div className="hero_content">
          <h1>{langValue["hero"]}</h1>
          <Link href={"/our_cards"}>{langValue["heroBtn"]}</Link>
        </div>
        <Image
          src={"/images/Family.png"}
          width={300}
          height={300}
          alt="glow card hero image"
        />
      </div>
    </div>
  );
};

export default Hero;
