// import React from "react";
// import { useFormContext } from "react-hook-form";
// import MapSection from "./MapSection";

// interface MeetingPointFormValues {
//   direction: string;
// }

// const AdjustPin: React.FC = () => {
//   const { register } = useFormContext<MeetingPointFormValues>();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
//         <h1 className="text-3xl font-bold text-textPrimary leading-normal mb-2">
//           Meeting Point
//         </h1>
//         <p className="text-base text-textPrimary font-normal leading-normal">
//           Upload high quality photos and videos to maximise conversion rates
//           with potential customers.
//         </p>
//       </div>

//       <div className="py-12 px-5 md:px-14 min-h-screen">
//         <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-2">
//           Adjust the pin
//         </h1>
//         <p className="text-base text-[#878787] font-normal leading-normal">
//           Click and drag the pin to the desired meeting location and leave clear
//           instructions for how customers can get there.
//         </p>

//         <div className="rounded-md py-5 w-full md:max-w-3xl">
//           <MapSection />
//         </div>

//         <div className="max-w-4xl">
//           {/* ZIP/Post code section */}
//           <div className="w-full">
//             <label className="text-[#878787] text-base md:text-lg font-normal leading-8">
//               Add directions to your meeting point
//             </label>
//             <textarea
//               rows={5}
//               {...register("direction")}
//               className="w-full px-3 py-2 text-base border border-gray-300 mt-2"
//               placeholder="Provide some instructions here"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Footer Navigation Buttons */}
//       <div className="flex items-center justify-between">
//         <button
//           type="button"
//           className="border border-gray-300 text-gray-600 px-8 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
//         >
//           Back
//         </button>

//         <button
//           type="submit"
//           className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
//         >
//           Next <span className="text-xl mb-0.5">›</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdjustPin;

import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import MapSection from "./MapSection";

// 1. Data Type define kora
interface MeetingPointFormValues {
  direction: string;
}

// 2. Main Input Component
const AdjustPinContent: React.FC = () => {
  // Ekhane register ekhon context theke pabe karon upore FormProvider ache
  const { register } = useFormContext<MeetingPointFormValues>();

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-xl md:text-2xl font-bold text-textPrimary leading-normal mb-2">
          Adjust the pin
        </h1>
        <p className="text-base text-[#878787] font-normal leading-normal">
          Click and drag the pin to the desired meeting location and leave clear
          instructions for how customers can get there.
        </p>

        <div className="rounded-md py-5 w-full md:max-w-3xl">
          <MapSection />
        </div>

        <div className="">
          <div className="w-full">
            <label className="text-[#878787] text-base md:text-lg font-normal leading-8">
              Add directions to your meeting point
            </label>
            <textarea
              rows={5}
              {...register("direction")} // Ekhon eiti thikmoto kaj korbe
              className="w-full px-3 py-2 text-base border border-gray-300 mt-2 rounded-md outline-none focus:ring-1 focus:ring-orange-400"
              placeholder="Provide some instructions here"
            />
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between mt-10">
          <button
            type="button"
            className="border border-gray-300 text-gray-600 px-8 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold"
          >
            Back
          </button>

          <button
            type="submit" // Submit type deway onSubmit trigger hobe
            className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-2.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
          >
            Next <span className="text-xl mb-0.5">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Main Component (Eiti apni export korben)
const AdjustPin: React.FC = () => {
  const methods = useForm<MeetingPointFormValues>({
    defaultValues: {
      direction: "",
    },
  });

  // Next button click korle ei function data console-e dekhabe
  const onSubmit = (data: MeetingPointFormValues) => {
    console.log("Form Submitted Data:", data);
    alert("Check console for data: " + data.direction);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <AdjustPinContent />
      </form>
    </FormProvider>
  );
};

export default AdjustPin;
