"use client";
import React, { useState, useEffect } from "react";
import { Lang } from "@/Lang/lang";
import Link from "next/link";
import "./FinalCTA.css";

const FinalCTA = () => {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "ar");
  }, []);

  const t = Lang[lang];

  return (
    <section className="final_cta">
      <div className="final_cta_container">
        <h2 className="final_cta_title">{t["finalCtaTitle"]}</h2>
        <p className="final_cta_sub">{t["finalCtaSub"]}</p>
        <Link href="/our_cards" className="final_cta_btn">
          {t["finalCtaBtn"]}
        </Link>
        <p className="final_cta_trust">{t["finalCtaTrust"]}</p>
      </div>
    </section>
  );
};

export default FinalCTA;
