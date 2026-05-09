"use client";

import { FormProvider } from "@/components/List-boat-form/FormProvider";
import MultiStepFormContent from "./MultiStepFormContent";

export default function CheckYourTrip() {
  return (
    <FormProvider>
      <MultiStepFormContent />
    </FormProvider>
  );
}
