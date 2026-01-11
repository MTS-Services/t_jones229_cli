// "use client";

// import board from "@/assets/boart.svg";
// import { stepsData } from "@/constant/stepsData";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import Button from "../ReUsible/Button";

// export default function StepsSection() {
//   const router = useRouter();

//   return (
//     <section className="w-full bg-white pb-16 px-4 container mx-auto">
//       <ToastContainer />
//       <div className=" mx-auto flex flex-col items-center space-y-12">
//         <div className="w-full flex flex-col md:flex-row gap-10 justify-between items-start relative">
//           {/* horizontal line */}
//           <div className="absolute top-10 left-10 md:w-[500px] lg:w-[700px] xl:w-[800px] h-[2px] bg-gray-300 z-0" />

//           {stepsData?.map((step) => (
//             <div
//               key={step.id}
//               className="flex flex-col justify-start z-10 border md:border-none py-5 w-full"
//             >
//               {/* Step dot */}

//               <div className="w-24  flex items-center justify-center">
//                 <div className="w-12 h-12 rounded-full bg-[#ff9500] mb-2" />
//               </div>

//               {/* Step text */}
//               <div className="px-8 w-full">
//                 <div className=" text-base md:text-lg font-normal leding-[52px] text-black py-3">
//                   STEP {step.id}
//                 </div>

//                 <div className="text-lg md:text-2xl font-bold leding-[52px] text-black  mt-1">
//                   {step.title}
//                 </div>

//                 <p className="text-[#878787] text-sm md:text-lg font-normal leading-7  mt-1 w-full">
//                   ({step.description})
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Button
//         link={"/boat-list-form/Information"}
//         // onClick={handleClicked}
//         variant="primary"
//         className="flex items-center gap-1 font-satoshi rounded-[14px] text-base font-bold w-64 mt-7"
//       >
//         <Image
//           className="flex-1 h-3 md:h-6 w-3 md:w-6 "
//           src={board}
//           alt=""
//           height={100}
//           width={100}
//         />
//         Click here to get started!
//       </Button>
//     </section>
//   );
// }

"use client";

import { stepsData } from "@/constant/stepsData";
import { useRouter } from "next/navigation";

export default function StepsSection() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#f8fafc] lg:py-16 md:py-12 py-8 overflow-hidden">
      <div className="container mx-auto xl:px-6 lg:px-5 md:px-4 px-3">
        {/* Header Section */}
        <div className="md:mb-10 mb-7 text-center">
          <h2 className="lg:text-4xl md:text-3xl text-2xl font-black text-slate-900 md:mb-4 mb-2.5">
            How it works
          </h2>
          <div className="h-1.5 w-24 bg-[#0f5d9e] mx-auto rounded-full" />
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 md:gap-6.5 gap-5">
          {stepsData?.map((step, index) => {
            // Logic to check if it's the 3rd item in a 2-column layout
            const isLast = index === stepsData.length - 1;

            return (
              <div
                key={step.id}
                className={`group relative bg-white p-8 rounded-xl shadow-sm transition-all duration-300 border border-slate-100
                ${
                  isLast
                    ? "md:col-span-2 lg:col-span-1 md:w-[360px] md:mx-auto lg:max-w-full"
                    : ""
                }`}
              >
                {/* Large Background Number */}
                <span className="absolute top-4 right-6 lg:text-7xl md:text-6xl text-5xl font-black group-hover:text-[#d0dfeb] text-[#0f5d9e] transition-colors">
                  0{index + 1}
                </span>

                {/* Icon / Dot */}
                <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#0f5d9e] transition-colors duration-300">
                  <span className="text-black text-white font-bold text-xl">
                    {step.id}
                  </span>
                </div>

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>

                {/* Connector - Note: logic changed to only show if not last AND not centered item */}
                {index !== stepsData.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 border-t-2 border-dashed border-slate-200 z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
