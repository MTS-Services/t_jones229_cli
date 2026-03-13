"use client";

import React from "react";
import { PaymentField } from "./InputField";
import SectionWrapper from "./SectionWrapper";
import {
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiLock,
  FiMapPin,
} from "react-icons/fi";

interface PaymentSectionProps {
  isEditing: boolean;
  hasChanges: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PaymentSection({
  isEditing,
  hasChanges,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: PaymentSectionProps) {
  return (
    <SectionWrapper
      title="Payment Details"
      description="Manage your payment methods"
      icon={FiCreditCard}
      hasChanges={hasChanges}
      isEditing={isEditing}
      isUpdating={isUpdating}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PaymentField
          label="Payment Method"
          name="paymentMethod"
          icon={FiCreditCard}
          type="select"
          options={[
            { value: "credit-card", label: "Credit Card" },
            { value: "debit-card", label: "Debit Card" },
            { value: "other", label: "Other" },
          ]}
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Card Number"
          name="cardNumber"
          icon={FiCreditCard}
          placeholder="**** **** **** ****"
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Expire Date"
          name="expireDate"
          icon={FiCalendar}
          placeholder="MM/YY"
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Security Code"
          name="securityCode"
          icon={FiLock}
          placeholder="***"
          type="password"
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Name on Card"
          name="nameOfCard"
          icon={FiUser}
          placeholder="John Doe"
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Billing Country"
          name="bollingCountry"
          icon={FiMapPin}
          placeholder="Country"
          required
          disabled={!isEditing}
        />
        <PaymentField
          label="Zip Code"
          name="zipCode"
          icon={FiMapPin}
          placeholder="Zip Code"
          required
          disabled={!isEditing}
        />

        <div className="mt-7 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-600 flex items-center gap-2">
            <FiCreditCard className="size-4" />
            Make sure your card details match your billing address
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
