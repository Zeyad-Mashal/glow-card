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
  const [lang, setLang] = useState("");

  useEffect(() => {
    if (id) {
      getAllRegions();
    }
    let langToken = localStorage.getItem("lang");
    setLang(langToken);
    AOS.init({ duration: 800, once: true });
  }, [id]);

  const getAllRegions = () => {
    Regions(setLoading, setError, setRegions, id);
  };

  return (
    <div className="central">
      <div className="central_banner">
        {lang === "ar" ? (
          <Image
            src={"/images/glow card banners-01.png"}
            width={1000}
            height={500}
            alt="network banner"
          />
        ) : (
          <Image
            src={"/images/glow card banners-07.png"}
            width={1000}
            height={500}
            alt="network banner"
          />
        )}
      </div>
      <div className="central_container">
        <h2>{regions[0]?.name}</h2>
        <div className="central_list">
          {loading
            ? "Loading..."
            : regions.map((item, index) => (
                <Link href={`/network?id=${item._id}`} key={index}>
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
