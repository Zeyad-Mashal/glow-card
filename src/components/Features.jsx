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
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
    AOS.init({ duration: 1200, once: true, easing: "ease-out-back" });
  }, []);
  const langValue = Lang[selectedLanguage];

  return (
    <div className="features">
      <h2>{langValue["Features"]}</h2>
      <p>Save money on trusted services and providers</p>
      <div className="features_container">
        <div className="features_list">
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="100"
          >
            <FontAwesomeIcon icon={faAddressCard} /> <h3>Choose Card</h3>
          </div>
          <div
            className="features_item"
            data-aos="flip-up"
            data-aos-delay="200"
          >
            <FontAwesomeIcon icon={faLeaf} /> <h3>Use Calms</h3>
          </div>
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <FontAwesomeIcon icon={faUserDoctor} /> <h3>Health Check</h3>
          </div>
          <div
            className="features_item"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            <FontAwesomeIcon icon={faUsers} /> <h3>No memberchip</h3>
          </div>
        </div>
        <div className="features_content">
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faPercent} />
              <h3>Save on doctor visits</h3>
            </div>

            <p>
              Access to substantial savings on a wide range of medical services
              and treatments, helping you manage your healthcare costs
              effectively.
            </p>
          </div>
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faCommentsDollar} />{" "}
              <h3>Pay less for doctor visits</h3>
            </div>

            <p>
              Receive discounts on doctor consultations, making it more
              affordable to seek medical advice and routine check-ups.
            </p>
          </div>
          <div className="features_content_item">
            <div className="features_content_top">
              <FontAwesomeIcon icon={faReceipt} />{" "}
              <h3>No coupons or memberships needed</h3>
            </div>

            <p>
              Enjoy the convenience of using your discount card without the
              hassle of coupons or ongoing membership fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
