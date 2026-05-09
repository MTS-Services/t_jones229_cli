"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { Divider, Skeleton } from "antd";
import { useFormContext } from "react-hook-form";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useEffect } from "react";
import PaymentDetailsForm from "./USAPaymentDetailsForm";

export default function PaymentDetails() {
  const methods = useFormContext();
  const pathName = usePathname();
  // Fetch user data
  const { data: userInfo, isLoading, isSuccess } = useGetMeQuery({});

  const {
    register,
    formState: { errors },
    setValue,
  } = methods || { formState: { errors: {} } };

  // Sync API data with Form State
  useEffect(() => {
    if (isSuccess && userInfo?.data && setValue) {
      const user = userInfo.data;
      // Using { shouldValidate: true } ensures the form knows the values are there
      if (user.firstName)
        setValue("firstName", user.firstName, { shouldValidate: true });
      if (user.lastName)
        setValue("lastName", user.lastName, { shouldValidate: true });
      if (user.email) setValue("email", user.email, { shouldValidate: true });
      if (user.phoneNumber)
        setValue("mobile", user.phoneNumber, { shouldValidate: true });
    }
  }, [userInfo, setValue, isSuccess]);

  // Handle missing context or loading
  if (!methods) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: PaymentDetails must be wrapped inside a FormProvider.
      </div>
    );
  }

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
          We need a few details to complete your booking.
        </p>
      </div>

      {showProfileUpdateMessage && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm font-medium">
            Please update your profile information to proceed.
          </p>
        </div>
      )}

      <section>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First Name */}
          <FormField>
            <Label required htmlFor="firstName">
              First Name
            </Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
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
              {...register("lastName", { required: "Last name is required" })}
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
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
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
              {...register("mobile", { required: "Mobile number is required" })}
              error={!!errors.mobile}
            />
            {errors.mobile && (
              <ErrorMessage>{String(errors.mobile.message)}</ErrorMessage>
            )}
          </FormField>
        </div>
      </section>

      <Divider className="my-8" />
      <section>
        <PaymentDetailsForm paymentInfo={userInfo?.data?.paymentMethod} />
      </section>
    </div>
  );
}

// --- Internal components (keep these as you had them) ---
const FormField = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);
const Label = ({ children, htmlFor, required }: any) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);
const Input = ({ error, ...props }: any) => (
  <input
    className={`w-full px-4 py-3 rounded-lg border transition-all ${
      error ? "border-red-300" : "border-gray-300"
    }`}
    {...props}
  />
);
const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-red-600 mt-1">{children}</p>
);

const PaymentDetailsSkeleton = () => (
  <div className="max-w-6xl mx-auto p-8">
    <Skeleton active paragraph={{ rows: 8 }} />
  </div>
);
