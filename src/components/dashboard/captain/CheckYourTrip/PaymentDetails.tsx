"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { Divider, Skeleton } from "antd";
import { useFormContext } from "react-hook-form";
import { usePathname } from "next/navigation";
import { User, CreditCard } from "lucide-react";
import { useEffect } from "react";
import PaymentDetailsForm from "./PaymentDetailsForm";

export default function PaymentDetails() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const pathName = usePathname();
  const { data: userInfo, isLoading } = useGetMeQuery({});

  // Auto-fill form with user data when it loads
  useEffect(() => {
    if (userInfo?.data) {
      const user = userInfo.data;
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.email) setValue("email", user.email);
      if (user.phoneNumber) setValue("mobile", user.phoneNumber);
    }
  }, [userInfo, setValue]);

  if (isLoading) {
    return <PaymentDetailsSkeleton />;
  }

  const showProfileUpdateMessage =
    pathName === "/boat-list-form/terms" &&
    (errors.firstName || errors.lastName || errors.email || errors.mobile);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Personal & Payment Details
          </h2>
        </div>
        <p className="text-gray-600 text-base md:text-lg max-w-3xl">
          We need a few details to complete your Fishing Tripper booking. Your
          information is securely stored and only used for booking purposes.
        </p>
      </div>

      {/* Profile Update Alert */}
      {showProfileUpdateMessage && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm font-medium">
            Please update your profile information in the user dashboard to
            proceed.
          </p>
        </div>
      )}

      {/* Personal Information Section */}
      <section className="">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Personal Information
          </h3>
          <p className="text-gray-500 text-sm">
            All fields marked with * are required
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First Name */}
          <FormField>
            <Label required htmlFor="firstName">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              {...register("firstName", { required: "First name is required" })}
              defaultValue={userInfo?.data?.firstName}
              placeholder="John"
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <ErrorMessage>{String(errors.firstName.message)}</ErrorMessage>
            )}
          </FormField>

          {/* Last Name */}
          <FormField>
            <Label required htmlFor="lastName">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              defaultValue={userInfo?.data?.lastName}
              placeholder="Doe"
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <ErrorMessage>{String(errors.lastName.message)}</ErrorMessage>
            )}
          </FormField>

          {/* Email */}
          <FormField>
            <Label required htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email address",
                },
              })}
              defaultValue={userInfo?.data?.email}
              placeholder="john.doe@example.com"
              error={!!errors.email}
            />
            {errors.email && (
              <ErrorMessage>{String(errors.email.message)}</ErrorMessage>
            )}
          </FormField>

          {/* Mobile */}
          <FormField>
            <Label required htmlFor="mobile">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
              defaultValue={userInfo?.data?.phoneNumber}
              placeholder="+1 234 567 8900"
              error={!!errors.mobile}
            />
            {errors.mobile && (
              <ErrorMessage>{String(errors.mobile.message)}</ErrorMessage>
            )}
          </FormField>

          {/* Marketing Consent */}
          <div className="lg:col-span-2">
            <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="marketingConsent"
                type="checkbox"
                {...register("marketingConsent")}
                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <div>
                <label
                  htmlFor="marketingConsent"
                  className="text-sm font-medium text-gray-900"
                >
                  Marketing Communications
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  By providing your email, you agree to receive booking
                  confirmations, updates about your trip, and occasional
                  promotional materials. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
      <Divider className="my-8" />

      <section>
        {/* <PaymentDetailsForm paymentInfo={userInfo?.data?.paymentMethod} /> */}
      </section>
    </div>
  );
}

// Reusable Components
const FormField: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

const Label: React.FC<{
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}> = ({ children, htmlFor, required }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
  }
> = ({ error, className = "", ...props }) => (
  <input
    className={`
      w-full px-4 py-3 rounded-lg border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      }
      placeholder:text-gray-400
      ${className}
    `}
    {...props}
  />
);

const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-sm text-red-600 flex items-center gap-1">
    <span>⚠</span>
    {children}
  </p>
);

// Skeleton Loader Component
const PaymentDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-10">
      <Skeleton.Button
        active
        size="large"
        className="mb-4"
        style={{ width: 300 }}
      />
      <Skeleton.Input active className="w-full max-w-2xl" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton.Input active size="small" className="w-32" />
          <Skeleton.Input active className="w-full" />
        </div>
      ))}
    </div>

    <Divider className="my-8" />

    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton.Avatar active size={40} />
        <Skeleton.Input active className="w-48" />
      </div>
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  </div>
);
