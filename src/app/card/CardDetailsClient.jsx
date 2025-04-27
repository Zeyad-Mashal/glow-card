"use client";
import React, { useState, useEffect } from "react";
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
import CardDetailsApi from "@/API/CardDetails/CardDetailsApi.api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CardDetailsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("howItWorks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardDetails, setCardDetails] = useState({});

  useEffect(() => {
    if (id) {
      getCardDetails();
    }
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getCardDetails = () => {
    if (!id) {
      alert("No ID provided in the URL");
      return;
    }
    CardDetailsApi(setLoading, setError, setCardDetails, id);
  };

  const goToApplication = (id, type) => {
    localStorage.setItem("type", type);
    router.push(`/application?id=${id}`);
  };

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
                src={
                  cardDetails?.images
                    ? cardDetails?.images[0]
                    : "/images/card-loading.webp"
                }
                alt="Visa Front"
                className="card-img"
              />
            </SwiperSlide>
            <SwiperSlide className="card-slide">
              <img
                src={
                  cardDetails?.images
                    ? cardDetails?.images[0]
                    : "/images/card-loading.webp"
                }
                alt="Visa Back"
                className="card-img"
              />
            </SwiperSlide>
          </Swiper>

          <div className="card_content">
            <h1>{cardDetails.name}</h1>
            <div className="card_discount">
              <p>Price {cardDetails.price} SAR</p>
              <div className="card_discount_text">
                <img src="/images/discount.png" alt="" />
                <span>{cardDetails.discount}% Discount</span>
              </div>
            </div>
            <button
              onClick={() => goToApplication(cardDetails._id, cardDetails.type)}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Request Card
            </button>
          </div>
        </div>

        <div className="howItWorks">
          <div className="howItWorks_controller">
            <h2
              className={activeTab === "howItWorks" ? "active" : ""}
              onClick={() => handleTabClick("howItWorks")}
            >
              How It Works
            </h2>
            <h2
              className={activeTab === "description" ? "active" : ""}
              onClick={() => handleTabClick("description")}
            >
              Description
            </h2>
          </div>
          <div className="howItWorks_container">
            {activeTab === "howItWorks" ? (
              <>
                <p>
                  Your pay-by-bank solution, built in weeks. We help you deliver
                  a frictionless payment experience for your customers while
                  keeping your devs happy. No need for PCI compliance.
                </p>
                <div className="steps">
                  {[1, 2, 3, 4].map((step) => (
                    <div className="step1" key={step}>
                      <h3>{step}</h3>
                      <p>Card created with mechanics</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <pre>{cardDetails.description}</pre>
            )}
          </div>
        </div>

        <div className="advantages">
          <h2>Advantages</h2>
          <div className="advantages_list">
            {[1, 2, 3].map((_, i) => (
              <React.Fragment key={i}>
                <div className="advantage_item">
                  <div className="item_title">
                    <FontAwesomeIcon icon={faStar} />
                    <h3>Easy to Use</h3>
                  </div>
                  <p>
                    Get discounted rates at top medical centers without paying
                    full price.
                  </p>
                </div>
                <div className="advantage_item item_img"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
