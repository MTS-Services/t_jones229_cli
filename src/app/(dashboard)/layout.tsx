// "use client";
// import React from "react";
// import Sidebar from "@/components/dashboard/shared/Sidebar";
// import { ToastContainer } from "react-toastify";

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <ToastContainer />
//       <Sidebar />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col lg:ml-0">
//         {/* Main Content */}
//         <main className="flex-1 overflow-auto">
//           <div className="">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

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

      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}

      {/* Mobile sidebar */}
      {/* <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar mobile onClose={() => setSidebarOpen(false)} />
      </div> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navigation */}
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
