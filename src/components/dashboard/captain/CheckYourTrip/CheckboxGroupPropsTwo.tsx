import React from "react";

interface CheckboxGroupProps {
  title: string;
  name: string;
  options: string[];
  register: any;
}

const CheckboxGroupTwo: React.FC<CheckboxGroupProps> = ({
  title,
  name,
  options,
  register,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="flex flex-col space-y-2">
        {options?.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-[#9E9E9E] text-lg font-normal">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroupTwo;
