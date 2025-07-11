// app/fatorah/page.jsx
import React, { Suspense } from "react";
import FatorahClient from "./FatorahClient";
export const dynamic = "force-dynamic";
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FatorahClient />;
    </Suspense>
  );
};

export default Page;
