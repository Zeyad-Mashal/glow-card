"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function trackPageView() {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "PAGE_VIEW");
  }
  if (window.ttq && typeof window.ttq.page === "function") {
    window.ttq.page();
  }
}

export default function TrackingPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}
