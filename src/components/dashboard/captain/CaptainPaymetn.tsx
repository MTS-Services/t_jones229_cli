"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import visa from "@/assets/payment/visa.svg";
import american from "@/assets/payment/american.svg";
import apple from "@/assets/payment/apple.svg";
import masteCard from "@/assets/payment/masteCard.svg";
import mestero from "@/assets/payment/mestero.svg";
import payPal from "@/assets/payment/payPal.svg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import {
  useCancleMemberShipMutation,
  useUpdateProfileMutation,
} from "@/redux/api/userDashboardApi/updateProfile";
import { useGetMeQuery } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

type FormValues = {
  paymentMethod: string;
  cardNumber: string;
  expireDate: string;
  securityCode: string;
  nameOfCard: string;
  bollingCountry: string;
  zipCode: string;
};

export default function CaptainMembership() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading: dataLoading } = useGetMeQuery("");
  const [updateProfileFN, { isLoading }] = useUpdateProfileMutation({});
  const [defaultValues, setDefaultValues] = useState<FormValues | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Watch form changes to detect unsaved changes
  const watchedFields = watch();

  useEffect(() => {
    if (data?.data?.paymentMethod) {
      const values: FormValues = {
        paymentMethod: data?.data?.paymentMethod?.paymentMethod || "",
        cardNumber: data?.data?.paymentMethod?.cardNumber || "",
        expireDate: data?.data?.paymentMethod?.expireDate || "",
        securityCode: data?.data?.paymentMethod?.securityCode || "",
        nameOfCard: data?.data?.paymentMethod?.nameOfCard || "",
        bollingCountry: data?.data?.paymentMethod?.bollingCountry || "",
        zipCode: data?.data?.paymentMethod?.zipCode || "",
      };
      setDefaultValues(values);
      reset(values);
    }
  }, [data, reset]);

  // Check for unsaved changes
  useEffect(() => {
    if (!defaultValues) return;

    const isChanged = Object.entries(defaultValues).some(
      ([key, defaultVal]) =>
        watchedFields[key as keyof FormValues] !== defaultVal,
    );

    setHasUnsavedChanges(isChanged);
  }, [watchedFields, defaultValues]);

  const onSubmit = async (formData: FormValues) => {
    if (!defaultValues) return;

    const isChanged = Object.entries(defaultValues).some(
      ([key, defaultVal]) => formData[key as keyof FormValues] !== defaultVal,
    );

    if (!isChanged) {
      toast.info("No changes detected.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const fullPaymentInfo = {
      paymentMethod: { ...formData },
    };

    try {
      const res = await updateProfileFN(fullPaymentInfo);
      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Payment details updated successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          },
        );
        setDefaultValues(formData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      toast.error("Failed to update payment details. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(error);
    }
  };

  const [deleteMembershipFN, { isLoading: deleteLoading }] =
    useCancleMemberShipMutation();

  const deleteMembership = async () => {
    try {
      const result = await Swal.fire({
        title: "Cancel Membership?",
        html: `
          <p class="text-gray-600">Are you sure you want to cancel your membership?</p>
          <p class="text-sm text-gray-500 mt-2">This action cannot be undone and you will lose access to all premium features.</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, cancel membership",
        cancelButtonText: "Keep membership",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const res = await deleteMembershipFN({});

        if (res?.data?.success) {
          await Swal.fire({
            title: "Membership Cancelled",
            text: "Your membership has been successfully cancelled.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          dispatch(logout());
          Cookies.remove("token");
          router.push("/");
        } else {
          toast.error(
            (res?.error &&
              "data" in res.error &&
              (res.error as any).data?.message) ||
              "Failed to cancel membership. Please try again.",
            {
              position: "top-right",
              autoClose: 4000,
            },
          );
        }
      }
    } catch (error) {
      toast.error("An error occurred while cancelling membership.", {
        position: "top-right",
        autoClose: 4000,
      });
      console.error(error);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (dataLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#73bbf7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl text-[#242424] font-bold">Payment Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your payment information securely
          </p>
        </div>
        <div className="flex gap-2">
          {[american, apple, mestero, masteCard, payPal, visa].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="payment"
              className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-amber-800">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">You have unsaved changes</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Payment Method
            </label>
            <input
              type="text"
              {...register("paymentMethod", {
                required: "Payment method is required",
              })}
              placeholder="e.g., Mastercard, Visa"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Card Number
            </label>
            <input
              type="text"
              maxLength={19}
              {...register("cardNumber", {
                required: "Card number is required",
                pattern: {
                  value: /^[\d\s]{13,19}$/,
                  message: "Please enter a valid card number",
                },
              })}
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                e.target.value = formatted;
              }}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.cardNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Expiration Date
            </label>
            <input
              type="text"
              maxLength={5}
              {...register("expireDate", {
                required: "Expiration date is required",
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Please enter a valid date (MM/YY)",
                },
              })}
              placeholder="MM/YY"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
              onChange={(e) => {
                const formatted = formatExpiryDate(e.target.value);
                e.target.value = formatted;
              }}
            />
            {errors.expireDate && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.expireDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Security Code (CVV)
            </label>
            <input
              type="text"
              maxLength={4}
              {...register("securityCode", {
                required: "Security code is required",
                pattern: {
                  value: /^\d{3,4}$/,
                  message: "Please enter a valid CVV",
                },
              })}
              placeholder="123"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
            {errors.securityCode && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.securityCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Name on Card
            </label>
            <input
              type="text"
              {...register("nameOfCard", {
                required: "Cardholder name is required",
              })}
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
            {errors.nameOfCard && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.nameOfCard.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              Billing Country
            </label>
            <input
              type="text"
              {...register("bollingCountry", {
                required: "Billing country is required",
              })}
              placeholder="United States"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
            {errors.bollingCountry && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.bollingCountry.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-2">
              ZIP/Postal Code
            </label>
            <input
              type="text"
              {...register("zipCode", {
                required: "ZIP/Postal code is required",
              })}
              placeholder="10001"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#73bbf7] focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.zipCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading || !hasUnsavedChanges}
          className="bg-[#FF9500] flex items-center gap-4 text-white text-base rounded-lg py-3 px-5 text-center  font-medium font-shatosi hover:bg-[#E08500] duration-300 ease-in-ou active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Changes</span>
              <MdKeyboardArrowRight className="size-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={deleteMembership}
          disabled={deleteLoading}
          className="bg-red-500 text-white px-6 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
        >
          {deleteLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Cancel Membership</span>
              <MdKeyboardArrowRight className="size-5" />
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <svg
          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-base font-medium text-blue-900">
            Your payment information is secure
          </p>
          <p className="text-sm text-blue-700 mt-1">
            All card details are encrypted and stored securely. We never share
            your information with third parties.
          </p>
        </div>
      </div>
    </form>
  );
}
