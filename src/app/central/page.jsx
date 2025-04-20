"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./central.css";

const Central = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const items = Array(6).fill("وسط الرياض");

  return (
    <div className="central">
      <div className="central_container">
        <h2>المنطقة الوسطي</h2>
        <div className="central_list">
          <a href="/network">
            {items.map((item, index) => (
              <div
                key={index}
                className="central_item"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3>{item}</h3>
              </div>
            ))}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Central;
