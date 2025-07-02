"use client";
import React, { useState, useEffect } from "react";
import "./about.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import Footer from "@/components/Footer";
import { Lang } from "@/Lang/lang";
const page = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];
  return (
    <>
      <div className="about">
        <div className="about_container">
          <div className="about_content">
            <h2>Glow Card</h2>
            <p>{langValue["street"]}</p>
            <p>Phone: 123-456-7890</p>
            <a href="mailto:zyadomar112@gmail.com">glowcard@gmail.com</a>
          </div>
          <div className="about_image">
            <img src="/images/Family.png" alt="About Glow Card" />
          </div>
        </div>
        <div className="about_description">
          <h3>{langValue["aboutus"]}</h3>
          <p>{langValue["aboutusSub1"]}</p>
          <p>{langValue["aboutusSub1"]}</p>
        </div>
        <div className="about_map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13643.909840480976!2d29.97767581131592!3d31.24904728899203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c52fadf4220f%3A0x7d08dceaad4557bd!2z2LPYp9mGINiz2KrZitmB2KfZhtmIINis2LHYp9mG2K8g2KjZhNin2LLYpw!5e0!3m2!1sar!2seg!4v1751119525270!5m2!1sar!2seg"
            width="900"
            height="850"
            allowFullScreen="allowfullscreen"
            loading="lazy"
          ></iframe>
        </div>
        <div className="about_qest">
          <div className="about_quest_item">
            <div className="qest">
              <FontAwesomeIcon icon={faQuestion} />
              <h3>Have Questions?</h3>
            </div>
            <p>
              If you have any questions or need assistance, feel free to reach
              out to us at
            </p>
          </div>
          <div className="about_quest_item">
            <div className="qest">
              <FontAwesomeIcon icon={faQuestion} />
              <h3>Have Questions?</h3>
            </div>
            <p>
              If you have any questions or need assistance, feel free to reach
              out to us at
            </p>
          </div>
          <div className="about_quest_item">
            <div className="qest">
              <FontAwesomeIcon icon={faQuestion} />
              <h3>Have Questions?</h3>
            </div>
            <p>
              If you have any questions or need assistance, feel free to reach
              out to us at
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
