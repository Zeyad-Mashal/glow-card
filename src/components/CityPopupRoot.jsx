"use client";

import dynamic from "next/dynamic";

const CityPopup = dynamic(() => import("@/components/CityPopup"), {
  ssr: false,
  loading: () => null,
});

/** يحمّل مودال المدينة على العميل فقط؛ layout يبقى Server Component */
export default function CityPopupRoot() {
  return <CityPopup />;
}
