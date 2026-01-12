// // components/CheckboxGroup.tsx
// import React from "react";

// interface CheckboxGroupProps {
//   name: string;
//   options: string[];
//   selectedValues: string[];
//   register: any;
// }

// const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
//   name,
//   options,
//   selectedValues,
//   register,
// }) => {
//   return (
//     <div className="flex flex-col space-y-2">
//       {options?.map((option) => (
//         <label key={option} className="space-x-2">
//           <input
//             type="checkbox"
//             value={option}
//             {...register(name)}
//             defaultChecked={selectedValues.includes(option)}
//             className="w-4 h-4 text-blue-600 border-gray-300 rounded"
//           />
//           <span className=" text-[#9E9E9E] text-lg font-normal">{option}</span>
//         </label>
//       ))}
//     </div>
//   );
// };

// export default CheckboxGroup;

import React from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
  title?: string; // ✅ Make title optional
  name: string;
  options: string[];
  register: UseFormRegister<any>;
  selectedValues?: string[];
}

const CheckboxGroup: React.FC<Props> = ({
  title,
  name,
  options,
  register,
  selectedValues = [],
}) => {
  return (
    <div className="mb-6">
      {title && <h3 className="font-bold text-lg mb-3">{title}</h3>}{" "}
      {/* ✅ Conditionally render title */}
      {options.map((option) => (
        <label key={option} className="flex gap-2 items-center mb-2">
          <input
            type="checkbox"
            value={option}
            {...register(name)}
            defaultChecked={selectedValues.includes(option)}
          />
          <span className="text-gray-500 text-base">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;
