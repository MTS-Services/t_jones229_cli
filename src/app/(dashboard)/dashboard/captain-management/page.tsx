"use client";

import React from "react";
import TitleSection from "@/components/dashboard/captain/TiltleSection";
import CaptainManagementComponent from "@/components/dashboard/admin/userManagment/CaptainManagement";
import { useAllUserQuery } from "@/redux/api/authApi";

export default function Page() {
  const { data: captainData, isLoading: loadingCaptain } = useAllUserQuery({
    roles: ["CAPTAIN"],
  });

  return (
    <div>
      <TitleSection />
      <CaptainManagementComponent
        data={captainData?.data?.data || []}
        isLoading={loadingCaptain}
      />
    </div>
  );
}
