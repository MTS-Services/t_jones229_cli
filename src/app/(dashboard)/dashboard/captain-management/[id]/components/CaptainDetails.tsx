"use client";

import React, { useState } from "react";
import BoatDetailsModal from "./BoatDetailsModal";
import {
  CaptainHeader,
  PersonalInfoCard,
  AccountStatusCard,
  PaymentInfoCard,
  BoatsTableCard,
} from ".";
import type { Boat, CaptainDetailsProps } from ".";

// Main component
export default function CaptainDetails({ userData }: CaptainDetailsProps) {
  const { user, boat } = userData;
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewBoat = (boatToView: Boat) => {
    setSelectedBoat(boatToView);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBoat(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <CaptainHeader user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoCard user={user} />
          <AccountStatusCard user={user} boatCount={boat?.length || 0} />
        </div>

        <PaymentInfoCard user={user} />
        <BoatsTableCard boats={boat} onViewBoat={handleViewBoat} />
      </div>

      {showModal && selectedBoat && (
        <BoatDetailsModal boat={selectedBoat} onClose={handleCloseModal} />
      )}
    </div>
  );
}
