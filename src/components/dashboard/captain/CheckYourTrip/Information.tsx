// "use client";

// import { Card, Divider } from "antd";
// import { Upload, Play, ImageIcon, X } from "lucide-react";
// import Image from "next/image";
// import React from "react";

// const Information: React.FC = () => {
//   return (
//     <div className="mx-auto bg-white">
//       <div className="">
//         {/* Listing Details */}
//         <h2 className="text-2xl font-bold mb-6">Listing Details</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           {/* Shared Booking */}
//           <div>
//             <h3 className="text-lg font-medium mb-4">
//               Accept shared bookings?
//             </h3>
//             <div className="flex gap-6">
//               <label className="flex items-center gap-2">
//                 <input type="radio" />
//                 Yes
//               </label>
//               <label className="flex items-center gap-2">
//                 <input type="radio" />
//                 No
//               </label>
//             </div>
//           </div>

//           {/* Angler Capacity */}
//           <div>
//             <label className="block mb-2">Angler Capacity</label>
//             <select className="w-full border px-3 py-2">
//               <option>Angler Capacity</option>
//               {[...Array(10)].map((_, i) => (
//                 <option key={i}>{i + 1}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <Divider />

//         {/* Boat Info */}
//         <h2 className="text-2xl font-bold my-6">Boat Info</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block mb-2">Boat Description</label>
//             <textarea
//               className="w-full border px-3 py-2"
//               placeholder="Short description"
//             />
//           </div>

//           <div>
//             <label className="block mb-2">Manufacturer</label>
//             <input
//               className="w-full border px-3 py-2"
//               placeholder="e.g. Viking"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           <div>
//             <label className="block mb-2">Boat Length (ft)</label>
//             <input className="w-full border px-3 py-2" />
//           </div>

//           <div>
//             <label className="block mb-2">Model Year</label>
//             <input className="w-full border px-3 py-2" />
//           </div>
//         </div>

//         {/* Upload Section */}
//         <h2 className="text-lg font-bold mb-4">Upload Captain ID & Licence</h2>

//         <Card className="border-2 border-dashed bg-[#f5f5f5] max-w-3xl">
//           <div className="text-center py-10 space-y-4">
//             <Upload className="mx-auto h-12 w-12 text-blue-500" />
//             <p>Drag & drop your files</p>
//             <button className="bg-orange-500 text-white px-6 py-2 rounded">
//               Browse to Upload
//             </button>
//           </div>
//         </Card>

//         {/* Uploaded Preview (Static UI) */}
//         <div className="mt-10">
//           <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <Card className="relative">
//               <div className="relative aspect-square bg-gray-200 rounded overflow-hidden">
//                 <Image
//                   src="/placeholder.svg"
//                   alt="preview"
//                   fill
//                   className="object-cover"
//                 />

//                 <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
//                   <X size={14} />
//                 </button>

//                 <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
//                   <ImageIcon size={12} className="inline mr-1" />
//                   image.jpg
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>

//         <Divider className="mt-12" />
//       </div>
//     </div>
//   );
// };

// export default Information;

import React, { useState, ChangeEvent } from "react";
import { FiChevronDown } from "react-icons/fi";

// --- Types ---
interface FormData {
  boatTypeListing: string;
  guestCapacity: string;
  boatInfoType: string;
  manufacturer: string;
  length: string;
  modelYear: string;
  facilities: string[];
  gearAndCrew: string[];
}

const Information: React.FC = () => {
  // State: Initial empty values
  const [formData, setFormData] = useState<FormData>({
    boatTypeListing: "",
    guestCapacity: "",
    boatInfoType: "",
    manufacturer: "",
    length: "",
    modelYear: "",
    facilities: [],
    gearAndCrew: [],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleItem = (category: "facilities" | "gearAndCrew", item: string) => {
    setFormData((prev) => {
      const currentList = prev[category];
      const newList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return { ...prev, [category]: newList };
    });
  };

  const handleNext = () => {
    console.log("Form Submitted Data:", formData);
    // alert("Data logged in console!");
  };

  return (
    // h-screen makes the background cover the full height
    // overflow-y-auto allows scrolling if the form is long
    <div className="h-screen w-full">
      <div className="lg:pb-10 md:pb-8 pb-6">
        <div className="">
          {/* Listing Type */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Listing Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomSelect
                label="What type of boat do you have"
                name="boatTypeListing"
                value={formData.boatTypeListing}
                onChange={handleInputChange}
                options={["Yacht", "Speedboat", "Fishing Boat"]}
                placeholder="Choose boat"
              />
              <CustomSelect
                label="How many guests?"
                name="guestCapacity"
                value={formData.guestCapacity}
                onChange={handleInputChange}
                options={["1-10", "11-20", "20+"]}
                placeholder="Choose guest capacity"
              />
            </div>
          </section>

          <hr className="my-10 border-gray-100" />

          {/* Boat Info */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Boat Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <CustomSelect
                label="Boat type"
                name="boatInfoType"
                value={formData.boatInfoType}
                onChange={handleInputChange}
                options={["Center Console", "Convertible"]}
                placeholder="Choose boat type"
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="e.g Viking"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomSelect
                label="Select length"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                options={["20ft", "40ft", "60ft"]}
                placeholder="Boat length"
              />
              <CustomSelect
                label="Model year"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleInputChange}
                options={["2020", "2021", "2022", "2023"]}
                placeholder="E.g 2016"
              />
            </div>
          </section>

          <hr className="my-10 border-gray-100" />

          {/* Facilities and Gear & Crew */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Facilities
              </h2>
              <div className="space-y-4">
                {[
                  "Toilet",
                  "Kitchen",
                  "Shower",
                  "Wheelchair accessible",
                  "Bed",
                  "Flybridge",
                ].map((item) => (
                  <CheckboxItem
                    key={item}
                    label={item}
                    checked={formData.facilities.includes(item)}
                    onToggle={() => toggleItem("facilities", item)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Gear & Crew
              </h2>
              <div className="space-y-4">
                {[
                  "Fighting Chair",
                  "First Mate",
                  "Livewell/Live Bait Tank",
                  "Spearfishing equipment",
                  "Outriggers",
                  "Downriggers",
                  "Tuna tubes",
                ].map((item) => (
                  <CheckboxItem
                    key={item}
                    label={item}
                    checked={formData.gearAndCrew.includes(item)}
                    onToggle={() => toggleItem("gearAndCrew", item)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Footer Button */}
          <div className="lg:mt-12 md:mt-10 mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
            >
              Next <span className="text-xl">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

interface CustomSelectProps {
  label: string;
  options: string[];
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  placeholder,
  name,
  value,
  onChange,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white text-gray-400 outline-none focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-800">
            {opt}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none text-lg" />
    </div>
  </div>
);

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
      className={`w-5 h-5 rounded border transition-all flex items-center justify-center text-white text-[10px] 
      ${
        checked
          ? "bg-[#5b61f1] border-[#5b61f1]"
          : "bg-white border-gray-300 group-hover:border-blue-300"
      }`}
    >
      {checked && "✓"}
    </div>
    <span
      className={`text-sm transition-colors ${
        checked ? "text-gray-700 font-medium" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

export default Information;
