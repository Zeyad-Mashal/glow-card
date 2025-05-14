"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./network.css";
import Foundation from "@/API/Foundation/Foundation.api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const NetworkClient = () => {
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foundations, setFoundations] = useState([]);
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    getAllFoundations();
    AOS.init({ duration: 800, once: true });
  }, [id]); // إعادة التحميل إذا تغير `id`

  const getAllFoundations = () => {
    Foundation(setLoading, setError, setFoundations, id);
  };

  return (
    <div className="Network">
      <div className="network_container">
        <h2>{lang === "ar" ? "شبكه الجهات" : "Glow Card Foundations"}</h2>
        <div className="netword_controller">
          <input type="text" placeholder="ابحث" />
        </div>
        <div className="network_list">
          {loading
            ? "Loading ..."
            : foundations.map((item, index) => (
                <div
                  key={index}
                  className="network_item"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img src={item.images[0]} alt="network page image" />
                  <Link href={`/foundation-details?id=${item._id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkClient;
