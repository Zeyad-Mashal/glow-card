"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./GlowCard.css";

const GlowCards = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="glow-cards">
      <h2 data-aos="fade-up">Glow Cards</h2>
      <div className="glow-cards_container">
        <div className="glow-cards_list">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div
              key={index}
              className="glow-cards_item"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <img src="/images/card.png" alt="" />
              <h3>Personal Card</h3>
              <p>Personal card with your name and details.</p>
              <div className="card_item_btn">
                <span>100SAR</span>
                <a href="/card">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlowCards;
