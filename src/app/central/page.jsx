import React, { Suspense } from "react";
import CentralClient from "./CentralClient";

export const dynamic = "force-dynamic"; // 👈 ده يمنع الـ prerender error

export default function CentralPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CentralClient />
    </Suspense>
  );
}
