"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Fatorah.css";
import ApplayCoupon from "@/API/Coupon/ApplayCoupon";
const Fatorah = () => {
  /* === حالة الكوبون === */
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApi, setCouponApi] = useState("");
  const [discount, setDiscount] = useState();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const isCouponValid = couponApi.trim().length > 0;

  /* === حالة تفاصيل الفاتورة === */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsRef = useRef(null);

  /* لضبط الارتفاع عند الفتح/الإغلاق */
  useEffect(() => {
    if (!detailsRef.current) return;

    if (detailsOpen) {
      /* سلايد‑داون */
      detailsRef.current.style.maxHeight =
        detailsRef.current.scrollHeight + "px";
    } else {
      /* سلايد‑أب */
      detailsRef.current.style.maxHeight = "0px";
    }
  }, [detailsOpen]);

  /* === دوال المكوّن === */
  const handleApplyCoupon = () => {
    const data = {
      coupon: couponApi,
    };
    ApplayCoupon(setloading, setError, data);
  };
  return (
    <div className="fatorah">
      <div className="fatorah_container">
        <h1>تفاصيل الطلب</h1>

        {/* تفاصيل الفاتورة (سلايد) */}
        <div
          ref={detailsRef}
          className={`fatorah_details ${detailsOpen ? "open" : ""}`}
        >
          <div className="detail1">
            <p>ملخص السلة</p>
            <span>300 ر.س</span>
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

        {/* شريط الإجمالي + كوبون + زر الإظهار */}
        <div className="fatorah_content">
          {/* الإجمالي */}
          <div className="total">
            <h3>الإجمالي</h3>
            <span>335 ر.س</span>
          </div>

          {/* كوبون الخصم */}
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
                {error}
              </div>
            )}
          </div>

          {/* زر فتح/إغلاق التفاصيل */}
          <button
            className="toggle_details_btn"
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen ? "إخفاء التفاصيل ▲" : "تفاصيل الفاتورة ▼"}
          </button>

          <div className="payment_btn">
            <button>ادفع الان</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fatorah;
