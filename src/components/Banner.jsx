import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./banner.css";

const Banner = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="banner">
      <img src="/images/banner.jpg" alt="" data-aos="fade-up" />
      <img src="/images/banner.jpg" alt="" data-aos="fade-up" />
      <img src="/images/banner.jpg" alt="" data-aos="fade-up" />
      <img src="/images/banner.jpg" alt="" data-aos="fade-up" />
    </div>
  );
};

export default Banner;
