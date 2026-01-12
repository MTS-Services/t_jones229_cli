"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Trips from "./Trips";

// Define the form values type locally because `Trips.tsx` doesn't export it.
type TripsFormValues = { trips: any[] };

const TripsWrapper: React.FC = () => {
  const methods = useForm<TripsFormValues>({
    defaultValues: { trips: [] }, // start empty
  });

  const onSubmit = (data: TripsFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Trips />
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TripsWrapper;
