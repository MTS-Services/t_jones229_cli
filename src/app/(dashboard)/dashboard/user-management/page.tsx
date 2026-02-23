import UserManag from "@/components/dashboard/admin/userManagment/UserManag";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage and moderate customer accounts.</p>
      </div>
      <UserManag />
    </div>
  );
}
