"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./region.css";

const Region = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="Region">
      <div className="region_container">
        <h2>شبكة جلو كارد</h2>
        <div className="region_list">
          {[
            "المنطقة الوسطى",
            "المنطقة الوسطى",
            "المنطقة الوسطى",
            "المنطقة الوسطى",
          ].map((item, index) => (
            <div
              key={index}
              className="region_item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img src="/images/wsta.png" alt="Region Page Image" />
              <div className="region_item_text">
                <h3>{item}</h3>
                <a href="/central" className="btn btn-primary">
                  المزيد <span>--&gt;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Region;
