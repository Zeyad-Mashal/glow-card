// components/FatorahClient.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Fatorah.css";
import ApplayCoupon from "@/API/Coupon/ApplayCoupon";
import Payment from "@/API/Payment/Payment";
import { useSearchParams, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";

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
  const [cardType, setCardType] = useState();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    const price = localStorage.getItem("price");
    const token = localStorage.getItem("token");
    const cardType = localStorage.getItem("type");
    setToken(token);
    setPrice(price);
    setCardType(cardType);
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
      router.push("/login");
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

  const countries = [
    { name: "Saudi Arabia", iso2: "SA", dial_code: "+966" },
    { name: "United Arab Emirates", iso2: "AE", dial_code: "+971" },
    { name: "Egypt", iso2: "EG", dial_code: "+20" },
    { name: "Kuwait", iso2: "KW", dial_code: "+965" },
    { name: "Qatar", iso2: "QA", dial_code: "+974" },
    { name: "Bahrain", iso2: "BH", dial_code: "+973" },
    { name: "Oman", iso2: "OM", dial_code: "+968" },
    { name: "Jordan", iso2: "JO", dial_code: "+962" },
    { name: "Lebanon", iso2: "LB", dial_code: "+961" },
    { name: "Turkey", iso2: "TR", dial_code: "+90" },
    { name: "India", iso2: "IN", dial_code: "+91" },
    { name: "Pakistan", iso2: "PK", dial_code: "+92" },
    { name: "Bangladesh", iso2: "BD", dial_code: "+880" },
    { name: "Philippines", iso2: "PH", dial_code: "+63" },
    { name: "Indonesia", iso2: "ID", dial_code: "+62" },
    { name: "United States", iso2: "US", dial_code: "+1" },
    { name: "United Kingdom", iso2: "GB", dial_code: "+44" },
    { name: "Germany", iso2: "DE", dial_code: "+49" },
    { name: "France", iso2: "FR", dial_code: "+33" },
    { name: "China", iso2: "CN", dial_code: "+86" },
  ];
  const countryOptions = countries.map((c) => ({
    value: c.dial_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={c.iso2}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
        />
        {c.dial_code}
      </div>
    ),
  }));
  const [selectedCode, setSelectedCode] = useState("+966");

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

          <div className="cardType">
            <h3>نوع البطاقه</h3>
            <p>{cardType}</p>
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
                placeholder="احمد محمد"
              />
            </label>
            <label>
              <span>رقم الهاتف</span>
              <div
                className="phoneNumber"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Select
                  options={countryOptions}
                  defaultValue={countryOptions.find(
                    (opt) => opt.value === "+966"
                  )}
                  onChange={(selected) => setSelectedCode(selected.value)}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minWidth: "100px",
                      marginRight: "8px",
                    }),
                  }}
                />

                {/* حقل إدخال رقم الهاتف */}
                <input
                  type="text"
                  value={phone}
                  placeholder="5X XXX XXXX"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </label>
            <label>
              <span>الايميل</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
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
