"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResolveTamaraActivation from "@/API/Payment/ResolveTamaraActivation";
import "./payment-status.css";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("جاري تجهيز التفعيل...");

  useEffect(() => {
    const status = searchParams.get("paymentStatus");
    const orderId = searchParams.get("orderId");

    if (orderId) {
      localStorage.setItem("tamaraOrderId", orderId);
    }

    if (status && status.toLowerCase() !== "approved") {
      router.replace("/payment-failed");
      return;
    }

    const proceed = async () => {
      const result = await ResolveTamaraActivation();
      if (!result.ok) {
        setMessage("تعذر تجهيز بيانات التفعيل، سيتم تحويلك للبطاقات.");
      } else {
        setMessage("تم الدفع بنجاح، سيتم تحويلك لصفحة تفعيل البطاقة.");
      }

      window.setTimeout(() => {
        router.replace(result.next);
      }, 2200);
    };

    proceed();
  }, [router, searchParams]);

  return (
    <div className="payment_status_page">
      <div className="payment_status_card success">
        <div className="payment_status_icon">✓</div>
        <h2>تمت عملية الدفع بنجاح</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => (
  <Suspense
    fallback={
      <div className="payment_status_page">
        <div className="payment_status_card success">
          <div className="payment_status_icon">✓</div>
          <h2>جاري التحقق من حالة الدفع</h2>
          <p>يرجى الانتظار...</p>
        </div>
      </div>
    }
  >
    <PaymentSuccessContent />
  </Suspense>
);

export default PaymentSuccessPage;
