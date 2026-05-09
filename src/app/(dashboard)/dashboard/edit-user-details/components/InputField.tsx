"use client";

import { useFormContext } from "react-hook-form";
import { MdWarning, MdCheckCircle } from "react-icons/md";

// Reusable text/email/tel Input
export const InputField = ({
  label,
  name,
  type = "text",
  icon: Icon,
  required = true,
  placeholder = "",
  disabled = false,
}: any) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
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
};

// Payment / select-capable field
export const PaymentField = ({
  label,
  name,
  icon: Icon,
  placeholder = "",
  type = "text",
  options = [],
  required = false,
  disabled = false,
}: any) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
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
