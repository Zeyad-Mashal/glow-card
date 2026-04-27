"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../payment-success/payment-status.css";

const PaymentFailedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/our_cards");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="payment_status_page">
      <div className="payment_status_card failed">
        <div className="payment_status_icon">✕</div>
        <h2>فشلت عملية الدفع</h2>
        <p>سيتم تحويلك إلى صفحة البطاقات خلال ثوانٍ.</p>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
