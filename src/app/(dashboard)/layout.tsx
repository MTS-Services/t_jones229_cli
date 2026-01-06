"use client";
import Sidebar from "@/components/dashboard/shared/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
}
