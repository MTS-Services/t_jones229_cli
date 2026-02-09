"use client";

import TitleSection from "@/components/dashboard/captain/TiltleSection";
import EditProfile from "@/components/dashboard/userDashboard/EditProfile";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

export default function page() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      "pk_test_51R61J0CZ2kLTrYVYE9WQTKQfW3pfUXk24wvYy2ZnBiylVvfjMdCXhTPuDnFIzJhbAOG45ZC0EN45mqH5Kqsr4HPw005XK2Dm4F",
  );
  // const stripePromise = loadStripe(
  //   "pk_test_51S7FGWFSOdhjuWuwt3kJdy5Z1mbFuygwNcHF9RwdEWtGOaD8ttn7rCxgvgXF8sgGRKmaRRZodTExO7K0mei0rSMt00QCt0obAN"
  // );
  return (
    <div>
      <TitleSection />
      <Elements stripe={stripePromise}>
        <EditProfile />
      </Elements>
    </div>
  );
}
