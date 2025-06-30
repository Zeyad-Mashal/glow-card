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
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Lang } from "@/Lang/lang";

const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [token, setToken] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [regionId, setRegionId] = useState("");
  const [language, setLanguage] = useState("ar");
  const pathname = usePathname();

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);

    const langDir = lang === "ar" ? "rtl" : "ltr";
    document.body.style.direction = langDir;

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLanguage(lang);

    const regionId = localStorage.getItem("user_city");
    setRegionId(regionId);
  }, []);

  const langValue = Lang[selectedLanguage];

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
    <>
      {/* ✅ Desktop Navbar */}
      <div className="navbar desktop_navbar">
        <div className="nav_container">
          <div className="logo">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="logo-image"
              loading="lazy"
              onClick={() => (window.location.href = "/")}
            />
          </div>

          <ul className="nav_links">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                {langValue["home"]}
              </Link>
            </li>
            <li>
              <Link
                href={`/central?id=${regionId}`}
                className={
                  pathname === `/central?id=${regionId}` ? "active" : ""
                }
              >
                {langValue["network"]}
              </Link>
            </li>
            <li>
              <Link
                href="/our_cards"
                className={pathname === "/our_cards" ? "active" : ""}
              >
                {langValue["cards"]}
              </Link>
            </li>
            <li>
              <Link
                href="/offers"
                className={pathname === "/offers" ? "active" : ""}
                onClick={toggleMenu}
              >
                {/* {langValue["cards"]} */} Our offers
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathname === "/about" ? "active" : ""}
              >
                {/* {langValue["contactUs"]} */} About Us
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className={pathname === "/join" ? "active" : ""}
              >
                Join Us
              </Link>
            </li>
            <li>
              <Link href="/new" className={pathname === "/new" ? "active" : ""}>
                New Join
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

          <div className="nav_btns_desktop">
            <FontAwesomeIcon
              icon={faEarthAmericas}
              onClick={toggleLanguage}
              style={{ cursor: "pointer" }}
            />
            <span>{language}</span>
            {token ? (
              <a href="/profile" className="profileIcon">
                <FontAwesomeIcon icon={faUser} />
              </a>
            ) : (
              <a href="/login" className="login">
                {langValue["Login"]}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Navbar (Top) */}
      <div className="mobile_top_navbar">
        <div className="mobile_nav_container">
          <div className="mobile_logo">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="logo-image"
              onClick={() => (window.location.href = "/")}
            />
          </div>
          <div className="mobile_nav_actions">
            <button onClick={toggleLanguage}>
              <FontAwesomeIcon icon={faEarthAmericas} />
            </button>
            {token ? (
              <Link href="/profile">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            ) : (
              <Link href="/login">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}
            <button onClick={toggleMenu}>
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* ✅ Menu Links (Dropdown) */}
        <div className={`mobile_dropdown_menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link
                href="/"
                className={pathname === "/" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["home"]}
              </Link>
            </li>
            <li>
              <Link
                href={`/central?id=${regionId}`}
                className={
                  pathname === `/central?id=${regionId}` ? "active" : ""
                }
                onClick={toggleMenu}
              >
                {langValue["network"]}
              </Link>
            </li>
            <li>
              <Link
                href="/our_cards"
                className={pathname === "/our_cards" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["cards"]}
              </Link>
            </li>
            <li>
              <Link
                href="/offers"
                className={pathname === "/offers" ? "active" : ""}
                onClick={toggleMenu}
              >
                {/* {langValue["cards"]} */} Our offers
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathname === "/about" ? "active" : ""}
                onClick={toggleMenu}
              >
                {/* {langValue["contactUs"]} */}
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className={pathname === "/join" ? "active" : ""}
              >
                Join Us
              </Link>
            </li>
            <li>
              <Link href="/new" className={pathname === "/new" ? "active" : ""}>
                New Join
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["contactUs"]}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
