"use client";
import React, { useState } from "react";
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // 👈 بترجع اللينك الحالي

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/region"
                className={pathname === "/region" ? "active" : ""}
              >
                شبكة الجهات
              </Link>
            </li>
            <li>
              <Link
                href="/cards"
                className={pathname === "/cards" ? "active" : ""}
              >
                البطاقات
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? "active" : ""}
              >
                تواصل معنا
              </Link>
            </li>
          </ul>

          <div className="nav_btns">
            <a href="/login">تسجيل دخول</a>
            <FontAwesomeIcon icon={faEarthAmericas} />
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
