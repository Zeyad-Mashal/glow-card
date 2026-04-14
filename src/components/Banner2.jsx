"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";
import "./banner2.css";
import { Lang } from "@/Lang/lang";

const ANDROID_APP_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL ??
  "https://play.google.com/store/apps/details?id=com.m3tech.glowcard";
const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/sa/app/glow-card/id6747254995?l=ar";

const Banner2 = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="banner2">
      <div className="banner2_container">
        <p className="banner2_text">{langValue["banner1"]}</p>
        <div className="banner2_store_row">
          <a
            className="banner2_store_btn banner2_store_btn_android"
            href={ANDROID_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faGooglePlay}
              className="banner2_store_icon"
              aria-hidden
            />
            <span>{langValue["banner1GooglePlay"]}</span>
          </a>
          <a
            className="banner2_store_btn banner2_store_btn_ios"
            href={IOS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faApple}
              className="banner2_store_icon"
              aria-hidden
            />
            <span>{langValue["banner1AppStore"]}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner2;
