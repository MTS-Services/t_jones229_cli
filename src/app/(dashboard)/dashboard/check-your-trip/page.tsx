"use client";

import React, { useState } from "react";
import Information from "@/components/dashboard/captain/CheckYourTrip/Information";
import PhotosVideos from "@/components/dashboard/captain/CheckYourTrip/PhotosVideos";
import Fishing from "@/components/dashboard/captain/CheckYourTrip/Fishing";
import MeetingPoint from "@/components/dashboard/captain/CheckYourTrip/MeetingPoint";
import Description from "@/components/dashboard/captain/CheckYourTrip/Description";
import Trips from "@/components/dashboard/captain/CheckYourTrip/Trips";
import Terms from "@/components/dashboard/captain/CheckYourTrip/Terms";

const tabs = [
  { id: 1, title: "Information", component: <Information /> },
  { id: 2, title: "Photos & Videos", component: <PhotosVideos /> },
  { id: 3, title: "Fishing", component: <Fishing /> },
  { id: 4, title: "Meeting Point", component: <MeetingPoint /> },
  { id: 5, title: "Description", component: <Description /> },
  { id: 6, title: "Trips", component: <Trips /> },
  { id: 7, title: "Terms", component: <Terms /> },
];

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  // Get the active tab object
  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mt-6 ml-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 mr-4 font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 ml-6">{currentTab && currentTab.component}</div>
    </div>
  );
};

export default Page;
