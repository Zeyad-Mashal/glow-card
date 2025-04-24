import { Suspense } from "react";
import OtpClient from "./OtpClient";

export default function OtpPageWrapper() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <OtpClient />
    </Suspense>
  );
}
