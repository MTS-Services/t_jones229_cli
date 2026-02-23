import CaptainMembership from "@/components/dashboard/captain/CaptainPaymetn";
import TitleSection from "@/components/dashboard/captain/TiltleSection";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Membership</h1>
        <p className="text-gray-600">Manage membership details.</p>
      </div>
      <CaptainMembership />
    </div>
  );
}
