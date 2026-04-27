"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../payment-success/payment-status.css";

const PaymentCancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    const pendingProductId = localStorage.getItem("pendingActivationProductId");
    const next = pendingProductId
      ? `/fatorah?id=${encodeURIComponent(pendingProductId)}`
      : "/fatorah";

    const timer = window.setTimeout(() => {
      router.replace(next);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="payment_status_page">
      <div className="payment_status_card canceled">
        <div className="payment_status_icon">↺</div>
        <h2>تم إلغاء عملية الدفع</h2>
        <p>سيتم إعادتك إلى صفحة الفاتورة.</p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
