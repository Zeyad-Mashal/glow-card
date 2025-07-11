"use client";
import React, { useEffect, useState } from "react";
import "./payment_callBack.css";
import PaymentCallback from "@/API/PaymentCallback/PaymentCallback";

const Page = () => {
  const [model, setModel] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    PaymentCallback(setloading, setModel, setLoadingModel, setModelError);
  }, []);

  return (
    <div className="payment_callBack">
      <div className="payment_callBack_container">
        {loadingModel && (
          <div className="status loading">
            <div className="spinner"></div>
            <h2>جاري معالجة عملية الدفع...</h2>
          </div>
        )}

        {model && (
          <div className="status success">
            <div className="icon success-icon">&#10004;</div>
            <h2>تمت عملية الدفع بنجاح</h2>
            <p>سيتم تحويلك الي Glow Card خلال 5 ثوان</p>
          </div>
        )}

        {modelError && (
          <div className="status error">
            <div className="icon error-icon">&#10006;</div>
            <h2>فشل في عملية الدفع</h2>
            <p>يرجى استخدام بطاقة مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
