"use client";
import React, { useState, useEffect } from "react";
import "./contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Lang } from "@/Lang/lang";
const page = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="contact">
      <div className="contact_container">
        <h1>{langValue["contact"]}</h1>
        <p>{langValue["subContact"]}</p>
        <div className="contact_content">
          <div className="content_text">
            <h3>{langValue["subContact2"]}</h3>
            <p>{langValue["subContact3"]}</p>
            <div className="content_text_info">
              <h2>{langValue["contactways"]}</h2>
              <p>
                <FontAwesomeIcon icon={faPhone} />{" "}
                <a href="tel:+966542220888">+966542220888</a>
              </p>
              <p>
                <FontAwesomeIcon icon={faLocationDot} />
                {langValue["location"]}
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} />{" "}
                <a href="mailto:Info@glowcard.com.sa">Info@glowcard.com.sa</a>
              </p>
              <p>
                <FontAwesomeIcon icon={faWhatsapp} aria-label="WhatsApp" />{" "}
                <a
                  href="https://wa.me/966542220888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  https://wa.me/966542220888
                </a>
              </p>
            </div>
          </div>
          <div className="content_form">
            <label>{langValue["userName"]}</label>
            <input type="text" />
            <label>{langValue["email"]}</label>
            <input type="text" />
            <label>{langValue["message"]}</label>
            <textarea></textarea>
            <button>{selectedLanguage === "ar" ? "ارسال" : "Send"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
