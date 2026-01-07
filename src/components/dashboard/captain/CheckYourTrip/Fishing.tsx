// "use client";

// import { Divider } from "antd";
// import { X } from "lucide-react";
// import React from "react";
// import { BsSearch } from "react-icons/bs";
// // import CheckboxGroup from "./CheckboxGroup";
// import { fishingLocationsOptions } from "@/constant/CheckBoxLevel";

// const fishingTechniquesOptions = [
//   "Light tackle",
//   "Heavy tackle",
//   "Bottom Fishing",
//   "Deep Sea Fishing",
//   "Trolling",
//   "Spinning",
//   "Jigging",
//   "Popping",
//   "Fly fishing",
//   "Drift fishing",
//   "Kite fishing",
//   "Bow fishing",
//   "Spearfishing",
//   "Flounder gigging",
//   "Livebaiting",
//   "Lure Fishing",
// ];

// const policiesOptions = [
//   "Catch and Release",
//   "Keep Catch",
//   "No Smoking",
//   "Alcohol Allowed",
// ];

// const priceInclusionsOptions = [
//   "Bait",
//   "Tackle",
//   "Water",
//   "Snacks",
//   "Lunch",
//   "Ice",
//   "Fuel",
// ];

// const fishingLocationsInitial = ["Lake", "River"];
// const fishingTechniquesInitial = ["Trolling"];
// const policiesInitial = ["Catch and Release"];
// const priceInclusionsInitial = ["Bait", "Water"];

// const FishingUI: React.FC = () => {
//   const staticFilters = ["Salmon", "Tuna", "Bass"];

//   return (
//     <div className="bg-white">
//       {/* Header */}
//       <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
//         <h1 className="text-3xl font-bold text-textPrimary mb-2">Fishing</h1>
//       </div>

//       {/* Targeted Species */}
//       <div className="py-12 px-5 md:px-14">
//         <h1 className="text-xl md:text-3xl font-bold mb-2">Targeted Species</h1>
//         <p className="text-[#878787] mb-4">
//           Choose which species customers can target on your trip.
//         </p>

//         <div className="w-full max-w-md py-6 space-y-4">
//           <div>
//             <div className="flex gap-3 rounded-full py-3 border px-4">
//               <BsSearch className="text-[#e0e0e0] h-6 w-6" />
//               <input
//                 type="text"
//                 placeholder="Search species..."
//                 className="w-full outline-none"
//               />
//             </div>

//             <button className="mt-2 bg-[#ffaa33] text-white px-4 py-2 rounded-md">
//               Add Species
//             </button>
//           </div>

//           {staticFilters.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {staticFilters.map((filter) => (
//                 <div
//                   key={filter}
//                   className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
//                 >
//                   <span>{filter}</span>
//                   <button>
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <Divider />
//       </div>

//       {/* Checkbox Sections */}
//       {/* <div className="px-5 md:px-14 space-y-6">
//         <CheckboxGroup
//           name="fishingLocation"
//           options={fishingLocationsOptions}
//           selectedValues={fishingLocationsInitial}
//         />

//         <CheckboxGroup
//           name="fishingTechnique"
//           options={fishingTechniquesOptions}
//           selectedValues={fishingTechniquesInitial}
//         />

//         <CheckboxGroup
//           name="policies"
//           options={policiesOptions}
//           selectedValues={policiesInitial}
//         />

//         <CheckboxGroup
//           name="includedPrice"
//           options={priceInclusionsOptions}
//           selectedValues={priceInclusionsInitial}
//         />
//       </div> */}
//     </div>
//   );
// };

// export default FishingUI;

"use client";

import { Divider } from "antd";
import { X } from "lucide-react";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";

const FishingUI: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [species, setSpecies] = useState<string[]>(["Bass", "Marlin", "Tuna"]);
  const [searchValue, setSearchValue] = useState("");

  // State for all checkbox sections
  const [formData, setFormData] = useState({
    locations: [] as string[],
    techniques: [] as string[],
    policies: [] as string[],
    included: [] as string[],
  });

  // --- HANDLERS ---
  const addSpecies = () => {
    if (searchValue.trim() && !species.includes(searchValue)) {
      setSpecies([...species, searchValue.trim()]);
      setSearchValue("");
    }
  };

  const toggleItem = (category: keyof typeof formData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }));
  };

  // Function to show data in console
  const handleNext = () => {
    const finalData = {
      targetedSpecies: species,
      ...formData,
    };
    console.log("Form Submitted Data:", finalData);
    // alert("Data has been logged to the console!");
  };

  return (
    <div className="bg-white text-[#333]">
      {/* Targeted Species */}
      <section className="mb-6">
        <h1 className="text-xl font-bold mb-1">Targeted Species</h1>
        <p className="text-sm text-[#878787] mb-4">
          Choose which species customers can target on your trip.
        </p>

        <div className="max-w-xs mb-4">
          <div className="flex items-center gap-3 rounded-full py-2 border px-4 bg-white">
            <BsSearch className="text-[#e0e0e0] h-5 w-5" />
            <input
              type="text"
              placeholder="Search species..."
              className="w-full outline-none text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSpecies()}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {species.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 px-3 py-1 bg-[#f0f4ff] text-[#5b61f1] rounded-full text-xs font-medium border border-[#dce3ff]"
            >
              <span>{s}</span>
              <button
                onClick={() => setSpecies(species.filter((x) => x !== s))}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <Divider className="my-8" />

      {/* Checkbox Sections */}
      <div className="space-y-10">
        {/* Row 1: Locations & Techniques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Locations */}
          <section>
            <h2 className="text-lg font-bold mb-4">Fishing Locations</h2>
            <div className="space-y-3">
              {[
                "River",
                "Lake",
                "Inshore",
                "Nearshore",
                "Offshore",
                "Reef",
                "Wreck",
                "Flats",
                "Backcountry",
              ].map((item) => (
                <CheckboxItem
                  key={item}
                  label={item}
                  checked={formData.locations.includes(item)}
                  onToggle={() => toggleItem("locations", item)}
                />
              ))}
            </div>
          </section>

          {/* Techniques */}
          <section>
            <h2 className="text-lg font-bold mb-4">Fishing Techniques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Light tackle",
                "Heavy tackle",
                "Bottom fishing",
                "Deep sea fishing",
                "Trolling",
                "Spinning",
                "Jigging",
                "Popping",
                "Fly fishing",
                "Drift fishing",
                "Kite fishing",
                "Bowfishing",
                "Handline",
                "Spearfishing",
                "Ice fishing",
                "Flounder gigging",
              ].map((item) => (
                <CheckboxItem
                  key={item}
                  label={item}
                  checked={formData.techniques.includes(item)}
                  onToggle={() => toggleItem("techniques", item)}
                />
              ))}
            </div>
          </section>
        </div>

        <Divider className="my-2" />

        {/* Row 2: Policies & Included */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Policies */}
          <section>
            <h2 className="text-lg font-bold mb-4">Policies</h2>
            <div className="space-y-3">
              {[
                "Children allowed",
                "No Smoking",
                "No Alcohol",
                "Clients Keep Catch",
                "Crew keep catch",
                "Catch and release allowed",
                "Strictly catch and release",
              ].map((item) => (
                <CheckboxItem
                  key={item}
                  label={item}
                  checked={formData.policies.includes(item)}
                  onToggle={() => toggleItem("policies", item)}
                />
              ))}
            </div>
          </section>

          {/* Included in Price */}
          <section>
            <h2 className="text-lg font-bold mb-4">Included in the price</h2>
            <div className="space-y-3">
              {[
                "Fly fishing equipment",
                "Rods, Reels & Terminal tackle",
                "Live bait",
                "Lures",
                "Catch cleaning & Filleting",
                "Snacks",
                "Drinks",
                "Lunch",
                "Fishing License",
              ].map((item) => (
                <CheckboxItem
                  key={item}
                  label={item}
                  checked={formData.included.includes(item)}
                  onToggle={() => toggleItem("included", item)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between border-t pt-8 mt-12">
        <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
          Back
        </button>

        <button
          onClick={handleNext}
          className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-10 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
        >
          Next <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

export default FishingUI;

// --- REUSABLE CHECKBOX COMPONENT ---
interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CheckboxItem: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
}) => (
  <div
    className="flex items-center gap-3 cursor-pointer group select-none"
    onClick={onToggle}
  >
    <div
      className={`w-[18px] h-[18px] rounded border transition-all flex items-center justify-center text-white text-[10px] 
      ${
        checked
          ? "bg-[#5b61f1] border-[#5b61f1]"
          : "bg-white border-gray-300 group-hover:border-blue-400"
      }`}
    >
      {checked && "✓"}
    </div>
    <span
      className={`text-base transition-colors ${
        checked ? "text-[#9E9E9E]" : "text-[#9E9E9E]"
      }`}
    >
      {label}
    </span>
  </div>
);
