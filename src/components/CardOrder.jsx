import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./CardOrder.css";

const CardOrder = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="card-order">
      <div className="card_order_container">
        <div className="card_order_content">
          <img
            src="/images/card-order.png"
            alt=""
            data-aos="fade-right"
            data-aos-delay="200"
            loading="lazy"
          />

          <div
            className="card_order_content_text"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <h2>Get Your Card Today !</h2>
            <p>
              Sign up for your HealthSaver card now and start enjoying exclusive
              healthcare benefits tailored for you!
            </p>
            <button>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOrder;
