import React from "react";
import "./hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero_container">
        {/* <div className="hero_user animateLuxuryFadeIn lux-delay-1">
          <img src="/images/hero_users.png" alt="" />
        </div> */}
        <div className="hero_content animateLuxuryFadeIn lux-delay-2">
          <h1>
            Engjoy Big Savings at trusted medical centers with our discount
            card!
          </h1>
          <p>Caring for your health just got easier.</p>
          <button>Join Now</button>
        </div>
        {/* <div className="hero_topReview animateLuxuryFadeIn lux-delay-3">
          <img src="/images/hero_test.png" alt="" className="hero review" />
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
