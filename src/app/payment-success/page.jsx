"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResolveTamaraActivation from "@/API/Payment/ResolveTamaraActivation";
import normalizeMembershipType from "@/utils/normalizeMembershipType";
import { markTamaraPaymentContext } from "@/utils/paymentProviderContext";
import "./payment-status.css";

function firstParam(searchParams, keys) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value != null && String(value).trim() !== "") return value;
  }
  return null;
}

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("جاري تجهيز التفعيل...");

  useEffect(() => {
    const status = firstParam(searchParams, [
      "paymentStatus",
      "payment_status",
      "status",
    ]);
    const orderId = firstParam(searchParams, [
      "orderId",
      "order_id",
      "orderID",
      "paymentOrderId",
      "payment_order_id",
    ]);
    const checkoutId = firstParam(searchParams, [
      "checkoutId",
      "checkout_id",
      "checkoutID",
    ]);

    if (orderId || checkoutId) {
      markTamaraPaymentContext();
    }
    if (orderId) {
      try {
        localStorage.setItem("tamaraOrderId", orderId);
      } catch {
        /* ignore */
      }
    }
    if (checkoutId) {
      try {
        localStorage.setItem("tamaraCheckoutId", checkoutId);
      } catch {
        /* ignore */
      }
    }

    if (status && status.toLowerCase() !== "approved") {
      router.replace("/payment-failed");
      return;
    }

    const proceed = async () => {
      const pendingRaw = localStorage.getItem("pendingActivationType");
      const pendingNorm = normalizeMembershipType(pendingRaw);
      if (pendingNorm && pendingNorm !== pendingRaw) {
        try {
          localStorage.setItem("pendingActivationType", pendingNorm);
          localStorage.setItem("type", pendingNorm);
        } catch {
          /* ignore */
        }
      }
      console.log("[Tamara][payment-success] Incoming params", {
        paymentStatus: status,
        orderId,
        checkoutId,
        pendingActivationProductId: localStorage.getItem(
          "pendingActivationProductId",
        ),
        pendingActivationType: localStorage.getItem("pendingActivationType"),
      });

      const result = await ResolveTamaraActivation();
      console.log("[Tamara][payment-success] Resolve result", result);
      if (!result.ok) {
        setMessage("تعذر تجهيز بيانات التفعيل تلقائيًا، سيتم تحويلك للبطاقات.");
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
