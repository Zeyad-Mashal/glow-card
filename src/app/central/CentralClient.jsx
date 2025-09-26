"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./central.css";
import Regions from "@/API/Regions/Regions.api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const CentralClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [lang, setLang] = useState("ar"); // default to "ar"

  useEffect(() => {
    if (id) {
      getAllRegions();
    }

    try {
      const langToken = localStorage.getItem("lang") || "ar";
      setLang(langToken);
    } catch (err) {
      console.warn("Could not read lang from localStorage", err);
      setLang("ar");
    }

    AOS.init({ duration: 800, once: true });
  }, [id]);

  const getAllRegions = () => {
    Regions(setLoading, setError, setRegions, id);
  };

  return (
    <div className="central">
      <div className="central_banner">
        <Image
          src={
            lang === "ar"
              ? "/images/glow card banners-01.png"
              : "/images/glow card banners-07.png"
          }
          width={1000}
          height={500}
          alt="network banner"
        />
      </div>

      <div className="central_container">
        {/* Header: safe check */}
        <h2>{regions.length > 0 ? regions[0].name : "..."}</h2>

        <div className="central_list">
          {loading && "Loading..."}
          {error && <p className="error">❌ {error}</p>}
          {!loading && regions.length === 0 && !error && (
            <p>No regions found.</p>
          )}

          {regions.map((item, index) => (
            <Link href={`/network?id=${item._id}`} key={item._id}>
              <div
                className="central_item"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3>{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentralClient;
