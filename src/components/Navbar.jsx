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
import City from "@/API/City/City.api";
const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [token, setToken] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [regionId, setRegionId] = useState("");
  const [regionName, setRegionName] = useState("");
  const [language, setLanguage] = useState("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const pathname = usePathname();
  const [cityName, setCityName] = useState("");
  const [path, setPath] = useState();

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);

    const langDir = lang === "ar" ? "rtl" : "ltr";
    document.body.style.direction = langDir;

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLanguage(lang);

    const cityData = localStorage.getItem("user_city");
    if (cityData) {
      const city = JSON.parse(cityData);
      setRegionId(city.id);
      setRegionName(city.name);
    }
    getAllCities();
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

  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  const routController = () => {
    const cityname = JSON.parse(localStorage.getItem("user_city"));
    if (cityname) {
      const name = cityname.name;
      const cityId = cityname.id;
      if (name === "الرياض" || name === "جده") {
        return `/central?id=${cityId}`;
      } else {
        return `/network?id=${cityId}`;
      }
    }
    // setCityName(name);
  };
  useEffect(() => {
    setPath(routController());
  }, []);

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
            <select
              value={regionName}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedItem = allCities.find(
                  (item) => item.name === selectedName
                );

                if (selectedItem) {
                  setRegionId(selectedItem._id);
                  setRegionName(selectedItem.name);
                  localStorage.setItem(
                    "user_city",
                    JSON.stringify({
                      id: selectedItem._id,
                      name: selectedItem.name,
                    })
                  );
                  const url =
                    selectedItem.name === "الرياض" ||
                    selectedItem.name === "جده"
                      ? `/central?id=${selectedItem._id}`
                      : `/network?id=${selectedItem._id}`;

                  window.location.href = url;
                }
              }}
            >
              {allCities.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <ul className="nav_links">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                {langValue["home"]}
              </Link>
            </li>
            <li>
              <Link href={`${path}`}>{langValue["network"]}</Link>
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
                {langValue["offers"]}
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className={pathname === "/join" ? "active" : ""}
              >
                {langValue["join"]}
              </Link>
            </li>
            <li>
              <Link href="/new" className={pathname === "/new" ? "active" : ""}>
                {langValue["new"]}
              </Link>
            </li>
            <li>
              <Link
                href="/glow-club"
                className={pathname === "/glow-club" ? "active" : ""}
              >
                {langValue["club"]}
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
            <div className="lang">
              <FontAwesomeIcon
                icon={faEarthAmericas}
                onClick={toggleLanguage}
                style={{ cursor: "pointer" }}
              />
              <span>{language}</span>
            </div>
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
        <select
          value={regionName}
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedItem = allCities.find(
              (item) => item.name === selectedName
            );

            if (selectedItem) {
              setRegionId(selectedItem._id);
              setRegionName(selectedItem.name);
              localStorage.setItem(
                "user_city",
                JSON.stringify({
                  id: selectedItem._id,
                  name: selectedItem.name,
                })
              );
              const url =
                selectedItem.name === "الرياض" || selectedItem.name === "جده"
                  ? `/central?id=${selectedItem._id}`
                  : `/network?id=${selectedItem._id}`;

              window.location.href = url;
            }
          }}
        >
          {allCities.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

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
              <Link href={`${path}`} onClick={toggleMenu}>
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
                {langValue["offers"]}
              </Link>
            </li>
            <li>
              <Link
                href="/join"
                className={pathname === "/join" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["join"]}
              </Link>
            </li>
            <li>
              <Link
                href="/new"
                className={pathname === "/new" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["new"]}
              </Link>
            </li>
            <li>
              <Link
                href="/glow-club"
                className={pathname === "/glow-club" ? "active" : ""}
                onClick={toggleMenu}
              >
                {langValue["club"]}
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
