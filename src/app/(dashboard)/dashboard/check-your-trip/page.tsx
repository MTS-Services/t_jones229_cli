// "use client";

// import React, { useState, useEffect } from "react";
// import Information from "@/components/dashboard/captain/CheckYourTrip/Information";
// import PhotosVideos from "@/components/dashboard/captain/CheckYourTrip/PhotosVideos";
// import Fishing from "@/components/dashboard/captain/CheckYourTrip/Fishing";
// import MeetingPoint from "@/components/dashboard/captain/CheckYourTrip/MeetingPoint";
// import Description from "@/components/dashboard/captain/CheckYourTrip/Description";
// import Trips from "@/components/dashboard/captain/CheckYourTrip/Trips";
// import Terms from "@/components/dashboard/captain/CheckYourTrip/Terms";
// import MeetingPointMap from "@/components/dashboard/captain/CheckYourTrip/MeetingPointMap";

// /* ================= Tabs & Heading Data (Same as before) ================= */
// const tabs = [
//   { id: 1, title: "Information", component: <Information /> },
//   { id: 2, title: "Photos & Videos", component: <PhotosVideos /> },
//   { id: 3, title: "Fishing", component: <Fishing /> },
//   { id: 4, title: "Meeting Point", component: <MeetingPoint /> },
//   { id: 4, title: "", component: <MeetingPointMap /> },
//   { id: 5, title: "Description", component: <Description /> },
//   { id: 6, title: "Trips", component: <Trips /> },
//   { id: 7, title: "Terms", component: <Terms /> },
// ];

// const heading = [
//   {
//     id: 1,
//     title: "Information",
//     description: "Complete the account set up below before you list your boat.",
//   },
//   {
//     id: 2,
//     title: "Photos & Videos",
//     description: "Upload high quality photos and videos.",
//   },
//   {
//     id: 3,
//     title: "Fishing",
//     description: "Specify your fishing techniques and gear.",
//   },
//   {
//     id: 4,
//     title: "Meeting Point",
//     description: "Set the location where customers will meet you.",
//   },
//   {
//     id: 5,
//     title: "Description",
//     description: "Add a detailed description of your services.",
//   },
//   {
//     id: 6,
//     title: "Trips",
//     description: "Here you can list variations to your trips.",
//   },
//   {
//     id: 7,
//     title: "Terms & Pricing",
//     description: "Before listing your boat, review our subscription terms.",
//   },
// ];

// const Page: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<number>(1);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const savedTab = localStorage.getItem("activeListingTab");
//     if (savedTab) {
//       setActiveTab(parseInt(savedTab));
//     }
//     setIsLoaded(true);
//   }, []);

//   useEffect(() => {
//     if (isLoaded) {
//       localStorage.setItem("activeListingTab", activeTab.toString());
//     }
//   }, [activeTab, isLoaded]);

//   const currentTab = tabs.find((tab) => tab.id === activeTab);
//   const currentHeading = heading.find((h) => h.id === activeTab);

//   const handleNext = () => {
//     if (activeTab < tabs.length) setActiveTab((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     if (activeTab > 1) setActiveTab((prev) => prev - 1);
//   };

//   const handleConfirm = () => {
//     alert("Form Submitted Successfully!");
//     localStorage.removeItem("activeListingTab");
//   };

//   if (!isLoaded) return null;

//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-white">
//       {/* ================= STATIC HEADER & TABS ================= */}
//       <div className="flex-none z-50">
//         <div className="bg-[#d3d2d2] lg:px-10 md:px-8 px-6 lg:py-5 md:py-4 py-3">
//           <h1 className="text-3xl font-bold text-textPrimary mb-2">
//             {currentHeading?.title}
//           </h1>
//           <p className="text-base text-textPrimary">
//             {currentHeading?.description}
//           </p>
//         </div>

//         <div className="border-b bg-gray-100 border-gray-300 lg:px-10 md:px-8 px-6">
//           <div className="flex overflow-x-auto scrollbar-hide">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-2 px-4 mr-4 font-medium transition whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? "border-b-2 border-blue-600 text-blue-600"
//                     : "text-gray-600 hover:text-blue-500"
//                 }`}
//               >
//                 {tab.title}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= SCROLLABLE CONTENT AREA ================= */}
//       <div className="flex-1 overflow-y-auto lg:px-10 md:px-8 px-6 py-6">
//         <div className="">{currentTab?.component}</div>

//         <div className="flex items-center justify-between border-t mt-10 pt-8 pb-10">
//           {activeTab > 1 ? (
//             <button
//               onClick={handleBack}
//               className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-100 transition-all font-medium"
//             >
//               ‹ Back
//             </button>
//           ) : (
//             <div></div>
//           )}

//           {activeTab === tabs.length ? (
//             <button
//               onClick={handleConfirm}
//               className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md"
//             >
//               Confirm Listing
//             </button>
//           ) : (
//             <button
//               onClick={handleNext}
//               className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md"
//             >
//               Next ›
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

// MultiStepFormStep.tsx

"use client";

import MultiStepFormContent from "@/components/dashboard/captain/CheckYourTrip/MultiStepFormContent";
import { FormProvider } from "@/components/List-boat-form/FormProvider";
// import { Suspense } from "react";

const Page: React.FC = () => {
  return (
    <FormProvider>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <MultiStepFormContent />
      {/* </Suspense> */}
    </FormProvider>
  );
};

// Change "page" to "Page" to match the definition above
export default Page;
