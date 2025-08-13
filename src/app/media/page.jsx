"use client";
import React, { useState, useEffect } from "react";
import "./media.css";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import GetCards from "@/API/GetCards/GetCards.api";
import { Lang } from "@/Lang/lang";
const Page = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    getAllCards();
  }, []);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [allCards, setAllCards] = useState([]);

  const getAllCards = () => {
    GetCards(setloading, setError, setAllCards);
  };

  const [selectedCard, setSelectedCard] = useState(null);
  const langValue = Lang[selectedLanguage];

  return (
    <div className="media">
      <div className="media_container">
        <h1>{langValue["mdia"]}</h1>
        <p>{langValue["submedia"]}</p>
        <video src={"/images/media.mp4"} controls loop autoPlay></video>

        <h3>{langValue["cards"]}</h3>
        <div className="media_gallery">
          {loading ? (
            <span class="loader"></span>
          ) : (
            allCards.map((card, index) => (
              <img
                key={index}
                src={card.images}
                alt={card.name}
                onClick={() => setSelectedCard(card)}
              />
            ))
          )}
        </div>

        <h3>{langValue["contactUs"]}</h3>
        <div className="media_social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="tel:+966542220888" target="_blank" rel="noreferrer">
            <FaPhoneAlt />
          </a>
          <a
            href="mailto:Info@glowcard.com.sa"
            target="_blank"
            rel="noreferrer"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* المودال */}
      {selectedCard && (
        <div className="modal_overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedCard.images} alt={selectedCard.name} />
            <h2>{selectedCard.name}</h2>
            <p>{selectedCard.description}</p>
            <h4>{selectedCard.price}</h4>
            <button className="buy_btn">شراء الآن</button>
            <button className="close_btn" onClick={() => setSelectedCard(null)}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
