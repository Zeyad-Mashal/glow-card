"use client";
import React, { useEffect, useState } from "react";
import "./New.css";
import Link from "next/link";
import LatestFoundation from "@/API/LatestFoundation/LatestFoundation";
import Image from "next/image";
const page = () => {
  useEffect(() => {
    getLatestFoundations();
    let langToken = localStorage.getItem("lang");
    setLang(langToken);
  }, []);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allLatestFoundation, setAllLatestFoundation] = useState([]);
  const [lang, setLang] = useState("");

  const getLatestFoundations = () => {
    LatestFoundation(setloading, setError, setAllLatestFoundation);
  };
  return (
    <div className="new">
      <div className="new_banner">
        {lang === "ar" ? (
          <Image
            src={"/images/glow card banners-05.png"}
            width={1000}
            height={500}
            alt="new foundations banner"
          />
        ) : (
          <Image
            src={"/images/glow card banners-11.png"}
            width={1000}
            height={500}
            alt="new foundations banner"
          />
        )}
      </div>
      <div className="new_container">
        <h1>انضم حديثا</h1>
        <div className="new_list">
          {loading
            ? "Loading..."
            : allLatestFoundation.map((item, index) => {
                return (
                  <Link href={`/foundation-details?id=${item._id}`}>
                    <div className="new_item" key={index}>
                      <img src={item.images[0]} alt="new comes" />
                      <h2>{item.name}</h2>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default page;
