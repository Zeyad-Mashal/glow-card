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
import { Lang } from "@/Lang/lang";
import Image from "next/image";
import GetCards from "@/API/GetCards/GetCards.api";
export default function CardDetailsClient() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
    getAllCards();
  }, []);
  const langValue = Lang[selectedLanguage];
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardDetails, setCardDetails] = useState({});
  const [allCards, setAllCards] = useState([]);

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

  const goToApplication = (id, type, price) => {
    localStorage.setItem("type", type);
    localStorage.setItem("price", price);
    router.push(`/fatorah?id=${id}`);
    console.log("test");
  };

  const goToCard = (id, type, price) => {
    localStorage.setItem("type", type);
    localStorage.setItem("price", price);
    router.push(`/card?id=${id}`);
    console.log("test");
  };

  const getAllCards = () => {
    GetCards(setLoading, setError, setAllCards);
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
                loading="lazy"
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
                loading="lazy"
              />
            </SwiperSlide>
          </Swiper>

          <div className="card_content">
            <h1>{cardDetails.name}</h1>
            <div className="card_discount">
              <p>
                {langValue["price"]} {cardDetails.price} ريال
              </p>
              <div className="card_discount_text">
                <img src="/images/discount.png" alt="" />
                <span>
                  {cardDetails.discount}% {langValue["Discount"]}
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                goToApplication(
                  cardDetails._id,
                  cardDetails.type,
                  cardDetails.price
                )
              }
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
              {langValue["reqBtn"]}
            </button>
          </div>
        </div>

        <div className="howItWorks">
          <div className="howItWorks_controller">
            <h2
              className={activeTab === "howItWorks" ? "active" : ""}
              onClick={() => handleTabClick("howItWorks")}
            >
              {langValue["howItWorks"]}
            </h2>
            <h2
              className={activeTab === "description" ? "active" : ""}
              onClick={() => handleTabClick("description")}
            >
              {langValue["desc"]}
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
          <div className="cards">
            <div className="cards_list">
              {allCards.map((card, index) => {
                return (
                  <div
                    className="card_item"
                    key={index}
                    onClick={() => goToCard(card._id, card.type, card.price)}
                  >
                    <Image
                      src={card.images[0]}
                      width={300}
                      height={200}
                      alt="related cards"
                    />
                    <div className="card_item_content">
                      <h3>{card.name}</h3>
                      <p>{card.price} ريال</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
