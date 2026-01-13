"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { Divider } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useUpdateProfileMutation } from "@/redux/api/userDashboardApi/updateProfile";
import { toast, ToastContainer } from "react-toastify";
import { useGetMeQuery } from "@/redux/api/authApi";

export default function EditProfile() {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const { data: userInfo } = useGetMeQuery({});
  const [updateProfileFN, { isLoading }] = useUpdateProfileMutation();
  const [initialValues, setInitialValues] = useState<any>(null);

  // When userInfo arrives, set defaults
  useEffect(() => {
    if (userInfo?.data) {
      const defaultValues = {
        firstName: userInfo?.data?.firstName || "",
        lastName: userInfo?.data?.lastName || "",
        email: userInfo?.data?.email || "",
        phone: userInfo?.data?.phoneNumber || "",
        cardNumber: userInfo?.data?.paymentMethod?.cardNumber || "",
        expireDate: userInfo?.data?.paymentMethod?.expireDate || "",
        securityCode: userInfo?.data?.paymentMethod?.securityCode || "",
        nameOfCard: userInfo?.data?.paymentMethod?.nameOfCard || "",
        bollingCountry: userInfo?.data?.paymentMethod?.bollingCountry || "",
        zipCode: userInfo?.data?.paymentMethod?.zipCode || "",
      };
      reset(defaultValues); // Populate form
      setInitialValues(defaultValues); // Save for comparison
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: any) => {
    if (!initialValues) return;

    const isChanged = Object.keys(initialValues).some(
      (key) => data[key] !== initialValues[key]
    );

    if (!isChanged) {
      toast.info("No changes detected.");
      return;
    }

    const fullPaymentInfo = {
      paymentMethod: {
        paymentMethod: data?.paymentMethod,
        cardNumber: data?.cardNumber,
        expireDate: data?.expireDate,
        securityCode: data?.securityCode,
        nameOfCard: data?.nameOfCard,
        bollingCountry: data?.bollingCountry,
        zipCode: data?.zipCode,
      },
      user: {
        firstName: data?.firstName,
        lastName: data?.lastName,
        phoneNumber: data?.phone,
      },
    };

    try {
      const res = await updateProfileFN(fullPaymentInfo).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 w-full">
      <ToastContainer />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-textPrimary">
              Your details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  First name*
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required.",
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Last name*
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required.",
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email.",
                    },
                  })}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Mobile number*
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required." })}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 bg-white"
                  placeholder="Phone"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: "#d9d9d9" }} className="my-6" />
          <PaymentDetailsForm paymentInfo={userInfo?.data?.paymentMethod} />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#ffaa33] text-white px-4 py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-[#0037ff] transition disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Save Changes"}
            <MdKeyboardArrowRight className="size-5" />
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
