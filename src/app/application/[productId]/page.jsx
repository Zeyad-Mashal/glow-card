import React, { Suspense } from "react";
import Application from "./ApplicationClient"; // غيّر حسب مكان ملفك

export const dynamic = "force-dynamic";

const ApplicationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application />
    </Suspense>
  );
};

export default ApplicationPage;
