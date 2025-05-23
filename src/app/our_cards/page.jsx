"use client";
import React, { useEffect, useState } from "react";
import "./OurCards.css";
import GetCards from "@/API/GetCards/GetCards.api";
import Link from "next/link";
import { Lang } from "@/Lang/lang";

const OurCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCards, setAllCards] = useState([]);
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    getAllCArds();
  }, []);
  const langValue = Lang[selectedLanguage];

  const getAllCArds = () => {
    GetCards(setLoading, setError, setAllCards);
  };
  return (
    <div className="our-cards">
      <h1>{langValue["cards"]}</h1>
      <div className="cards_list">
        {loading
          ? "loading..."
          : allCards.map((item, index) => {
              return (
                <div className="card_item" key={index}>
                  <img src={item.images} alt="glow card image" />
                  <div className="card_item_content">
                    <h2>{item.name}</h2>
                    <div className="card_item_details">
                      <span>{item.price} SAR</span>
                      <button>
                        <Link href={`/card?id=${item._id}`}>
                          {" "}
                          {langValue["reqBtn"]}
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default OurCards;
