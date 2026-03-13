"use client";
import React, { useEffect, useState } from "react";
import "./OurCards.css";
import GetCards from "@/API/GetCards/GetCards.api";
import Link from "next/link";
import { Lang } from "@/Lang/lang";
import Image from "next/image";

const OurCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar"; // fallback to "ar" if null
    setSelectedLanguage(lang);
    getAllCards();
  }, []);

  const langValue = Lang[selectedLanguage] || {}; // prevent undefined

  const getAllCards = () => {
    GetCards(setLoading, setError, setAllCards);
  };

  return (
    <div className="our-cards">
      <div className="cards_banner">
        {selectedLanguage === "ar" ? (
          <Image
            src={"/images/glow card banners-02.png"}
            width={1000}
            height={500}
            alt="cards banner"
          />
        ) : (
          <Image
            src={"/images/glow card banners-08.png"}
            width={1000}
            height={500}
            alt="cards banner"
          />
        )}
      </div>

      <h1 className="our_cards_title">{langValue["membershipsPageTitle"] || langValue["cards"] || "Cards"}</h1>
      <p className="our_cards_desc">{langValue["membershipsPageDesc"]}</p>

      <div className="cards_list">
        {loading
          ? "loading..."
          : allCards?.map((item, index) => (
              <div className="card_item" key={index}>
                <Link href={`/card?id=${item._id}`}>
                  <img src={item.images} alt="glow card image" />
                  <div className="card_item_content">
                    <h2>{item.name}</h2>
                    <div className="card_item_details">
                      <span>
                        {item.price}{" "}
                        {selectedLanguage === "ar" ? (
                          <img src="/images/reyal.png" alt="reyal currency" />
                        ) : (
                          "SAR"
                        )}
                      </span>
                      <button>{langValue["reqBtn"] || "Request"}</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </div>
  );
};

export default OurCards;
