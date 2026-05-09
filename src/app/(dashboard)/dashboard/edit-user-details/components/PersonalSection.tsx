"use client";

import React from "react";
import { InputField } from "./InputField";
import SectionWrapper from "./SectionWrapper";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";

interface PersonalSectionProps {
  isEditing: boolean;
  hasChanges: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PersonalSection({
  isEditing,
  hasChanges,
  isUpdating,
  onEdit,
  onSave,
  onCancel,
}: PersonalSectionProps) {
  return (
    <SectionWrapper
      title="Personal Details"
      description="Update your personal information"
      icon={FiUser}
      hasChanges={hasChanges}
      isEditing={isEditing}
      isUpdating={isUpdating}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <InputField
          label="First Name"
          name="firstName"
          icon={HiOutlineIdentification}
          placeholder="Enter your first name"
          disabled={!isEditing}
        />
        <InputField
          label="Last Name"
          name="lastName"
          icon={HiOutlineIdentification}
          placeholder="Enter your last name"
          disabled={!isEditing}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          icon={FiMail}
          placeholder="your@email.com"
          disabled={!isEditing}
        />
        <InputField
          label="Mobile Number"
          name="phone"
          type="tel"
          icon={FiPhone}
          placeholder="+1 (555) 000-0000"
          disabled={!isEditing}
        />
      </div>
    </SectionWrapper>
  );
}
