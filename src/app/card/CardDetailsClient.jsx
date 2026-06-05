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
import normalizeMembershipType from "@/utils/normalizeMembershipType";
import {
  parseTrackingPrice,
  trackAddToCart,
  trackViewContent,
} from "@/components/tracking/events";
export default function CardDetailsClient() {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
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
  useEffect(() => {
    router.prefetch("/fatorah");
  }, []);

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

  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (cardDetails?._id) {
      trackViewContent({
        contentId: cardDetails._id,
        contentName: cardDetails.name,
        value: parseTrackingPrice(cardDetails.price),
      });
    }
  }, [cardDetails]);

  const goToApplication = (id, type, price) => {
    localStorage.setItem("type", normalizeMembershipType(type));
    localStorage.setItem("price", price);

    trackAddToCart({
      contentId: id,
      contentName: normalizeMembershipType(type),
      value: parseTrackingPrice(price),
    });

    const token = localStorage.getItem("token");
    const fatorahUrl = `/fatorah?id=${id}`;

    if (!token) {
      localStorage.setItem("redirectAfterLogin", fatorahUrl);
      router.push("/login");
      return;
    }

    setNavigating(true);
    router.push(fatorahUrl);
  };

  const goToCard = (id, type, price) => {
    localStorage.setItem("type", normalizeMembershipType(type));
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
            <div className="card_discount membership-price-block membership-price-block--hero">
              {cardDetails.originalPrice ? (
                <span className="membership-price-original membership-price-original--hero">
                  {cardDetails.originalPrice}
                  {selectedLanguage === "ar" ? (
                    <img src="/images/reyal-gray.png" alt="reyal currency" />
                  ) : (
                    " SAR"
                  )}
                </span>
              ) : null}
              <p className="membership-price-current membership-price-current--hero">
                {cardDetails.price}
                {selectedLanguage === "ar" ? (
                  <img src="/images/reyal.png" alt="reyal currency" />
                ) : (
                  " SAR"
                )}
              </p>
              {/* <div className="card_discount_text">
                <img src="/images/discount.png" alt="" />
                <span>
                  {cardDetails.discount}% {langValue["Discount"]}
                </span>
              </div> */}
            </div>
            <div className="card_actions">
              <button
                onClick={() =>
                  cardDetails.type === "Custom"
                    ? router.push("/request-card")
                    : goToApplication(
                        cardDetails._id,
                        cardDetails.type,
                        cardDetails.price,
                      )
                }
                disabled={navigating}
              >
                {navigating ? (
                  selectedLanguage === "ar" ? (
                    <span className="loader"></span>
                  ) : (
                    <span className="loader"></span>
                  )
                ) : (
                  <>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
                    {langValue["reqBtn"]}
                  </>
                )}
              </button>
              {/* <button
                onClick={() =>
                  cardDetails.type === "Custom"
                    ? router.push("/request-card")
                    : goToApplication(
                        cardDetails._id,
                        cardDetails.type,
                        cardDetails.price,
                      )
                }
                disabled={navigating}
              >
                {selectedLanguage === "ar" ? (
                  <Image
                    src="/images/tamara-ar.svg"
                    alt="Tamara"
                    width={80}
                    height={80}
                  />
                ) : (
                  <Image
                    src="/images/tamara-en.svg"
                    alt="Tamara"
                    width={80}
                    height={80}
                  />
                )}
              </button> */}
            </div>
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
                <p>{langValue["howItWorks2"]}</p>
                <div className="steps">
                  <div className="step1">
                    <h3>1</h3>
                    <p>{langValue["howItWorks3"]}</p>
                  </div>

                  <div className="step1">
                    <h3>2</h3>
                    <p>{langValue["howItWorks4"]}</p>
                  </div>

                  <div className="step1">
                    <h3>3</h3>
                    <p>{langValue["howItWorks5"]}</p>
                  </div>

                  <div className="step1">
                    <h3>4</h3>
                    <p>{langValue["howItWorks6"]}</p>
                  </div>
                </div>
                <p className="howItWorks8">{langValue["howItWorks7"]}</p>
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
                      <h3 className="membership-card-title">{card.name}</h3>
                      <div className="membership-price-block">
                        {card.originalPrice ? (
                          <span className="membership-price-original">
                            {card.originalPrice}{" "}
                            {selectedLanguage === "ar" ? (
                              <img
                                src="/images/reyal-gray.png"
                                alt="reyal currency"
                              />
                            ) : (
                              "SAR"
                            )}
                          </span>
                        ) : null}
                        <span className="membership-price-current">
                          {card.price}{" "}
                          {selectedLanguage === "ar" ? (
                            <img src="/images/reyal.png" alt="reyal currency" />
                          ) : (
                            "SAR"
                          )}
                        </span>
                      </div>
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
