"use client";

import React from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { Skeleton } from "antd";
import {
  PersonalInformation,
  AccountDetails,
  QuickActions,
} from "./components";
import { getProfileStats } from "./utils/helpers";
import { Ship, User } from "lucide-react";

export default function ProfilePage() {
  const { data: userResponse, isLoading, error } = useGetMeQuery({});

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  if (error || !userResponse?.data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const user = userResponse.data;
  const stats = getProfileStats(user);

  return (
    <div className=" space-y-6">
      {/* Profile Header */}
      {/* <ProfileHeader user={user} /> */}
      <div className="p-6 md:p-8 rounded-2xl border bg-white border-gray-200 shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h1 className="text-2xl md:text-3xl text-gray-600 font-bold">
            My Profiles
          </h1>
        </div>
        <p className="text-gray-600">
          View and manage your personal information, account details, and quick
          stats
        </p>
      </div>
      {/* Quick Stats */}
      {/* <QuickStats stats={stats} /> */}

      {/* Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInformation user={user} />
        <AccountDetails user={user} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
