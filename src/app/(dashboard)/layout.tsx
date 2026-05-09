"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/shared/Sidebar";
import TopNavbar from "@/components/dashboard/shared/TopNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer />

      {/* Sidebar — handles desktop layout + mobile overlay internally */}
      <Sidebar
        externalOpen={sidebarOpen}
        onExternalClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navigation */}
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-12 min-w-0">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
