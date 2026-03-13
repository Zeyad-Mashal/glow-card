"use client";
import React, { useState, useEffect } from "react";
import "./about.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import Footer from "@/components/Footer";
import { Lang } from "@/Lang/lang";
import Link from "next/link";
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
            <p>{langValue["location"]}</p>
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
          <h1 className="about_page_title">{langValue["aboutPageTitle"]}</h1>
          <p className="about_question">{langValue["aboutQuestion"]}</p>
          <p className="about_story">{langValue["aboutStory"]}</p>
          <p className="about_story2">{langValue["aboutStory2"]}</p>
          <p className="about_mission">{langValue["aboutMission"]}</p>
          <p className="about_vision">{langValue["aboutVision"]}</p>
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
          <Link href={"/policy"}>
            <div className="about_quest_item">
              <div className="qest">
                <h3>{langValue["policyTitle"]}</h3>
              </div>
              <p>{langValue["policyIntro"]}</p>
            </div>
          </Link>

          <Link href={"terms"}>
            <div className="about_quest_item">
              <div className="qest">
                <h3>{langValue["termsTitle"]}</h3>
              </div>
              <p>{langValue["termsSection1_1"]}</p>
            </div>
          </Link>

          <Link href={"refund"}>
            <div className="about_quest_item">
              <div className="qest">
                <h3>{langValue["returnTitle"]}</h3>
              </div>
              <p>{langValue["returnSection1_1"]}</p>
            </div>
          </Link>
          <Link href={"usage"}>
            <div className="about_quest_item">
              <div className="qest">
                <h3>{langValue["salesTitle"]}</h3>
              </div>
              <p>{langValue["salesSection1_1"]}</p>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
