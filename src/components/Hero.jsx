import React from "react";
import "./hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero_container">
        <div className="hero_content animateLuxuryFadeIn lux-delay-2">
          <h1>
            Enjoy Big Savings at trusted medical centers with our discount card!
          </h1>
          <p>Caring for your health just got easier.</p>
          <button>Join Now</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
