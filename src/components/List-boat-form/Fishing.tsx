// "use client";

// import { Divider } from "antd";
// import { X } from "lucide-react";
// import React, { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { BsSearch } from "react-icons/bs";
// import CheckboxGroup from "./CheckboxGroup";
// import { fishingLocationsOptions } from "@/constant/CheckBoxLevel";

// // Options and initial values for each section

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

// export default function Fishing() {
//   const { register, setValue } = useFormContext();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<string[]>([]);

//   const removeFilter = (filterToRemove: string) => {
//     setFilters(filters.filter((filter) => filter !== filterToRemove));
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (searchQuery.trim() && !filters.includes(searchQuery.trim())) {
//       setFilters([...filters, searchQuery.trim()]);
//       setValue("fishingSpecies", [...filters, searchQuery.trim()]); // Update form state with new filter
//     }

//     setSearchQuery("");
//   };

//   return (
//     <div className="bg-white">
//       {/* Header */}
//       <div className="bg-[#F5F5F5] pt-16 md:pt-0 px-5 md:px-14 py-9">
//         <h1 className="text-3xl font-bold text-textPrimary leading-normal mb-2">
//           Fishing
//         </h1>
//         {/* <p className="text-base text-textPrimary font-normal leading-normal">
//           Upload high quality photos and videos to maximise conversion rates
//           with potential customers.
//         </p> */}
//       </div>

//       {/* Targeted Species */}
//       <div className="py-12 px-5 md:px-14">
//         <div>
//           <h1 className="text-xl md:text-3xl font-bold text-textPrimary leading-normal mb-2">
//             Targeted Species
//           </h1>
//           <p className="text-base font-normal text-[#878787] mb-4">
//             Choose which species customers can target on your trip.
//           </p>

//           <form className="w-full max-w-md py-6 space-y-4">
//             <div>
//               <div className="flex gap-3 custom-shadow rounded-full py-3 border border-[#F5F5F5] px-4">
//                 <BsSearch className="text-[#e0e0e0] h-6 w-6" />
//                 <input
//                   type="text"
//                   placeholder="Search species..."
//                   value={searchQuery}
//                   onChange={(e) => {
//                     e.preventDefault();
//                     setSearchQuery(e.target.value);
//                   }}
//                   className="w-full outline-none text-base"
//                 />
//               </div>
//               <button
//                 // type="button"
//                 onClick={handleSearch}
//                 className="mt-2 bg-[#ffaa33] text-white px-4 py-2 rounded-md hover:bg-[#ff9900] transition-colors"
//               >
//                 Add Species
//               </button>
//             </div>

//             {filters.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {filters.map((filter) => (
//                   <div
//                     key={filter}
//                     className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
//                   >
//                     <span>{filter}</span>
//                     <button
//                       type="button"
//                       className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
//                       onClick={() => removeFilter(filter)}
//                       aria-label={`Remove ${filter} filter`}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </form>
//         </div>

//         <Divider style={{ borderColor: "#d9d9d9" }} className="my-4" />
//       </div>

//       {/* Checkbox Sections */}
//       <div className=" px-5 md:px-14">
//         <div className="mb-8">
//           <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
//             Fishing Locations
//           </h2>
//           <CheckboxGroup
//             name="fishingLocation"
//             options={fishingLocationsOptions}
//             selectedValues={fishingLocationsInitial}
//             register={register}
//           />
//         </div>

//         <div className="mb-8">
//           <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
//             Fishing Techniques
//           </h2>
//           <CheckboxGroup
//             name="fishingTechnique"
//             options={fishingTechniquesOptions}
//             selectedValues={fishingTechniquesInitial}
//             register={register}
//           />
//         </div>

//         <div className="mb-8">
//           <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
//             Policies
//           </h2>
//           <CheckboxGroup
//             name="policies"
//             options={policiesOptions}
//             selectedValues={policiesInitial}
//             register={register}
//           />
//         </div>

//         <div className="mb-8">
//           <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
//             Included in the Price
//           </h2>
//           <CheckboxGroup
//             name="includedPrice"
//             options={priceInclusionsOptions}
//             selectedValues={priceInclusionsInitial}
//             register={register}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Divider } from "antd";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsSearch } from "react-icons/bs";
import CheckboxGroup from "./CheckboxGroup";
import { fishingLocationsOptions } from "@/constant/CheckBoxLevel";

const fishingTechniquesOptions = [
  "Light tackle",
  "Heavy tackle",
  "Bottom Fishing",
  "Deep Sea Fishing",
  "Trolling",
  "Spinning",
  "Jigging",
  "Popping",
  "Fly fishing",
];

const policiesOptions = [
  "Catch and Release",
  "Keep Catch",
  "No Smoking",
  "Alcohol Allowed",
];

const priceInclusionsOptions = [
  "Bait",
  "Tackle",
  "Water",
  "Snacks",
  "Lunch",
  "Ice",
];

export default function Fishing() {
  const { register, setValue } = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const addSpecies = () => {
    if (!searchQuery.trim()) return;

    const updated = [...filters, searchQuery];
    setFilters(updated);
    setValue("fishingSpecies", updated);

    setSearchQuery("");
  };

  const removeSpecies = (value: string) => {
    const updated = filters.filter((f) => f !== value);
    setFilters(updated);
    setValue("fishingSpecies", updated);
  };

  return (
    <div className="bg-white">
      <div className="">
        <h2 className="text-xl font-bold mb-2">Targeted Species</h2>

        <div className="max-w-md">
          <div className="flex gap-3 border rounded-full px-4 py-2">
            <BsSearch className="text-gray-300" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search species..."
              className="w-full outline-none"
            />
          </div>

          <button
            type="button"
            onClick={addSpecies}
            className="mt-2 bg-orange-400 text-white px-4 py-2 rounded"
          >
            Add Species
          </button>

          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
              >
                {item}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSpecies(item)}
                />
              </span>
            ))}
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <CheckboxGroup
            title="Fishing Locations"
            name="fishingLocation"
            options={fishingLocationsOptions}
            register={register}
          />

          <CheckboxGroup
            title="Fishing Techniques"
            name="fishingTechnique"
            options={fishingTechniquesOptions}
            register={register}
          />

          <CheckboxGroup
            title="Included in Price"
            name="includedPrice"
            options={priceInclusionsOptions}
            register={register}
          />

          <CheckboxGroup
            title="Policies"
            name="policies"
            options={policiesOptions}
            register={register}
          />
        </div>
      </div>
    </div>
  );
}
