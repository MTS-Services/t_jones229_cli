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
  } = useForm<FormValues>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = useGetMeQuery('');
  const [updateProfileFN, { isLoading }] = useUpdateProfileMutation({});
  const [defaultValues, setDefaultValues] = useState<FormValues | null>(null);

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
      reset(values); // populate form with default values
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormValues) => {
    if (!defaultValues) return;

    const isChanged = Object.entries(defaultValues).some(
      ([key, defaultVal]) => formData[key as keyof FormValues] !== defaultVal
    );

    if (!isChanged) {
      toast.info("No changes detected.");
      return;
    }

    const fullPaymentInfo = {
      paymentMethod: { ...formData },
    };

    try {
      const res = await updateProfileFN(fullPaymentInfo);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [deleteMembershipFN, { isLoading: deleteLoading }] =
    useCancleMemberShipMutation();
  const deleteMembership = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteMembershipFN({});
          console.log(res);
          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            dispatch(logout());
            Cookies.remove("token");
            // go to home page
            router.push("/");
          } else {
            toast.error(
              (res?.error &&
                "data" in res.error &&
                (res.error as any).data?.message) ||
                "Error cancelling membership"
            );
          }
        }
      });
    } catch (error) {
      toast.error("Error cancelling membership: " + error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 md:p-8 space-y-6 max-w-6xl mt-10"
    >
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-3xl text-[#242424] font-bold">
          Payment details
        </h2>
        <div className="flex gap-2 mt-2">
          {[american, apple, mestero, masteCard, payPal, visa].map((src, i) => (
            <Image key={i} src={src} alt="payment" className="h-6 w-auto" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold">
              Choose payment method
            </label>
            <input
              type="text"
              {...register("paymentMethod", {
                required: "Enter payment method",
              })}
              placeholder="Mastercard"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-bold">Card Number</label>
            <input
              type="text"
              maxLength={16}
              {...register("cardNumber", { required: "Enter card number" })}
              placeholder="1234 1234 1234 1234"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">
                {errors.cardNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold">Expiration Date</label>
            <input
              type="text"
              {...register("expireDate", { required: "Enter expiry date" })}
              placeholder="MM/YY"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.expireDate && (
              <p className="text-red-500 text-sm">
                {errors.expireDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-bold">
              Security Code (CVC)
            </label>
            <input
              type="text"
              maxLength={3}
              {...register("securityCode", {
                required: "Enter security code",
              })}
              placeholder="CVC"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.securityCode && (
              <p className="text-red-500 text-sm">
                {errors.securityCode.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold">Name on card</label>
            <input
              type="text"
              {...register("nameOfCard", { required: "Enter card name" })}
              placeholder="Cardholder name"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.nameOfCard && (
              <p className="text-red-500 text-sm">
                {errors.nameOfCard.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-bold">Billing country</label>
            <input
              type="text"
              {...register("bollingCountry", { required: "Enter country" })}
              placeholder="E.g. United States"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.bollingCountry && (
              <p className="text-red-500 text-sm">
                {errors.bollingCountry.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold">ZIP/Postal code</label>
            <input
              type="text"
              {...register("zipCode", { required: "Enter ZIP or Postal code" })}
              placeholder="ZIP/Postal code"
              className="w-full mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 items-center md:items-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#ffaa33] text-white w-48 px-4 py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-[#0037ff] transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Save Changes"}
            <MdKeyboardArrowRight className="size-5" />
          </button>

          <div
            onClick={deleteMembership}
            className="bg-[#ffaa33] text-white w-52 px-4 py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-[#0037ff] transition disabled:opacity-50 cursor-pointer"
          >
            {deleteLoading ? "Processing..." : "Cancel membership"}

            <MdKeyboardArrowRight className="size-5" />
          </div>
        </div>
      </div>
    </form>
  );
}
