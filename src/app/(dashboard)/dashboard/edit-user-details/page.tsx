"use client";

import EditProfile from "@/app/(dashboard)/dashboard/edit-user-details/components/EditProfile";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

export default function page() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      "pk_live_51S7FGMFMScDbRANiZVe5OTvZn5WiO4k4zc1B38SIjGRDobCpmIwGrN18nmNaT4CMGQZfPIIN6mGi6rbju9usFnw5003r19idFS",
  );

  return (
    <Elements stripe={stripePromise}>
      <EditProfile />
    </Elements>
  );
}
