import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faLeaf,
  faUsers,
  faUserDoctor,
  faPercent,
  faCommentsDollar,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import "./features.css";
import { Lang } from "@/Lang/lang";

const Features = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    AOS.init({ duration: 1200, once: true, easing: "ease-out-back" });
  }, []);
  const langValue = Lang[selectedLanguage];

  return (
    <div className="features">
      <h2>{langValue["Features"]}</h2>
      <p>{langValue["featuresSub"]}</p>
      <div className="features_container">
        <div className="features_list">
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="100"
          >
            <FontAwesomeIcon icon={faAddressCard} />{" "}
            <h3>{langValue["featuresSub1"]}</h3>
          </div>
          <div
            className="features_item"
            data-aos="flip-up"
            data-aos-delay="200"
          >
            <FontAwesomeIcon icon={faLeaf} />{" "}
            <h3>{langValue["featuresSub2"]}</h3>
          </div>
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <FontAwesomeIcon icon={faUserDoctor} />{" "}
            <h3>{langValue["featuresSub3"]}</h3>
          </div>
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <FontAwesomeIcon icon={faUsers} />{" "}
            <h3>{langValue["featuresSub4"]}</h3>
          </div>
        </div>
        <div className="features_content">
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faPercent} />
              <h3>{langValue["featuresSub5"]}</h3>
            </div>

            <p>{langValue["featuresSub6"]}</p>
          </div>
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faCommentsDollar} />{" "}
              <h3>{langValue["featuresSub7"]}</h3>
            </div>

            <p>{langValue["featuresSub8"]}</p>
          </div>
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faReceipt} />{" "}
              <h3>{langValue["featuresSub9"]}</h3>
            </div>

            <p>{langValue["featuresSub10"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
