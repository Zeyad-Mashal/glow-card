"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./region.css";
import City from "@/API/City/City.api";
import Link from "next/link";
import { Lang } from "@/Lang/lang";
const Region = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);
  const langValue = Lang[selectedLanguage];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);
  useEffect(() => {
    getAllCities();
    AOS.init({ duration: 800, once: true });
  }, []);

  const getAllCities = () => {
    City(setLoading, setError, setAllCities);
  };

  return (
    <div className="Region">
      <div className="region_container">
        <h2>{langValue["city"]}</h2>
        <div className="region_list">
          {loading
            ? "Loading..."
            : allCities.map((item, index) => (
                <div
                  key={index}
                  className="region_item"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img
                    src="/images/wsta.png"
                    alt="Region Page Image"
                    loading="lazy"
                  />
                  <div className="region_item_text">
                    <h3>{item.name}</h3>
                    <Link
                      href={`/central?id=${item._id}`}
                      className="btn btn-primary"
                    >
                      {langValue["cityBtn"]}
                      {/* <span>--&gt;</span> */}
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Region;
