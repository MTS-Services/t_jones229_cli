"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Fishing from "./Fishing";

export default function CreateTrip() {
  const methods = useForm({
    defaultValues: {
      fishingSpecies: [],
      fishingLocation: [],
      fishingTechnique: [],
      policies: [],
      includedPrice: [],
    },
  });

  const onSubmit = (data: any) => {
    console.log("FORM DATA 👉", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Fishing />

        <button
          type="submit"
          className="m-10 px-6 py-2 bg-black text-white rounded"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
