"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import visa from "@/assets/payment/visa.svg";
import american from "@/assets/payment/american.svg";
import apple from "@/assets/payment/apple.svg";
import masteCard from "@/assets/payment/masteCard.svg";
import mestero from "@/assets/payment/mestero.svg";
import payPal from "@/assets/payment/payPal.svg";
import { CreditCard, ChevronDown } from "lucide-react";

interface PaymentDetailsFormProps {
  paymentInfo?: any;
}

function UserCardPaymentDetailsForm({ paymentInfo }: PaymentDetailsFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMethod =
    watch("paymentMethod") || paymentInfo?.paymentMethod || "";

  const paymentMethods = [
    { id: "mastercard", label: "MasterCard" },
    { id: "debit card", label: "Debit Card" },
    { id: "credit card", label: "Credit Card" },
    { id: "paypal", label: "PayPal" },
    { id: "visa", label: "Visa" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputStyles =
    "w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#73bbf7] focus:border-[#73bbf7] transition-all placeholder-gray-300 mt-2 bg-white text-left flex items-center justify-between";

  return (
    <div className="mb-5 font-sans">
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
              Securely add your payment method
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {[american, apple, mestero, masteCard, payPal, visa].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="payment"
              className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 mt-3">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Choose payment method
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={inputStyles}
          >
            <span
              className={selectedMethod ? "text-gray-900" : "text-gray-300"}
            >
              {selectedMethod
                ? selectedMethod.charAt(0).toUpperCase() +
                  selectedMethod.slice(1)
                : "Select Payment Method"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 transition-colors border-b last:border-none border-gray-50"
                  onClick={() => {
                    setValue("paymentMethod", method.id);
                    setIsOpen(false);
                  }}
                >
                  {method.label}
                </div>
              ))}
            </div>
          )}
          <input
            type="hidden"
            {...register("paymentMethod", {
              required: "Select a payment method",
            })}
          />
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-1">
              {errors.paymentMethod.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Card Number
          </label>
          <input
            type="text"
            maxLength={16}
            placeholder="1234 1234 1234 1234"
            className={inputStyles.replace(
              "flex items-center justify-between",
              "",
            )}
            {...register("cardNumber", { required: "Enter card number" })}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardNumber.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Expiration Date
          </label>
          <input
            type="text"
            maxLength={5}
            placeholder="MM/YY"
            className={inputStyles.replace(
              "flex items-center justify-between",
              "",
            )}
            {...register("expireDate", {
              required: "Required",
              onChange: (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                e.target.value = v;
              },
            })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Security Code (CVC)
          </label>
          <input
            type="text"
            maxLength={3}
            placeholder="CVC"
            className={inputStyles.replace(
              "flex items-center justify-between",
              "",
            )}
            {...register("securityCode", { required: "Required" })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Name on card
          </label>
          <input
            type="text"
            placeholder="Cardholder name"
            className={inputStyles.replace(
              "flex items-center justify-between",
              "",
            )}
            {...register("nameOfCard", { required: "Required" })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Billing country
          </label>
          <input
            type="text"
            placeholder="E.g. United States"
            className={inputStyles.replace(
              "flex items-center justify-between",
              "",
            )}
            {...register("bollingCountry", { required: "Required" })}
          />
        </div>
      </div>
    </div>
  );
}

export default UserCardPaymentDetailsForm;
