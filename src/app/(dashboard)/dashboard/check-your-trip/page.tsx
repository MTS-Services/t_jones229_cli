// MultiStepFormStep.tsx

"use client";

import MultiStepFormContent from "@/components/dashboard/captain/CheckYourTrip/MultiStepFormContent";
import { FormProvider } from "@/components/List-boat-form/FormProvider";
// import { Suspense } from "react";

const Page: React.FC = () => {
  return (
    <FormProvider>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <MultiStepFormContent />
      {/* </Suspense> */}
    </FormProvider>
  );
};

// Change "page" to "Page" to match the definition above
export default Page;
