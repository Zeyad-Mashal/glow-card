"use client";
import React, { useEffect, useState } from "react";
import "./offers.css";
import GetOffers from "@/API/GetOffers/GetOffers";
import Link from "next/link";
import { Lang } from "@/Lang/lang";
import Image from "next/image";

const OurCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allOffers, setAllOffers] = useState([]);
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);

    getAllOffers();
  }, []);
  const langValue = Lang[selectedLanguage];

  const getAllOffers = () => {
    GetOffers(setLoading, setError, setAllOffers);
  };
  return (
    <div className="our-cards">
      <div className="offers_banner">
        {selectedLanguage === "ar" ? (
          <Image
            src={"/images/glow card banners-03.png"}
            width={1000}
            height={500}
            alt="offers banner"
          />
        ) : (
          <Image
            src={"/images/glow card banners-09.png"}
            width={1000}
            height={500}
            alt="offers banner"
          />
        )}
      </div>
      <h1>{allOffers.length <= 0 ? "لا يوجد عروض الان" : "عروضنا"}</h1>
      <div className="cards_list">
        {loading ? (
          "loading..."
        ) : allOffers.length <= 0 ? (
          <div className="no_offers">
            <p>انتظر اقوي العروض قريبا</p>
            <img src="/images/notfound.png" alt="" width={250} />
          </div>
        ) : (
          allOffers.map((item, index) => {
            return (
              <div className="card_item" key={index}>
                <img src={item.images} alt="glow card image" />
                <div className="card_item_content">
                  <h2>{item.name}</h2>
                  <div className="card_item_details">
                    <span>
                      {item.price}{" "}
                      <img src="/images/reyal.png" alt="reyal currancy" />
                    </span>
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
          })
        )}
      </div>
    </div>
  );
};

export default OurCards;
