"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./NewsLetter.css";

const NewsLetter = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="newsletter" data-aos="fade-up">
      <div className="newsletter_container">
        <h3 className="newsletter_title">Join Us</h3>
        <p>
          Problems trying to resolve the conflict between the two major realms
          of Classical physics: Newtonian mechanics
        </p>
        <div className="newsletter_input">
          <input type="text" placeholder="Email" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
