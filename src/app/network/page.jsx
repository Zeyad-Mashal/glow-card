import { Suspense } from "react";
import NetworkClient from "./NetworkClient";

export default function NetworkPageWrapper() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <NetworkClient />
    </Suspense>
  );
}
