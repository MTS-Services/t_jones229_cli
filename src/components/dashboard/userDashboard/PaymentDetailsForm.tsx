"use client";
import Image from "next/image";
import React from "react";
import { useFormContext } from "react-hook-form";
import visa from "@/assets/payment/visa.svg";
import american from "@/assets/payment/american.svg";
import apple from "@/assets/payment/apple.svg";
import masteCard from "@/assets/payment/masteCard.svg";
import mestero from "@/assets/payment/mestero.svg";
import payPal from "@/assets/payment/payPal.svg";
import { CreditCard } from "lucide-react";
// import { CardElement } from "@stripe/react-stripe-js";

export default function PaymentDetailsForm({ paymentInfo }: any) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="mb-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Information
            </h3>
            <p className="text-gray-500 text-sm">
              Securely add your payment method for booking
            </p>
          </div>
        </div>

        <div className="flex justify-start md:justify-end gap-2 mt-2">
          {[american, apple, mestero, masteCard, payPal, visa].map((src, i) => (
            <Image key={i} src={src} alt="payment" className="h-6" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-bold">
              Choose payment method
            </label>
            <select
              {...register("paymentMethod", {
                required: "Select a payment method",
              })}
              defaultValue={paymentInfo?.paymentMethod || ""}
              className="w-full mt-2 rounded-md border border-[#E0E0E0] px-4 py-2"
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="mastercard">MasterCard</option>
              <option value="debit card">Debit Card</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="visa">Visa</option>
            </select>

            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">
                {errors.paymentMethod.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-bold">Card Number</label>
            <input
              type="text"
              maxLength={16}
              defaultValue={paymentInfo?.cardNumber}
              {...register("cardNumber", { required: "Enter card number" })}
              placeholder="1234 1234 1234 1234"
              className="w-full mt-2 border rounded-md border-[#E0E0E0] px-4 py-2"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">
                {errors.cardNumber.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0 md:mt-2">
          <div>
            <label className="block text-base font-bold">Expiration Date</label>
            <input
              type="text"
              maxLength={5} // MM/YY format
              placeholder="MM/YY"
              defaultValue={paymentInfo?.expireDate}
              {...register("expireDate", {
                required: "Enter expiry date",
                onChange: (e) => {
                  let value = e.target.value.replace(/\D/g, ""); // keep only numbers

                  if (value.length >= 3) {
                    value = value.slice(0, 2) + "/" + value.slice(2, 4);
                  }

                  e.target.value = value;
                },
              })}
              className="w-full rounded-md mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.expireDate && (
              <p className="text-red-500 text-sm">
                {errors.expireDate.message as string}
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
              defaultValue={paymentInfo?.securityCode}
              {...register("securityCode", { required: "Enter security code" })}
              placeholder="CVC"
              className="w-full mt-2 rounded-md border border-[#E0E0E0] px-4 py-2"
            />
            {errors.securityCode && (
              <p className="text-red-500 text-sm">
                {errors.securityCode.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0 md:mt-2">
          <div>
            <label className="block text-base font-bold">Name on card</label>
            <input
              type="text"
              defaultValue={paymentInfo?.nameOfCard}
              {...register("nameOfCard", { required: "Enter card name" })}
              placeholder="Cardholder name"
              className="w-full rounded-md mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.nameOfCard && (
              <p className="text-red-500 text-sm">
                {String(errors.nameOfCard.message)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-bold">Billing country</label>
            <input
              type="text"
              defaultValue={paymentInfo?.bollingCountry}
              {...register("bollingCountry", { required: "Enter country" })}
              placeholder="E.g. United States"
              className="w-full rounded-md mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.bollingCountry && (
              <p className="text-red-500 text-sm">
                {String(errors.bollingCountry.message)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0 md:mt-2">
          <div className="w-full ">
            <label className="block text-base font-bold">ZIP/Postal code</label>
            <input
              type="text"
              defaultValue={paymentInfo?.zipCode}
              {...register("zipCode", { required: "Enter ZIP or Postal code" })}
              placeholder="ZIP/Postal code"
              className="w-full rounded-md mt-2 border border-[#E0E0E0] px-4 py-2"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">
                {String(errors.zipCode.message)}s
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
