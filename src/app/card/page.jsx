import React, { Suspense } from "react";
import CardDetailsClient from "./CardDetailsClient";

export const dynamic = "force-dynamic"; // 👈 ده برضو يمنع الـ prerender error

export default function CardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardDetailsClient />
    </Suspense>
  );
}
