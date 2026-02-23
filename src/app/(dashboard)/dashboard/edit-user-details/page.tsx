"use client";

import TitleSection from "@/components/dashboard/captain/TiltleSection";
import EditProfile from "@/components/dashboard/userDashboard/EditProfile";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

export default function page() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      "pk_live_51S7FGMFMScDbRANiZVe5OTvZn5WiO4k4zc1B38SIjGRDobCpmIwGrN18nmNaT4CMGQZfPIIN6mGi6rbju9usFnw5003r19idFS",
  );

  return (
    <div>
      {/* <TitleSection /> */}
      <Elements stripe={stripePromise}>
        <EditProfile />
      </Elements>
    </div>
  );
}
