import FoundationClient from "./FoundationClient";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <FoundationClient />
    </Suspense>
  );
};

export default page;
