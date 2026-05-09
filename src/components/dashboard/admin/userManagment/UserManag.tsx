"use client";

// src/pages/UserManag.tsx
import React from "react";
import CustomerManagement from "./CustomarManagment";
import { useAllUserQuery } from "@/redux/api/authApi";

export default function UserManag() {
  // Fetch both roles separately
  const { data: customerData, isLoading: loadingUser } = useAllUserQuery({
    roles: ["USER"],
  });

  return (
    <CustomerManagement
      data={customerData?.data?.data || []}
      isLoading={loadingUser}
    />
  );
}
