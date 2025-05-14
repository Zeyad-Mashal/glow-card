"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Lang } from "@/Lang/lang";
const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];

  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ar");
  const pathname = usePathname();

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setLanguage(lang);

    if (lang === "ar") {
      document.body.style.direction = "rtl";
    } else {
      document.body.style.direction = "ltr";
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
    window.location.reload();
  };
  return (
    <div className="navbar">
      <div className="nav_container">
        <div className="logo">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="logo-image"
            loading="lazy"
          />
        </div>

        <button className="menu_toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>

        <div className={`nav_links ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                {langValue["home"]}
              </Link>
            </li>
            <li>
              <Link
                href="/region"
                className={pathname === "/region" ? "active" : ""}
              >
                {langValue["network"]}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? "active" : ""}
              >
                {langValue["contactUs"]}
              </Link>
            </li>
          </ul>

          <div className="nav_btns">
            <a href="/login">{langValue["Login"]}</a>
            <FontAwesomeIcon
              icon={faEarthAmericas}
              onClick={toggleLanguage}
              style={{ cursor: "pointer" }}
            />
            <span>{language}</span>
            <a href="/profile">
              <FontAwesomeIcon icon={faUser} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
