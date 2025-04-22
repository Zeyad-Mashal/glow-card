"use client";

import { useState } from "react";
import Image from "next/image";
const googleIcon = "/images/googleIcon.png";
import SEO from "../../components/SEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./login.css";
export default function Login() {
  return (
    <>
      <SEO
        title="Login"
        description="Login to your account on Glow Card."
        canonical="https://vercel.com/zeyad-mashaals-projects/glow-card/login"
      />

      <div className="login">
        <div className="login_container">
          <div className="login_content">
            <img src="/images/logo.png" alt="" />
            <h1>تسجيل الدخول</h1>
            <div className="form_group">
              <label htmlFor="phone">رقم الهاتف</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="ادخل رقمك"
              />
              <span>+966</span>
            </div>
            <button className="login_btn">تسجيل الدخول</button>

            <span className="separator">OR</span>

            <div className="login_google">
              <button>
                <span>سجل دخول بواسطة جوجل</span>
                <img src="/images/google.png" alt="" />
              </button>
            </div>
          </div>
          <div className="login_banner">
            <div className="login_card">
              <h1>Enjoy the convenience of using your discount card</h1>
              <img src="/images/card.png" alt="" />
            </div>
            <h2>Introducing new features</h2>
            <p>
              {" "}
              Get discounted rates at top medical centers without paying full
              price.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
