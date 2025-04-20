"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./network.css";

const Network = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const hospitals = Array(6).fill("مستشفى رعاية الطبية (الرياض - الملز )");

  return (
    <div className="Network">
      <div className="network_container">
        <h2>شبكه الجهات</h2>
        <div className="netword_controller">
          <input type="text" placeholder="ابحث" />
          <select>
            <option value="all">جميع الجهات</option>
            <option value="hospital">المستشفيات</option>
            <option value="pharmacy">الصيدليات</option>
            <option value="laboratory">المختبرات</option>
          </select>
        </div>
        <div className="network_list">
          {hospitals.map((name, index) => (
            <div
              key={index}
              className="network_item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img src="/images/network1.jpeg" alt="network page image" />
              <h3>{name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
