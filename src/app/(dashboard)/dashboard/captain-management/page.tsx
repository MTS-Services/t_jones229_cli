"use client";

import React from "react";
import CaptainManagementComponent from "./components/CaptainManagement";
import { useAllUserQuery } from "@/redux/api/authApi";

export default function Page() {
  const { data: captainData, isLoading: loadingCaptain } = useAllUserQuery({
    roles: ["CAPTAIN"],
  });

  return (
    <CaptainManagementComponent
      data={captainData?.data?.data || []}
      isLoading={loadingCaptain}
    />
  );
}
