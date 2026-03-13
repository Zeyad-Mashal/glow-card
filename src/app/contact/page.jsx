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
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <div className="contact">
      <div className="contact_container">
        <h1 className="contact_page_title">{langValue["contactPageTitle"]}</h1>
        <p className="contact_page_sub">{langValue["contactPageSub"]}</p>

        <a
          href="https://wa.me/966542220888"
          target="_blank"
          rel="noopener noreferrer"
          className="contact_whatsapp_btn"
        >
          <FontAwesomeIcon icon={faWhatsapp} /> {langValue["contactWhatsAppBtn"]}
        </a>

        <div className="contact_content">
          <div className="content_text">
            <h2>{langValue["contactways"]}</h2>
            <div className="content_text_info">
              <p>
                <FontAwesomeIcon icon={faLocationDot} /> {langValue["contactLocation"]}
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} />{" "}
                <a href="tel:+966542220888">{langValue["contactPhone"]}</a>
                <span className="contact_label"> {selectedLanguage === "ar" ? "واتساب / الهاتف" : "WhatsApp / Phone"}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} />{" "}
                <a href={`mailto:${langValue["contactEmail"]}`}>{langValue["contactEmail"]}</a>
                <span className="contact_label"> {selectedLanguage === "ar" ? "البريد الإلكتروني" : "Email"}</span>
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
