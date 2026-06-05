"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./GlowCard.css";
import GetCards from "@/API/GetCards/GetCards.api";
import Link from "next/link";
import { Lang } from "@/Lang/lang";
const GlowCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    getAllCards();
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const langValue = Lang[selectedLanguage];

  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAllCards = () => {
    GetCards(setLoading, setError, setAllCards);
  };
  return (
    <div className="glow-cards">
      <h2 data-aos="fade-up">{langValue["cards"]}</h2>
      <div className="glow-cards_container">
        <div className="glow-cards_list">
          {allCards.map((card, index) => {
            return (
              <Link href={`/card?id=${card._id}`} key={card._id}>
                <div
                  className="glow-cards_item"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  <img src={card.images[0]} alt="" loading="lazy" />
                  <h3 className="membership-card-title">{card.name}</h3>
                  <div className="card_item_btn membership-price-footer">
                    {card.type === "Custom" ? (
                      <span className="membership-custom-label">
                        اطلب الان
                      </span>
                    ) : (
                      <div className="membership-price-block">
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
                        <span className="membership-price-current">
                          {card.price}{" "}
                          {selectedLanguage === "ar" ? (
                            <img src="/images/reyal.png" alt="reyal currancy" />
                          ) : (
                            "SAR"
                          )}
                        </span>
                      </div>
                    )}

                    <button>{langValue["cityBtn"]}</button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GlowCards;
