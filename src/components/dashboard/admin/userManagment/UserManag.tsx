"use client";
// src/pages/UserManag.tsx
import React from "react";
import CustomerManagement from "./CustomarManagment";
import CaptainManagement from "./CaptainManagement";
import TitleSection from "../../captain/TiltleSection";
import { useAllUserQuery } from "@/redux/api/authApi";

export default function UserManag() {
  // Fetch both roles separately
  const { data: customerData, isLoading: loadingUser } = useAllUserQuery({
    roles: ["USER"],
  });

  const { data: captainData, isLoading: loadingCaptain } = useAllUserQuery({
    roles: ["CAPTAIN"],
  });


  return (
    <div>
      <TitleSection />
      <CustomerManagement
        data={customerData?.data?.data || []}
        isLoading={loadingUser}
      />
      <CaptainManagement
        data={captainData?.data?.data || []}
        isLoading={loadingCaptain}
      />
    </div>
  );
}
