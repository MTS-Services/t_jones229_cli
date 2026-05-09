"use client";

import React from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { Skeleton } from "antd";
import {
  SettingsHeader,
  AccountSettings,
  SecuritySettings,
  NotificationSettings,
  PrivacySettings,
  DangerZone,
} from "./components";

export default function SettingsPage() {
  const { data: userResponse, isLoading, error } = useGetMeQuery({});

  if (isLoading) {
    return (
      <div className="">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  if (error || !userResponse?.data) {
    return (
      <div className="">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load settings</p>
        </div>
      </div>
    );
  }

  const user = userResponse.data;

  return (
    <div className=" space-y-6">
      {/* Settings Header */}
      <SettingsHeader />

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountSettings user={user} />
        <DangerZone />
      </div>
    </div>
  );
}
