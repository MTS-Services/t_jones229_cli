"use client";

import MultiStepFormContent from "@/components/dashboard/captain/CheckYourTrip/MultiStepFormContent";
import { FormProvider } from "@/components/List-boat-form/FormProvider";

const Page: React.FC = () => {
  return (
    <FormProvider>
      <MultiStepFormContent />
    </FormProvider>
  );
};

export default Page;
