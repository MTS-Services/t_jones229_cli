"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { Skeleton } from "antd";
import { useFormContext } from "react-hook-form";
import { usePathname, useSearchParams } from "next/navigation";
import { User, UserPlus, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";

export default function PaymentDetails() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const isGuestMode = searchParams.get("guest") === "true";

  const { data: userInfo, isLoading } = useGetMeQuery(
    {},
    { skip: isGuestMode }, // Don't fetch user data for guests
  );

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

  // Only show Terms checkbox on captain's boat listing pages, not on customer payment page
  const showTermsCheckbox =
    pathName?.includes("/check-your-trip") ||
    pathName?.includes("/boat-list-form");

  const passwordValue = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="p-2 bg-blue-50 rounded-lg">
            {isGuestMode ? (
              <UserPlus className="w-4 md:w-5 h-4 md:h-5 text-orange-500" />
            ) : (
              <User className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {isGuestMode
              ? "Create Account & Pay"
              : "Personal & Payment Details"}
          </h2>
        </div>

        <p className="text-gray-600 text-base md:text-sm max-w-3xl p-4 bg-yellow-50 rounded-lg border border-gray-200">
          {isGuestMode
            ? "Fill in your details below to create a free account and complete your booking — all in one step."
            : "Please provide your contact and payout details so we can process bookings and send payments to you. All information is kept secure and used only for account verification and transferring your earnings after completed trips."}
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

          {/* ── Guest-only: Password fields ── */}
          {isGuestMode && (
            <>
              <FormField>
                <Label required htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Create a password"
                    error={!!errors.password}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <ErrorMessage>{String(errors.password.message)}</ErrorMessage>
                )}
              </FormField>

              <FormField>
                <Label required htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (v) =>
                        v === passwordValue || "Passwords do not match",
                    })}
                    placeholder="Repeat your password"
                    error={!!errors.confirmPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <ErrorMessage>
                    {String(errors.confirmPassword.message)}
                  </ErrorMessage>
                )}
              </FormField>
            </>
          )}

          {/* Terms & Conditions - REQUIRED (captain boat listing only) */}
          {showTermsCheckbox && (
            <div className="lg:col-span-2">
              <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <input
                  id="termsAccepted"
                  type="checkbox"
                  {...register("termsAccepted", {
                    required:
                      "You must accept the terms and conditions to proceed",
                  })}
                  className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                />
                <div className="flex-1">
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Terms & Conditions Acceptance{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-700 text-sm mt-1">
                    I have read and agree to the Terms & Conditions, including
                    the 5% commission fee, cancellation policy, and payment
                    terms outlined on this page.
                  </p>
                </div>
              </div>
              {errors.termsAccepted && (
                <ErrorMessage>
                  {String(errors.termsAccepted.message)}
                </ErrorMessage>
              )}
            </div>
          )}

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
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-600 mb-1"
  >
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
      w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] placeholder-gray-300
      ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-[#73bbf7] focus:ring-[#73bbf7]"
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

    <div className="my-8 border-t border-gray-200" />

    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton.Avatar active size={40} />
        <Skeleton.Input active className="w-48" />
      </div>
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  </div>
);
