import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";
import Link from "next/link";
import { Lang } from "@/Lang/lang";

const Footer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];

  return (
    <div className="footer">
      <div className="footer_logo">
        <img src="/images/logo.png" alt="" loading="lazy" />
      </div>
      <div className="footer_section1">
        <h1>{langValue["other"]}</h1>
        <Link href={"/offers"}>{langValue["offers"]}</Link>
        <Link href={"/join"}>{langValue["join"]}</Link>
        <Link href={"/contact"}>{langValue["contactUs"]}</Link>
      </div>
      <div className="footer_section1">
        <h1>{langValue["aboutcompany"]}</h1>
        <Link href={"/about"}>{langValue["aboutus"]}</Link>
        <Link href={"/media"}>{langValue["mdia"]}</Link>
        <a href="mailto:Info@glowcard.com.sa">{langValue["career"]}</a>
      </div>
      <div className="footer_section1">
        <h1>{langValue["contactUs"]}</h1>
        <p>
          <FontAwesomeIcon icon={faPhone} />{" "}
          <a href="tel:+966542220888">+966542220888</a>
        </p>
        <p>
          <FontAwesomeIcon icon={faLocationDot} /> {langValue["location"]}
        </p>
        <p>
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          <a href="mailto:Info@glowcard.com.sa">Info@glowcard.com.sa</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
