import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faSnapchat,
  faFacebookF,
  faLinkedinIn,
  faXTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
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

        {/* 🌐 Social Media Links */}
        <div className="footer_social">
          <a
            href="https://www.snapchat.com/add/glow_card"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faSnapchat} />
          </a>
          <a
            href="https://www.instagram.com/glow.card.ksa/"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://www.tiktok.com/@glow_card"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTiktok} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61579185606100"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>

          <a href="https://x.com/glow_card" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a
            href="http://www.linkedin.com/in/glow-card"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
