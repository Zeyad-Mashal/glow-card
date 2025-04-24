"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./central.css";
import Regions from "@/API/Regions/Regions.api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CentralClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (id) {
      getAllRegions();
    }
    AOS.init({ duration: 800, once: true });
  }, [id]);

  const getAllRegions = () => {
    Regions(setLoading, setError, setRegions, id);
  };

  return (
    <div className="central">
      <div className="central_container">
        <h2>المنطقة الوسطي</h2>
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
