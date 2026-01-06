// "use client";

// import React, { useState } from "react";
// import Information from "@/components/dashboard/captain/CheckYourTrip/Information";
// import PhotosVideos from "@/components/dashboard/captain/CheckYourTrip/PhotosVideos";
// import Fishing from "@/components/dashboard/captain/CheckYourTrip/Fishing";
// import MeetingPoint from "@/components/dashboard/captain/CheckYourTrip/MeetingPoint";
// import Description from "@/components/dashboard/captain/CheckYourTrip/Description";
// import Trips from "@/components/dashboard/captain/CheckYourTrip/Trips";
// import Terms from "@/components/dashboard/captain/CheckYourTrip/Terms";

// const tabs = [
//   { id: 1, title: "Information", component: <Information /> },
//   { id: 2, title: "Photos & Videos", component: <PhotosVideos /> },
//   { id: 3, title: "Fishing", component: <Fishing /> },
//   { id: 4, title: "Meeting Point", component: <MeetingPoint /> },
//   { id: 5, title: "Description", component: <Description /> },
//   { id: 6, title: "Trips", component: <Trips /> },
//   { id: 7, title: "Terms", component: <Terms /> },
// ];

// const heading = [
//   {
//     id: 1,
//     title: "Information",
//     description:
//       "Complete the account set up below before you list your boat, we will then review and verify your listing.",
//   },
//   {
//     id: 2,
//     title: "Photos and Videos",
//     description:
//       "Upload high quality photos and videos to maximise conversion rates with potential customers.",
//   },
//   {
//     id: 3,
//     title: "Fishing",
//     description:
//       "Upload high quality photos and videos to maximise conversion rates with potential customers. ",
//   },
//   {
//     id: 4,
//     title: "Meeting Point",
//     description:
//       "Upload high quality photos and videos to maximise conversion rates with potential customers. ",
//   },
//   {
//     id: 5,
//     title: "Description",
//     description:
//       "Add a description on your listing page, customers will see this so ensure to add as much information as possible.",
//   },
//   {
//     id: 6,
//     title: "Trips",
//     description: "Here you can list variations to your trips",
//   },
//   {
//     id: 7,
//     title: "Terms & Pricing",
//     description: "Before listing your boat, review our subscription terms.",
//   },
// ];

// const Page: React.FC = () => {
//   const [activeTab, setActiveTab] = useState(1);

//   // Get the active tab object
//   const currentTab = tabs.find((tab) => tab.id === activeTab);

//   return (
//     <div>
//       {/* Header */}
//       <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
//         <h1 className="text-3xl font-bold text-textPrimary mb-2">
//           Information
//         </h1>
//         <p className="text-base text-textPrimary">
//           Please provide basic information about your boat.
//         </p>
//       </div>

//       <div className=""></div>
//       {/* Tabs */}
//       <div className="flex border-b border-gray-300 mt-6 ml-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`py-2 px-4 mr-4 font-medium ${
//               activeTab === tab.id
//                 ? "border-b-2 border-blue-600 text-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             {tab.title}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="p-6 ml-6">{currentTab && currentTab.component}</div>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useState } from "react";
import Information from "@/components/dashboard/captain/CheckYourTrip/Information";
import PhotosVideos from "@/components/dashboard/captain/CheckYourTrip/PhotosVideos";
import Fishing from "@/components/dashboard/captain/CheckYourTrip/Fishing";
import MeetingPoint from "@/components/dashboard/captain/CheckYourTrip/MeetingPoint";
import Description from "@/components/dashboard/captain/CheckYourTrip/Description";
import Trips from "@/components/dashboard/captain/CheckYourTrip/Trips";
import Terms from "@/components/dashboard/captain/CheckYourTrip/Terms";

/* ================= Tabs Data ================= */
const tabs = [
  { id: 1, title: "Information", component: <Information /> },
  { id: 2, title: "Photos & Videos", component: <PhotosVideos /> },
  { id: 3, title: "Fishing", component: <Fishing /> },
  { id: 4, title: "Meeting Point", component: <MeetingPoint /> },
  { id: 5, title: "Description", component: <Description /> },
  { id: 6, title: "Trips", component: <Trips /> },
  { id: 7, title: "Terms", component: <Terms /> },
];

/* ================= Heading Data ================= */
const heading = [
  {
    id: 1,
    title: "Information",
    description:
      "Complete the account set up below before you list your boat, we will then review and verify your listing.",
  },
  {
    id: 2,
    title: "Photos & Videos",
    description:
      "Upload high quality photos and videos to maximise conversion rates with potential customers.",
  },
  {
    id: 3,
    title: "Fishing",
    description:
      "Upload high quality photos and videos to maximise conversion rates with potential customers.",
  },
  {
    id: 4,
    title: "Meeting Point",
    description:
      "Upload high quality photos and videos to maximise conversion rates with potential customers.",
  },
  {
    id: 5,
    title: "Description",
    description:
      "Add a description on your listing page, customers will see this so ensure to add as much information as possible.",
  },
  {
    id: 6,
    title: "Trips",
    description: "Here you can list variations to your trips",
  },
  {
    id: 7,
    title: "Terms & Pricing",
    description: "Before listing your boat, review our subscription terms.",
  },
];

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const currentHeading = heading.find((h) => h.id === activeTab);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* ================= STATIC SECTION (Header + Tabs) ================= */}
      <div className="flex-none z-50">
        {/* Header */}
        <div className="bg-[#d3d2d2] lg:px-10 md:px-8 px-6 lg:py-5 md:py-4 py-3">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            {currentHeading?.title}
          </h1>
          <p className="text-base text-textPrimary">
            {currentHeading?.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-100 border-gray-300 lg:px-10 md:px-8 px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 mr-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SCROLLABLE CONTENT AREA ================= */}
      <div className="flex-1 overflow-y-auto lg:px-10 md:px-8 px-6 py-6">
        <div className="">{currentTab?.component}</div>
      </div>
    </div>
  );
};

export default Page;
