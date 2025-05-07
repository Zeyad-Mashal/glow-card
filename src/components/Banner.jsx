import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./banner.css";
import HomeBanner from "@/API/HomeBanner/HomeBanner.api";
const Banner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    GetAllBanners();
    AOS.init({ duration: 1000 });
  }, []);

  const GetAllBanners = () => {
    HomeBanner(setLoading, setError, setBanners);
  };

  return (
    <div className="banner">
      {banners.map((item, index) => {
        return (
          <a href={item.url} key={index} target="_blank">
            <img
              src={item.banner}
              alt="Home Banners"
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
