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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Captain Management</h1>
        <p className="text-gray-600">Manage and moderate user accounts.</p>
      </div>
      <CaptainManagementComponent
        data={captainData?.data?.data || []}
        isLoading={loadingCaptain}
      />
    </div>
  );
}
