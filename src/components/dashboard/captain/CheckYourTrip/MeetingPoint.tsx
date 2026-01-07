// "use client";
// import React from "react";
// import { useForm, FormProvider, useFormContext } from "react-hook-form";
// import { Divider } from "antd";

// // ================== MeetingPoint Component ==================
// const MeetingPoint: React.FC = () => {
//   const { register } = useFormContext();

//   return (
//     <div className="space-y-6">
//       {/* Form Fields */}
//       <div className=" max-h-screen">
//         <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
//           {/* Street address */}
//           <div>
//             <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
//               Street address
//             </label>
//             <input
//               type="text"
//               {...register("street")}
//               className="w-full px-3 py-2 border border-gray-300"
//               placeholder="Enter your street no"
//             />
//           </div>

//           {/* City */}
//           <div>
//             <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
//               City
//             </label>
//             <input
//               type="text"
//               {...register("city")}
//               className="w-full px-3 py-2 border border-gray-300"
//               placeholder="Enter your city"
//             />
//           </div>

//           {/* Country */}
//           <div>
//             <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
//               Country
//             </label>
//             <input
//               type="text"
//               {...register("country")}
//               className="w-full px-3 py-2 border border-gray-300"
//               placeholder="Enter your country"
//             />
//           </div>

//           {/* ZIP/Post code */}
//           <div>
//             <label className="text-textSecondary text-base md:text-lg font-bold leading-8">
//               ZIP/Post code
//             </label>
//             <input
//               type="text"
//               {...register("postCode")}
//               className="w-full px-3 py-2 border border-gray-300"
//               placeholder="Enter your zip code"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="px-14">
//         <Divider style={{ borderColor: "#d9d9d9" }} />
//       </div>
//     </div>
//   );
// };

// // ================== Parent Form Wrapper ==================
// const MeetingPointForm: React.FC = () => {
//   const methods = useForm(); // Initialize react-hook-form

//   const onSubmit = (data: any) => {
//     console.log("Form Data:", data);
//   };

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)}>
//         <MeetingPoint />
//         <div className="px-14 mt-4">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   );
// };

// export default MeetingPointForm;

"use client";
import React, { useState } from "react"; // Added useState
import { useForm, FormProvider } from "react-hook-form";
import { Divider } from "antd";
import AdjustPin from "./AdjustPin";

const MeetingPoint: React.FC = () => {
  // 1. State to track if we should show AdjustPin
  const [showAdjustPin, setShowAdjustPin] = useState(false);

  // 2. Initialize the form methods
  const methods = useForm({
    defaultValues: {
      street: "",
      city: "",
      country: "",
      postCode: "",
    },
  });

  // 3. Form submission handler
  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    // Instead of just an alert, we set state to true to show the component
    setShowAdjustPin(true);
  };

  // 4. Conditional Rendering: If showAdjustPin is true, show that component
  if (showAdjustPin) {
    return <AdjustPin />;
  }

  return (
    <div className="">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Street address */}
            <div className="flex flex-col gap-2">
              <label className="text-[#4b5563] text-base md:text-lg font-bold">
                Street address
              </label>
              <input
                type="text"
                {...methods.register("street", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
                placeholder="Enter your street no"
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="text-[#4b5563] text-base md:text-lg font-bold">
                City
              </label>
              <input
                type="text"
                {...methods.register("city", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
                placeholder="Enter your city"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-2">
              <label className="text-[#4b5563] text-base md:text-lg font-bold">
                Country
              </label>
              <input
                type="text"
                {...methods.register("country", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
                placeholder="Enter your country"
              />
            </div>

            {/* ZIP/Post code */}
            <div className="flex flex-col gap-2">
              <label className="text-[#4b5563] text-base md:text-lg font-bold">
                ZIP/Post code
              </label>
              <input
                type="text"
                {...methods.register("postCode", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
                placeholder="Enter your zip code"
              />
            </div>
          </div>

          {/* Divider Section */}
          <div className="my-10">
            <Divider style={{ borderColor: "#d9d9d9", margin: 0 }} />
          </div>

          {/* Footer Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="border border-gray-300 text-gray-600 px-8 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
            >
              Next <span className="text-xl mb-0.5">›</span>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MeetingPoint;
