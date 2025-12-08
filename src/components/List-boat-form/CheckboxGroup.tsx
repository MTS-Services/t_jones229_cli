// components/CheckboxGroup.tsx
import React from "react";

interface CheckboxGroupProps {
  name: string;
  options: string[];
  selectedValues: string[];
  register: any; // Preferably use FieldValues type from react-hook-form
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  selectedValues,
  register,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {options?.map((option) => (
        <label key={option} className="space-x-2">
          <input
            type="checkbox"
            value={option}
            {...register(name)}
            defaultChecked={selectedValues.includes(option)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <span className=" text-[#9E9E9E] text-lg font-normal">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
