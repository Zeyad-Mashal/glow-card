import React, { Suspense } from "react";
import GiftClient from "./GiftClient";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GiftClient />;
    </Suspense>
  );
}
