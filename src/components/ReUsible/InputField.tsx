"use client";

import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FloatingInputProps = {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  type?: "text" | "email" | "number" | "textarea";
  rows?: number;
  bgColor?: string;
};

export default function FloatingInput({
  label,
  id,
  register,
  error,
  type = "text",
  rows = 4,
  bgColor = "#ffffff",
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const baseClass = `w-full border-2 rounded-md px-3 py-3 outline-none 
                     border-gray-300 bg-[${bgColor}] focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIsFocused(false);
    setHasValue(!!e.target.value); // true if has value
  };

  const handleFocus = () => setIsFocused(true);

  const floatLabel = isFocused || hasValue;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-3 px-3 transition-all duration-200 text-lg
          ${
            floatLabel ? "-top-4 text-blue-500 bg-white" : "top-3 text-gray-400"
          } 
          bg-[${bgColor}]`}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          {...register}
          placeholder=" "
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={baseClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          {...register}
          placeholder=" "
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={baseClass}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
    </div>
  );
}
