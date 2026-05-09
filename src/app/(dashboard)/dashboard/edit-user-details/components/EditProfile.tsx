"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Skeleton } from "antd";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";
import { toast, ToastContainer } from "react-toastify";
import { useGetMeQuery } from "@/redux/api/authApi";
import PersonalSection from "./PersonalSection";
import PaymentSection from "./PaymentSection";

const personalFields = ["firstName", "lastName", "email", "phone"];
const paymentFields = [
  "paymentMethod",
  "cardNumber",
  "expireDate",
  "securityCode",
  "nameOfCard",
  "bollingCountry",
  "zipCode",
];

export default function EditProfile() {
  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, reset, watch, setValue } = methods;

  const { data: userInfo, isLoading: isUserLoading } = useGetMeQuery({});
  const [updateProfileFN, { isLoading: isUpdating }] =
    useUpdateProfileMutation();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // When userInfo arrives, set defaults
  useEffect(() => {
    if (userInfo?.data) {
      const defaultValues = {
        firstName: userInfo?.data?.firstName || "",
        lastName: userInfo?.data?.lastName || "",
        email: userInfo?.data?.email || "",
        phone: userInfo?.data?.phoneNumber || "",
        paymentMethod: userInfo?.data?.paymentMethod?.type || "credit-card",
        cardNumber: userInfo?.data?.paymentMethod?.cardNumber || "",
        expireDate: userInfo?.data?.paymentMethod?.expireDate || "",
        securityCode: userInfo?.data?.paymentMethod?.securityCode || "",
        nameOfCard: userInfo?.data?.paymentMethod?.nameOfCard || "",
        bollingCountry: userInfo?.data?.paymentMethod?.bollingCountry || "",
        zipCode: userInfo?.data?.paymentMethod?.zipCode || "",
      };
      reset(defaultValues);
      setInitialValues(defaultValues);
    }
  }, [userInfo, reset]);

  const hasPersonalChanges = () => {
    if (!initialValues) return false;
    return personalFields.some((f) => watch(f) !== initialValues[f]);
  };

  const hasPaymentChanges = () => {
    if (!initialValues) return false;
    return paymentFields.some((f) => watch(f) !== initialValues[f]);
  };

  const onSavePersonal = async (data: any) => {
    if (!initialValues) return;
    const changedFields = personalFields.reduce((acc: any, field) => {
      if (data[field] !== initialValues[field]) {
        acc[field === "phone" ? "phoneNumber" : field] = data[field];
      }
      return acc;
    }, {});
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes detected in Personal Details");
      return;
    }
    try {
      const res = await updateProfileFN({ user: changedFields }).unwrap();
      if (res?.success) {
        toast.success("Personal details updated successfully!");
        setInitialValues((prev: any) => ({
          ...prev,
          ...personalFields.reduce((acc: Record<string, any>, f) => {
            acc[f] = data[f];
            return acc;
          }, {}),
        }));
        setEditingSection(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update personal details");
    }
  };

  const onSavePayment = async (data: any) => {
    if (!initialValues) return;
    const changedFields = paymentFields.reduce((acc: any, field) => {
      if (data[field] !== initialValues[field]) acc[field] = data[field];
      return acc;
    }, {});
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes detected in Payment Details");
      return;
    }
    try {
      const res = await updateProfileFN({
        paymentMethod: changedFields,
      }).unwrap();
      if (res?.success) {
        toast.success("Payment details updated successfully!");
        setInitialValues((prev: any) => ({
          ...prev,
          ...paymentFields.reduce((acc: Record<string, any>, f) => {
            acc[f] = data[f];
            return acc;
          }, {}),
        }));
        setEditingSection(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment details");
    }
  };

  const handleCancel = (section: string) => {
    const fields = section === "personal" ? personalFields : paymentFields;
    fields.forEach((f) => setValue(f, initialValues[f]));
    setEditingSection(null);
  };

  if (isUserLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <div className="space-y-6">
          <PersonalSection
            isEditing={editingSection === "personal"}
            hasChanges={hasPersonalChanges()}
            isUpdating={isUpdating}
            onEdit={() => setEditingSection("personal")}
            onSave={handleSubmit(onSavePersonal)}
            onCancel={() => handleCancel("personal")}
          />
          <PaymentSection
            isEditing={editingSection === "payment"}
            hasChanges={hasPaymentChanges()}
            isUpdating={isUpdating}
            onEdit={() => setEditingSection("payment")}
            onSave={handleSubmit(onSavePayment)}
            onCancel={() => handleCancel("payment")}
          />
        </div>
      </FormProvider>
    </div>
  );
}
