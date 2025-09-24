import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faLeaf,
  faUser,
  faUserDoctor,
  faPercent,
  faCommentsDollar,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import "./features.css";
import { Lang } from "@/Lang/lang";
import Link from "next/link";

const Features = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [cityId, setCityId] = useState("");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    const city = JSON.parse(localStorage.getItem("user_city"));
    setCityId(city.id);

    AOS.init({ duration: 1200, once: true, easing: "ease-out-back" });
  }, []);
  const langValue = Lang[selectedLanguage];

  return (
    <div className="features">
      <h2>{langValue["Features"]}</h2>
      <p>{langValue["featuresSub"]}</p>
      <div className="features_container">
        <div className="features_list">
          <Link href={`/central?id=${cityId}`}>
            <div
              className="features_item"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              <FontAwesomeIcon icon={faUserDoctor} />{" "}
              <h3>{langValue["featuresSub1"]}</h3>
            </div>
          </Link>
          <Link href={"/our_cards"}>
            <div
              className="features_item"
              data-aos="flip-up"
              data-aos-delay="200"
            >
              <FontAwesomeIcon icon={faAddressCard} />{" "}
              <h3>{langValue["featuresSub2"]}</h3>
            </div>
          </Link>
          <Link href={"/profile"}>
            <div
              className="features_item"
              data-aos="zoom-in-up"
              data-aos-delay="300"
            >
              <FontAwesomeIcon icon={faUser} />{" "}
              <h3>{langValue["featuresSub3"]}</h3>
            </div>
          </Link>
          <Link href={"/glow-club"}>
            <div
              className="features_item"
              data-aos="zoom-in-up"
              data-aos-delay="300"
            >
              <FontAwesomeIcon icon={faLeaf} />{" "}
              <h3>{langValue["featuresSub4"]}</h3>
            </div>
          </Link>
        </div>
        <div className="features_content">
          <div
            className="features_content_item"
            data-aos="zoom-in-up"
            data-aos-delay="100"
          >
            <div className="features_content_top">
              <FontAwesomeIcon icon={faPercent} />
              <h3>{langValue["featuresSub5"]}</h3>
            </div>

            <p>{langValue["featuresSub6"]}</p>
          </div>
          <div
            className="features_content_item"
            data-aos="zoom-in-up"
            data-aos-delay="200"
          >
            <div className="features_content_top">
              <FontAwesomeIcon icon={faCommentsDollar} />{" "}
              <h3>{langValue["featuresSub7"]}</h3>
            </div>

            <p>{langValue["featuresSub8"]}</p>
          </div>
          <div
            className="features_content_item"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
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
