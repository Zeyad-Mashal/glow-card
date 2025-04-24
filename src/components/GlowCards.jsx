"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./GlowCard.css";
import GetCards from "@/API/GetCards/GetCards.api";
import Link from "next/link";
const GlowCards = () => {
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getAllCards();
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const getAllCards = () => {
    GetCards(setLoading, setError, setAllCards);
  };

  return (
    <div className="glow-cards">
      <h2 data-aos="fade-up">Glow Cards</h2>
      <div className="glow-cards_container">
        <div className="glow-cards_list">
          {allCards.map((card, index) => {
            return (
              <div
                key={card._id}
                className="glow-cards_item"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <img src={card.images[0]} alt="" />
                <h3>{card.name}</h3>
                <div className="card_item_btn">
                  <span>{card.price}SAR</span>
                  <Link href={`/card?id=${card._id}`}>Learn More</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GlowCards;
