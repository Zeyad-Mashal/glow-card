"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "swiper/css";
import "swiper/css/effect-cards";
import "./card.css";

export default function CardDetails() {
  return (
    <div className="card">
      <div className="card_container">
        <div className="card_details">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            <SwiperSlide className="card-slide">
              <img
                src="/images/card.png"
                alt="Visa Front"
                className="card-img"
              />
            </SwiperSlide>
            <SwiperSlide className="card-slide">
              <img
                src="/images/visa2.png"
                alt="Visa Back"
                className="card-img"
              />
            </SwiperSlide>
          </Swiper>

          <div className="card_content">
            <h1>Personal Card</h1>
            <div className="card_discount">
              <p>Price 100 SAR</p>
              <div className="card_discount_text">
                <img src="/images/discount.png" alt="" />
                <span>30% Discount</span>
              </div>
            </div>
            <button>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Request Card
            </button>
          </div>
        </div>

        <div className="howItWorks">
          <div className="howItWorks_controller">
            <h2 className="active">How It Works</h2>
            <h2>Description</h2>
          </div>
          <div className="howItWorks_container">
            <p>
              Your pay-by-bank solution, built in weeks. We help you deliver a
              frictionless payment experience for your customers while keeping
              your devs happy. No need for PCI compliance.
            </p>
            <div className="steps">
              <div className="step1">
                <h3>1</h3>
                <p>Card created with mechanics</p>
              </div>
              <div className="step1">
                <h3>2</h3>
                <p>Card created with mechanics</p>
              </div>
              <div className="step1">
                <h3>3</h3>
                <p>Card created with mechanics</p>
              </div>
              <div className="step1">
                <h3>4</h3>
                <p>Card created with mechanics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="advantages">
          <h2>Advantages</h2>
          <div className="advantages_list">
            <div className="advantage_item">
              <div className="item_title">
                <FontAwesomeIcon icon={faStar} />
                <h3>Easy to Use</h3>
              </div>
              <p>
                {" "}
                Get discounted rates at top medical centers without paying full
                price.
              </p>
            </div>
            <div className="advantage_item item_img"></div>
            <div className="advantage_item">
              <div className="item_title">
                <FontAwesomeIcon icon={faStar} />
                <h3>Easy to Use</h3>
              </div>
              <p>
                {" "}
                Get discounted rates at top medical centers without paying full
                price.
              </p>
            </div>
            <div className="advantage_item item_img"></div>

            <div className="advantage_item">
              <div className="item_title">
                <FontAwesomeIcon icon={faStar} />
                <h3>Easy to Use</h3>
              </div>
              <p>
                {" "}
                Get discounted rates at top medical centers without paying full
                price.
              </p>
            </div>
            <div className="advantage_item item_img"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
