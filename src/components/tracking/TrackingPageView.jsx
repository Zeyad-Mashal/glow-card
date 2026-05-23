"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getCheckoutContextFromStorage,
  trackInitiateCheckout,
  trackPageView,
  trackPurchase,
} from "./events";

export default function TrackingPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackPageView(pagePath);

    if (pathname === "/fatorah") {
      trackInitiateCheckout(getCheckoutContextFromStorage(searchParams));
      return;
    }

    if (pathname === "/payment-success" || pathname === "/payment-callback") {
      const ctx = getCheckoutContextFromStorage(searchParams);
      const orderId =
        searchParams?.get("orderId") ||
        searchParams?.get("order_id") ||
        (typeof window !== "undefined"
          ? localStorage.getItem("invoiceId") ||
            localStorage.getItem("tamaraOrderId")
          : null);

      trackPurchase({ ...ctx, orderId });
    }
  }, [pathname, searchParams]);

  return null;
}
