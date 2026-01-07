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
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import MeetingPointSection from "./MeetingPointSection";

const MeetingPoint: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      street: "",
      city: "",
      country: "",
      postCode: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Your UI Component */}
        <MeetingPointSection />

        {/* Example Submit Button */}
        <div className="px-14 pb-10">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save Address
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MeetingPoint;
