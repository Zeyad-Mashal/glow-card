// components/FatorahClient.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Fatorah.css";
import ApplayCoupon from "@/API/Coupon/ApplayCoupon";
import Payment from "@/API/Payment/Payment";
import { useSearchParams } from "next/navigation";

const FatorahClient = () => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApi, setCouponApi] = useState("");
  const [discount, setDiscount] = useState();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const isCouponValid = couponApi.trim().length > 0;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsRef = useRef(null);

  const [price, setPrice] = useState();
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const price = localStorage.getItem("price");
    const token = localStorage.getItem("token");
    setToken(token);
    setPrice(price);
    if (!detailsRef.current) return;

    if (detailsOpen) {
      detailsRef.current.style.maxHeight =
        detailsRef.current.scrollHeight + "px";
    } else {
      detailsRef.current.style.maxHeight = "0px";
    }
  }, [detailsOpen]);

  const handleApplyCoupon = () => {
    const data = {
      coupon: couponApi,
    };
    ApplayCoupon(setloading, setError, data, setDiscount, setPrice);
  };

  const paymentGetway = () => {
    if (userName === "" && email === "" && phone === "") {
      alert("يجب ملئ جميع البيانات اولا");
    }
    if (!token) {
      alert("يجب تسجيل الدخول اولا");
    }
    const data = {
      email,
      name: userName,
      phone,
      productId: id,
      coupon: couponApi || undefined,
      totalPrice: price,
    };
    Payment(setloading, setError, data);
  };

  return (
    <div className="fatorah">
      <div className="fatorah_container">
        <h1>تفاصيل الطلب</h1>
        <div
          ref={detailsRef}
          className={`fatorah_details ${detailsOpen ? "open" : ""}`}
        >
          <div className="detail1">
            <p>ملخص السلة</p>
            <span>{price} ر.س</span>
          </div>
          <div className="detail1">
            <p>تكلفة الشحن</p>
            <span>20 ر.س</span>
          </div>
          <div className="detail1">
            <p>ضريبة القيمة المضافة</p>
            <span>15 ر.س</span>
          </div>
        </div>

        <div className="fatorah_content">
          <div className="total">
            <h3>الإجمالي</h3>
            <span>{price} ر.س</span>
          </div>

          <div className="coupon_section">
            <button
              className="coupon_button"
              onClick={() => setShowCouponInput(!showCouponInput)}
            >
              {showCouponInput ? "إلغاء" : "لديك كوبون تخفيض؟"}
            </button>

            {showCouponInput && (
              <div className="coupon_input_container">
                <input
                  type="text"
                  placeholder="اكتب الكوبون"
                  value={couponApi}
                  onChange={(e) => setCouponApi(e.target.value)}
                  className="coupon_input"
                />

                <button
                  className="apply_button"
                  onClick={handleApplyCoupon}
                  disabled={!isCouponValid}
                >
                  تطبيق
                </button>
                {error && <p className="error">{error}</p>}
              </div>
            )}
          </div>

          <button
            className="toggle_details_btn"
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen ? "إخفاء التفاصيل ▲" : "تفاصيل الفاتورة ▼"}
          </button>

          <div className="payment_data">
            <label>
              <span>الاسم</span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </label>
            <label>
              <span>رقم الهاتف</span>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label>
              <span>الايميل</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div className="payment_btn">
            <button onClick={paymentGetway}>ادفع الان</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatorahClient;
