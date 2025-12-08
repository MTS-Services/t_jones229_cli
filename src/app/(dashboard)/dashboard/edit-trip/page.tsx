import EditTrip from "@/components/dashboard/captain/BootTips/EditTrips";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditTrip />
    </Suspense>
  );
}
