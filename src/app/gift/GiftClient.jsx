"use client";
import React, { useEffect, useState } from "react";
import "./gift.css";
import { useSearchParams } from "next/navigation";
import GiftApi from "@/API/Gift/GiftApi";

const GiftClient = () => {
  const searchParams = useSearchParams();
  const payId = searchParams.get("gift");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const data = { id: payId };
    GiftApi(setloading, setError, data);
  }, []);

  return (
    <div className="gift">
      <div className="gift_container">
        <div className="gift_content">
          <h1>جاري البحث عن هديتك...</h1>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default GiftClient;
