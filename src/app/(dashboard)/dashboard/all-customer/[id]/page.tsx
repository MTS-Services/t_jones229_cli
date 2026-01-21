import React from "react";
import CustomerDetails from "@/components/dashboard/admin/userManagment/CutomerDetails";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function page() {
  return (
    <div>
      <TitleSection />

      <CustomerDetails />
    </div>
  );
}
