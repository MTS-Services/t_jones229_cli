"use client";

import MultiStepFormContent from "@/components/dashboard/captain/CheckYourTrip/MultiStepFormContent";
import { FormProvider } from "@/components/List-boat-form/FormProvider";
import MinimalSidebar from "@/components/common/MinimalSidebar";

const Page: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <MinimalSidebar />
      <div className="flex-1 overflow-hidden">
        <FormProvider>
          <MultiStepFormContent />
        </FormProvider>
      </div>
    </div>
  );
};

export default Page;
