import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./banner.css";
import HomeBanner from "@/API/HomeBanner/HomeBanner.api";
const Banner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [isLang, setIsLang] = useState("ar");
  useEffect(() => {
    GetAllBanners();
    AOS.init({ duration: 1000 });
    const isLang = localStorage.getItem("lang");
    setIsLang(isLang);
  }, []);

  const GetAllBanners = () => {
    HomeBanner(setLoading, setError, setBanners);
  };

  return (
    <div className="banner">
      {isLang === "ar"
        ? banners.slice(0, 4).map((item, index) => {
            return (
              <a href={item.url} key={index} target="_blank">
                <img
                  src={item.banner}
                  alt={`Home Banner ${index + 1}`}
                  data-aos="fade-up"
                  loading="lazy"
                />
              </a>
            );
          })
        : banners.slice(4).map((item, index) => {
            return (
              <a href={item.url} key={index} target="_blank">
                <img
                  src={item.banner}
                  alt={`Home Banner ${index + 5}`}
                  data-aos="fade-up"
                  loading="lazy"
                />
              </a>
            );
          })}
    </div>
  );
};

export default Banner;
