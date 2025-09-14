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
            <p>
              <a href="tel:+966542220888">+966542220888</a>
            </p>
            <a href="mailto: Info@glowcard.com.sa"> Info@glowcard.com.sa</a>
          </div>
          <div className="about_image">
            <img src="/images/Family.png" alt="About Glow Card" />
          </div>
        </div>
        <div className="about_description">
          <h3>{langValue["aboutus"]}</h3>
          <p>{langValue["aboutusSub1"]}</p>
          <p>{langValue["aboutusSub2"]}</p>
          <p>{langValue["aboutusSub3"]}</p>
        </div>
        <div className="about_map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d927758.0370684005!2d47.48205835058888!3d24.724997745509423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2KfZhNix2YrYp9i2INin2YTYs9i52YjYr9mK2Kk!5e0!3m2!1sar!2seg!4v1755197947695!5m2!1sar!2seg"
            style={{
              width: "600",
              height: "450",
              border: "0",
            }}
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
