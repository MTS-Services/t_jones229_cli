"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Divider, Skeleton } from "antd";
import {
  MdKeyboardArrowRight,
  MdSave,
  MdWarning,
  MdCheckCircle,
  MdEdit,
} from "react-icons/md";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";
import { toast, ToastContainer } from "react-toastify";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCalendar,
  FiLock,
  FiMapPin,
} from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";

export default function EditProfile() {
  const methods = useForm({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = methods;

  const { data: userInfo, isLoading: isUserLoading } = useGetMeQuery({});
  const [updateProfileFN, { isLoading: isUpdating }] =
    useUpdateProfileMutation();
  const [initialValues, setInitialValues] = useState<any>(null);

  // Track which section is being edited
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Personal Details fields
  const personalFields = ["firstName", "lastName", "email", "phone"];

  // Payment Details fields
  const paymentFields = [
    "paymentMethod",
    "cardNumber",
    "expireDate",
    "securityCode",
    "nameOfCard",
    "bollingCountry",
    "zipCode",
  ];

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

  // Check if personal section has changes
  const hasPersonalChanges = () => {
    if (!initialValues) return false;
    return personalFields.some(
      (field) => watch(field) !== initialValues[field],
    );
  };

  // Check if payment section has changes
  const hasPaymentChanges = () => {
    if (!initialValues) return false;
    return paymentFields.some((field) => watch(field) !== initialValues[field]);
  };

  // Save Personal Details
  const onSavePersonal = async (data: any) => {
    if (!initialValues) return;

    // Get only changed personal fields
    const changedFields = personalFields.reduce((acc: any, field) => {
      if (data[field] !== initialValues[field]) {
        if (field === "phone") {
          acc.phoneNumber = data[field];
        } else {
          acc[field] = data[field];
        }
      }
      return acc;
    }, {});

    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes detected in Personal Details");
      return;
    }

    try {
      const res = await updateProfileFN({
        user: changedFields,
      }).unwrap();

      if (res?.success) {
        toast.success("Personal details updated successfully!");
        // Update initial values for personal fields
        setInitialValues((prev: any) => ({
          ...prev,
          ...personalFields.reduce((acc, field) => {
            acc[field] = data[field];
            return acc;
          }, {}),
        }));
        setEditingSection(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update personal details");
      console.error(error);
    }
  };

  // Save Payment Details
  const onSavePayment = async (data: any) => {
    if (!initialValues) return;

    // Get only changed payment fields
    const changedFields = paymentFields.reduce((acc: any, field) => {
      if (data[field] !== initialValues[field]) {
        acc[field] = data[field];
      }
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
        // Update initial values for payment fields
        setInitialValues((prev: any) => ({
          ...prev,
          ...paymentFields.reduce((acc, field) => {
            acc[field] = data[field];
            return acc;
          }, {}),
        }));
        setEditingSection(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment details");
      console.error(error);
    }
  };

  // Cancel section edits
  const handleCancel = (section: string) => {
    if (section === "personal") {
      // Reset only personal fields to initial values
      personalFields.forEach((field) => {
        setValue(field, initialValues[field]);
      });
    } else {
      // Reset only payment fields to initial values
      paymentFields.forEach((field) => {
        setValue(field, initialValues[field]);
      });
    }
    setEditingSection(null);
  };

  // Reusable Input Field Component
  const InputField = ({
    label,
    name,
    type = "text",
    icon: Icon,
    required = true,
    placeholder = "",
    disabled = false,
  }: any) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF9500] transition-colors">
            <Icon className="size-5" />
          </div>
        )}
        <input
          type={type}
          {...register(name, {
            required: required ? `${label} is required.` : false,
            ...(name === "email" && {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }),
          })}
          disabled={disabled}
          className={`
            w-full p-3 ${Icon ? "pl-10" : "pl-3"} pr-3 
            border rounded-xl outline-none 
            transition-all duration-200
            ${
              errors[name]
                ? "border-red-300 bg-red-50/50"
                : disabled
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-500"
                  : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
            }
            bg-white
          `}
          placeholder={placeholder || label}
        />
        {!disabled && watch(name) && !errors[name] && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MdCheckCircle className="size-5 text-green-500" />
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <MdWarning className="size-4" />
          {errors[name].message as string}
        </p>
      )}
    </div>
  );

  // Payment Field Component (similar to InputField but for payment section)
  const PaymentField = ({
    label,
    name,
    icon: Icon,
    placeholder = "",
    type = "text",
    options = [],
    required = false,
    disabled = false,
  }: any) => {
    const value = watch(name);

    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF9500] transition-colors pointer-events-none">
              <Icon className="size-5" />
            </div>
          )}
          {type === "select" ? (
            <select
              {...register(name, {
                required: required ? `${label} is required` : false,
              })}
              disabled={disabled}
              className={`
                w-full p-3 ${Icon ? "pl-10" : "pl-3"} pr-3 
                border rounded-xl outline-none 
                transition-all duration-200
                ${
                  errors[name]
                    ? "border-red-300 bg-red-50/50"
                    : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-500"
                      : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
                }
                bg-white appearance-none cursor-pointer
              `}
            >
              <option value="">Select {label}</option>
              {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              {...register(name, {
                required: required ? `${label} is required` : false,
              })}
              disabled={disabled}
              className={`
                w-full p-3 ${Icon ? "pl-10" : "pl-3"} pr-3 
                border rounded-xl outline-none 
                transition-all duration-200
                ${
                  errors[name]
                    ? "border-red-300 bg-red-50/50"
                    : disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-500"
                      : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
                }
                bg-white
              `}
              placeholder={placeholder || label}
            />
          )}
          {!disabled && value && !errors[name] && type !== "select" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <MdCheckCircle className="size-5 text-green-500" />
            </div>
          )}
        </div>
        {errors[name] && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <MdWarning className="size-4" />
            {errors[name].message as string}
          </p>
        )}
      </div>
    );
  };

  // Section Component
  const Section = ({
    title,
    description,
    icon: Icon,
    children,
    sectionName,
    onSave,
    hasChanges,
    isEditing,
    onEdit,
    onCancel,
  }: any) => (
    <div
      className={`
      bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300
      ${
        isEditing
          ? "border-[#FF9500] shadow-lg shadow-[#FF9500]/10"
          : "border-gray-100 hover:border-gray-200"
      }
    `}
    >
      {/* Section Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`
            p-3 rounded-xl transition-all duration-300
            ${
              isEditing
                ? "bg-[#FF9500] text-white"
                : "bg-[#FF9500]/10 text-[#FF9500]"
            }
          `}
          >
            <Icon className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              transition-all duration-300
              ${
                hasChanges
                  ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }
            `}
          >
            <MdEdit className="size-4" />
            <span className="text-sm font-medium">
              {hasChanges ? "Changes Ready" : `Edit ${title}`}
            </span>
            {hasChanges && (
              <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </button>
        )}
      </div>

      {/* Section Content */}
      <div className="w-full">{children}</div>

      {/* Section Actions */}
      {isEditing && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!hasChanges || isUpdating}
            className={`
              flex items-center gap-2 px-6 py-2.5 
              bg-[#FF9500] text-white font-medium 
              rounded-xl shadow-lg shadow-[#FF9500]/25
              transition-all duration-300
              hover:bg-[#E08500] hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            `}
          >
            {isUpdating ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <MdSave className="size-4 group-hover:scale-110 transition-transform" />
                <span>Save {title}</span>
                <MdKeyboardArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (isUserLoading) {
    return (
      <div className="">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="">
      <ToastContainer position="top-right" autoClose={3000} />

      <FormProvider {...methods}>
        <div className="space-y-6">
          {/* Personal Details Section */}
          <Section
            title="Personal Details"
            description="Update your personal information"
            icon={FiUser}
            sectionName="personal"
            hasChanges={hasPersonalChanges()}
            isEditing={editingSection === "personal"}
            onEdit={() => setEditingSection("personal")}
            onSave={handleSubmit(onSavePersonal)}
            onCancel={() => handleCancel("personal")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                icon={HiOutlineIdentification}
                placeholder="Enter your first name"
                disabled={editingSection !== "personal"}
              />
              <InputField
                label="Last Name"
                name="lastName"
                icon={HiOutlineIdentification}
                placeholder="Enter your last name"
                disabled={editingSection !== "personal"}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                icon={FiMail}
                placeholder="your@email.com"
                disabled={editingSection !== "personal"}
              />
              <InputField
                label="Mobile Number"
                name="phone"
                type="tel"
                icon={FiPhone}
                placeholder="+1 (555) 000-0000"
                disabled={editingSection !== "personal"}
              />
            </div>
          </Section>

          {/* Payment Details Section */}
          <Section
            title="Payment Details"
            description="Manage your payment methods"
            icon={FiCreditCard}
            sectionName="payment"
            hasChanges={hasPaymentChanges()}
            isEditing={editingSection === "payment"}
            onEdit={() => setEditingSection("payment")}
            onSave={handleSubmit(onSavePayment)}
            onCancel={() => handleCancel("payment")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method Type */}
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
                disabled={editingSection !== "payment"}
              />
              {/* Row 1 */}
              <PaymentField
                label="Card Number"
                name="cardNumber"
                icon={FiCreditCard}
                placeholder="**** **** **** ****"
                required
                disabled={editingSection !== "payment"}
              />
              <PaymentField
                label="Expire Date"
                name="expireDate"
                icon={FiCalendar}
                placeholder="MM/YY"
                required
                disabled={editingSection !== "payment"}
              />

              {/* Row 2 */}
              <PaymentField
                label="Security Code"
                name="securityCode"
                icon={FiLock}
                placeholder="***"
                type="password"
                required
                disabled={editingSection !== "payment"}
              />
              <PaymentField
                label="Name on Card"
                name="nameOfCard"
                icon={FiUser}
                placeholder="John Doe"
                required
                disabled={editingSection !== "payment"}
              />

              {/* Row 3 */}
              <PaymentField
                label="Billing Country"
                name="bollingCountry"
                icon={FiMapPin}
                placeholder="Country"
                required
                disabled={editingSection !== "payment"}
              />
              <PaymentField
                label="Zip Code"
                name="zipCode"
                icon={FiMapPin}
                placeholder="Zip Code"
                required
                disabled={editingSection !== "payment"}
              />

              <div className="mt-7 p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 flex items-center gap-2">
                  <FiCreditCard className="size-4" />
                  Make sure your card details match your billing address
                </p>
              </div>
            </div>
          </Section>
        </div>
      </FormProvider>
    </div>
  );
}
