// components/FatorahClient.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Fatorah.css";
import ApplayCoupon from "@/API/Coupon/ApplayCoupon";
import Payment from "@/API/Payment/Payment";
import TamaraPayment from "@/API/Payment/TamaraPayment";
import normalizeMembershipType from "@/utils/normalizeMembershipType";
import { useSearchParams, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";

const FatorahClient = () => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApi, setCouponApi] = useState("");
  const [discount, setDiscount] = useState();
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const isCouponValid = couponApi.trim().length > 0;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsRef = useRef(null);

  const [basePrice, setBasePrice] = useState(0);
  const [price, setPrice] = useState();
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState();
  const [cardType, setCardType] = useState();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("ar");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLang(lang);
  }, []);

  useEffect(() => {
    const price = localStorage.getItem("price");
    const numericPrice = Number(price) || 0;
    const token = localStorage.getItem("token");
    const cardType = localStorage.getItem("type");
    setToken(token);
    setBasePrice(numericPrice);
    setPrice(numericPrice);
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
    setError("");
    setCouponApplied(false);
    const data = {
      coupon: couponApi,
    };
    ApplayCoupon(
      setloading,
      setError,
      data,
      (value) => {
        setDiscount(value);
        setCouponApplied(true);
      },
      setPrice,
    );
  };

  useEffect(() => {
    if (!couponApi.trim()) {
      setCouponApplied(false);
      setDiscount(undefined);
      setPrice(basePrice);
      setError("");
    }
  }, [couponApi, basePrice]);

  const buildPaymentPayload = () => ({
    email,
    name: userName,
    phone,
    productId: id,
    coupon: couponApi || undefined,
    totalPrice: price,
  });

  const ensurePaymentMeta = () => {
    if (id) {
      try {
        localStorage.setItem("pendingActivationProductId", id);
        const pendingType = normalizeMembershipType(
          cardType || localStorage.getItem("type"),
        );
        if (pendingType) {
          localStorage.setItem("pendingActivationType", pendingType);
          localStorage.setItem("type", pendingType);
        }
      } catch {
        /* ignore */
      }
    }
  };

  const validateBeforePayment = () => {
    if (userName === "" || email === "" || phone === "") {
      alert("يجب ملئ جميع البيانات اولا");
      return false;
    }
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.href);
      router.push("/login");
      return false;
    }
    return true;
  };

  const paymentGetway = () => {
    if (!validateBeforePayment()) return;
    const data = buildPaymentPayload();
    ensurePaymentMeta();
    Payment(setloading, setError, data);
  };

  const tamaraPaymentGateway = () => {
    if (!validateBeforePayment()) return;
    const data = buildPaymentPayload();
    ensurePaymentMeta();
    TamaraPayment(setloading, setError, data);
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
        <div
          className="fatorah_page_header"
          dir={selectedLang === "ar" ? "rtl" : "ltr"}
        >
          <h1 className="fatorah_page_title">
            {selectedLang === "ar" ? "تفاصيل الطلب" : "Order Confirmation"}
          </h1>
          <img
            className="fatorah_header_logo"
            src="/images/logo.png"
            alt=""
            width={56}
            height={56}
          />
        </div>
        <div
          ref={detailsRef}
          className={`fatorah_details ${detailsOpen ? "open" : ""}`}
        >
          <div className="detail1">
            <p>{selectedLang === "ar" ? "ملخص السلة" : "Cart Summary"}</p>
            <span>
              {basePrice} {selectedLang === "ar" ? "ر.س" : "SAR"}
            </span>
          </div>
          {couponApplied && (
            <>
              <div className="detail1 detail_discount">
                <p>
                  {selectedLang === "ar"
                    ? "تم تفعيل الكوبون"
                    : "Coupon Applied"}
                </p>
                <span>{selectedLang === "ar" ? "تم بنجاح" : "Success"}</span>
              </div>
              <div className="detail1 detail_discount">
                <p>{selectedLang === "ar" ? "نسبة الخصم" : "Discount Rate"}</p>
                <span>%{discount}</span>
              </div>
              <div className="detail1 detail_discount">
                <p>
                  {selectedLang === "ar"
                    ? "السعر بعد الخصم"
                    : "Price After Discount"}
                </p>
                <span>
                  {price} {selectedLang === "ar" ? "ر.س" : "SAR"}
                </span>
              </div>
            </>
          )}
          <div className="detail1">
            <p>{selectedLang === "ar" ? "ضريبة القيمة المضافة" : "VAT"}</p>
            <span>15 {selectedLang === "ar" ? "ر.س" : "SAR"}</span>
          </div>
        </div>

        <div className="fatorah_content">
          <div className="total">
            <h3>{selectedLang === "ar" ? "الإجمالي" : "Total"}</h3>
            <span>
              {price} {selectedLang === "ar" ? "ر.س" : "SAR"}
            </span>
          </div>

          <div className="coupon_section">
            <button
              className="coupon_button"
              onClick={() => setShowCouponInput(!showCouponInput)}
            >
              {showCouponInput
                ? selectedLang === "ar"
                  ? "إلغاء"
                  : "Cancel"
                : selectedLang === "ar"
                  ? "لديك كوبون تخفيض؟"
                  : "Have a coupon?"}
            </button>

            {showCouponInput && (
              <div className="coupon_input_container">
                <input
                  type="text"
                  placeholder={
                    selectedLang === "ar"
                      ? "ادخل كود الكوبون"
                      : "Enter Coupon Code"
                  }
                  value={couponApi}
                  onChange={(e) => setCouponApi(e.target.value)}
                  className="coupon_input"
                />

                <button
                  className="apply_button"
                  onClick={handleApplyCoupon}
                  disabled={!isCouponValid || loading}
                >
                  {loading
                    ? selectedLang === "ar"
                      ? "جاري التطبيق..."
                      : "Applying..."
                    : selectedLang === "ar"
                      ? "تطبيق"
                      : "Apply"}
                </button>
                {error && <p className="error">{error}</p>}
                {couponApplied && (
                  <p className="coupon_success">
                    {selectedLang === "ar"
                      ? `تم تفعيل الكوبون بنجاح - خصم ${discount}%`
                      : `Coupon applied successfully - ${discount}% off`}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="cardType">
            <h3>{selectedLang === "ar" ? "نوع العضوية" : "Membership Type"}</h3>
            <p>{cardType}</p>
          </div>

          <button
            className="toggle_details_btn"
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen
              ? selectedLang === "ar"
                ? "إخفاء التفاصيل ▲"
                : "Hide Details ▲"
              : selectedLang === "ar"
                ? "عرض التفاصيل ▼"
                : "Show Details ▼"}
          </button>

          <div className="payment_data">
            <label>
              <span>{selectedLang === "ar" ? "الاسم" : "Name"}</span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={
                  selectedCode === "ar" ? "ادخل الاسم كامل" : "Enter Full Name"
                }
              />
            </label>
            <label>
              <span>
                {selectedLang === "ar" ? "رقم الهاتف" : "Phone Number"}
              </span>
              <div
                className="phoneNumber"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Select
                  options={countryOptions}
                  defaultValue={countryOptions.find(
                    (opt) => opt.value === "+966",
                  )}
                  onChange={(selected) => setSelectedCode(selected.value)}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minWidth: "127px",
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
              <span>{selectedLang === "ar" ? "الايميل" : "Email"}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </label>
          </div>

          <div className="payment_btn">
            <button onClick={paymentGetway} disabled={loading}>
              {selectedLang === "ar" ? "ادفع الان" : "Pay Now"}
            </button>
            <button
              className="tamara_btn"
              onClick={tamaraPaymentGateway}
              disabled={loading}
            >
              <img
                src={
                  selectedLang === "ar"
                    ? "/images/tamara-ar.svg"
                    : "/images/tamara-en.svg"
                }
                alt="Tamara"
              />
              <span>
                {selectedLang === "ar"
                  ? "ادفع وقسطها مع تمارا"
                  : "Pay in installments with Tamara"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatorahClient;
