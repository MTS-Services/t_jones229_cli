// "use client";

// import React, { useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";

// const Trips: React.FC = () => {
//   const [days, setDays] = useState({
//     Monday: true,
//     Tuesday: true,
//     Wednesday: true,
//     Thursday: true,
//     Friday: true,
//     Saturday: false,
//     Sunday: false,
//   });

//   const [species, setSpecies] = useState<string[]>([
//     "Shark",
//     "Dolphin",
//     "Tuna",
//   ]);
//   const [newSpecies, setNewSpecies] = useState("");

//   const [bookingType, setBookingType] = useState<"private" | "group">(
//     "private"
//   );

//   // Fix for TS: use keyof typeof days
//   const toggleDay = (day: keyof typeof days) => {
//     setDays((prev) => ({ ...prev, [day]: !prev[day] }));
//   };

//   const removeSpecies = (sp: string) => {
//     setSpecies(species.filter((s) => s !== sp));
//   };

//   const addSpecies = () => {
//     const trimmed = newSpecies.trim();
//     if (trimmed && !species.includes(trimmed)) {
//       setSpecies([...species, trimmed]);
//       setNewSpecies("");
//     }
//   };

//   // State for all checkbox sections
//   const [formData, setFormData] = useState({
//     locations: [] as string[],
//     techniques: [] as string[],
//     policies: [] as string[],
//     included: [] as string[],
//   });

//   const toggleItem = (category: keyof typeof formData, item: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [category]: prev[category].includes(item)
//         ? prev[category].filter((i) => i !== item)
//         : [...prev[category], item],
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
//       {/* Trip Name */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">Trip name</label>
//         <input
//           type="text"
//           placeholder="e.g 6h deep dive fishing"
//           className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//         />
//       </div>

//       {/* Description */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">Description</label>
//         <textarea
//           placeholder="Add a description to this trip"
//           className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//         />
//       </div>

//       {/* Duration */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">Duration</label>
//         <select className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
//           <option>Choose the trip duration</option>
//           <option>2 hours</option>
//           <option>4 hours</option>
//           <option>6 hours</option>
//           <option>Full day</option>
//         </select>
//       </div>

//       {/* Days */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">
//           Select days this trip is available:
//         </label>
//         <div className="flex flex-wrap gap-2">
//           {Object.keys(days).map((day) => (
//             <label key={day} className="flex items-center space-x-1">
//               <input
//                 type="checkbox"
//                 checked={days[day as keyof typeof days]} // TS-safe
//                 onChange={() => toggleDay(day as keyof typeof days)}
//                 className="h-4 w-4"
//               />
//               <span>{day}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Departure Time */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">Departure time</label>
//         <select className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
//           <option>Select what time it starts</option>
//           <option>6:00 AM</option>
//           <option>9:00 AM</option>
//           <option>12:00 PM</option>
//           <option>3:00 PM</option>
//         </select>
//       </div>

//       {/* Price */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">Price</label>
//         <input
//           type="text"
//           placeholder="Enter the price per trip e.g $500"
//           className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//         />
//       </div>

//       {/* Booking Type */}
//       <div className="flex flex-col space-y-1">
//         <label className="font-medium">
//           Shared group bookings or private booking only?
//         </label>
//         <div className="flex gap-4">
//           <label className="flex items-center space-x-1">
//             <input
//               type="radio"
//               checked={bookingType === "private"}
//               onChange={() => setBookingType("private")}
//               className="h-4 w-4"
//             />
//             <span>Private</span>
//           </label>
//           <label className="flex items-center space-x-1">
//             <input
//               type="radio"
//               checked={bookingType === "group"}
//               onChange={() => setBookingType("group")}
//               className="h-4 w-4"
//             />
//             <span>Group booking</span>
//           </label>
//         </div>
//         <p className="text-gray-500 text-sm border rounded p-2">
//           Group bookings allow users to sign up to the trip individually, if the
//           date fills with enough people then the book will be confirmed.
//         </p>
//       </div>
//       {/* Techniques */}
//       <section>
//         <h2 className="text-lg font-bold mb-4">Fishing Techniques</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {[
//             "Light tackle",
//             "Heavy tackle",
//             "Bottom fishing",
//             "Deep sea fishing",
//             "Trolling",
//             "Spinning",
//             "Jigging",
//             "Popping",
//             "Fly fishing",
//             "Drift fishing",
//             "Kite fishing",
//             "Bowfishing",
//             "Handline",
//             "Spearfishing",
//             "Ice fishing",
//             "Flounder gigging",
//           ].map((item) => (
//             <CheckboxItem
//               key={item}
//               label={item}
//               checked={formData.techniques.includes(item)}
//               onToggle={() => toggleItem("techniques", item)}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Targeted Species */}
//       <div className="flex flex-col space-y-2">
//         <label className="font-medium">Targeted Species</label>
//         <div className="flex flex-wrap gap-2">
//           {species.map((sp) => (
//             <span
//               key={sp}
//               className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
//             >
//               {sp}{" "}
//               <AiOutlineClose
//                 className="w-3 h-3 cursor-pointer"
//                 onClick={() => removeSpecies(sp)}
//               />
//             </span>
//           ))}
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex items-center justify-between border-t pt-8 mt-12">
//           <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
//             Back
//           </button>

//           <button
//             // onClick={handleNext}
//             className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-10 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
//           >
//             Next <span className="text-lg">›</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Trips;

// interface CheckboxProps {
//   label: string;
//   checked: boolean;
//   onToggle: () => void;
// }

// const CheckboxItem: React.FC<CheckboxProps> = ({
//   label,
//   checked,
//   onToggle,
// }) => (
//   <div
//     className="flex items-center gap-3 cursor-pointer group select-none"
//     onClick={onToggle}
//   >
//     <div
//       className={`w-[18px] h-[18px] rounded border transition-all flex items-center justify-center text-white text-[10px]
//       ${
//         checked
//           ? "bg-[#5b61f1] border-[#5b61f1]"
//           : "bg-white border-gray-300 group-hover:border-blue-400"
//       }`}
//     >
//       {checked && "✓"}
//     </div>
//     <span
//       className={`text-base transition-colors ${
//         checked ? "text-[#9E9E9E]" : "text-[#9E9E9E]"
//       }`}
//     >
//       {label}
//     </span>
//   </div>
// );

"use client";

import React, { useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

const Trips: React.FC = () => {
  const [days, setDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const [species, setSpecies] = useState<string[]>([
    "Shark",
    "Dolphin",
    "Tuna",
  ]);
  const [bookingType, setBookingType] = useState<"private" | "group">(
    "private"
  );

  const [formData, setFormData] = useState({
    locations: [
      "River",
      "Lake",
      "Inshore",
      "Nearshore",
      "Offshore",
      "Reef",
      "Wrack",
      "Flats",
      "Backcountry",
    ],
    techniques: [
      "Light tackle",
      "Heavy tackle",
      "Bottom Fishing",
      "Deep Sea Fishing",
      "Trolling",
      "Spinning",
      "Jigging",
      "Popping",
      "Fly fishing",
      "Drift fishing",
      "Kite fishing",
      "Bow fishing",
      "Handline",
      "Spearfishing",
      "Ice fishing",
      "Flounder gigging",
    ],
  });

  // Your requested focus/active class string
  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-[#f2a93b] focus:ring-4 focus:ring-[#f2a93b]/10 transition-all duration-300 ease-in-out text-sm";

  const toggleDay = (day: keyof typeof days) => {
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="bg-white text-[#333]">
      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xl font-bold mb-1">Trip name</label>
          <input
            type="text"
            placeholder="e.g 6h deep dive fishing"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xl font-bold mb-1">Description</label>
          <textarea
            rows={4}
            placeholder="Add a description to this trip"
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xl font-bold mb-1">Duration</label>
          <select
            className={inputClass + " bg-white cursor-pointer appearance-none"}
          >
            <option>Choose the trip duration</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold mb-1">
            Select days this trip is available:
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {Object.keys(days).map((day) => (
              <CheckboxItem
                key={day}
                label={day}
                checked={days[day as keyof typeof days]}
                onToggle={() => toggleDay(day as keyof typeof days)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xl font-bold mb-1">Departure time</label>
          <select className={inputClass + " bg-white cursor-pointer"}>
            <option>Select what time it starts</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xl font-bold mb-1">Price</label>
          <input
            type="text"
            placeholder="Enter the price per trip e.g $500"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <label className="text-xl font-bold mb-1">
          Shared group bookings or private booking only?
        </label>
        <div className="flex gap-6">
          <CheckboxItem
            label="Private"
            checked={bookingType === "private"}
            onToggle={() => setBookingType("private")}
          />
          <CheckboxItem
            label="Group booking"
            checked={bookingType === "group"}
            onToggle={() => setBookingType("group")}
          />
        </div>

        <div className="bg-[#f0f4ff] border border-[#d6e0ff] rounded-md p-4">
          <p className="text-lg font-semibold text-[#242424]">
            Please note
            <br />
            <span className="font-normal text-base text-gray-500">
              Group bookings allow users to sign up to the trip individually, if
              the date fills with enough people then the book will be confirmed.
            </span>
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-bold mb-1">Targeted Species</h2>
        <p className="font-normal text-base text-gray-500 -mt-2">
          Choose which species customers can target on your trip.
        </p>

        <div className="relative">
          <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search species..."
            className={
              inputClass +
              " pl-12 rounded-full border-none bg-[#f8f9fa] focus:bg-white"
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {species.map((sp) => (
            <span
              key={sp}
              className="flex items-center gap-2 bg-[#edf2ff] text-[#5b61f1] px-4 py-1.5 rounded-full text-[12px] font-medium border border-[#dce4ff]"
            >
              <AiOutlineClose className="cursor-pointer" /> {sp}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 mt-10 space-y-4">
        <div className="space-y-4">
          <h2 className="text-[16px] font-bold">Fishing Techniques</h2>
          <div className="grid grid-cols-1 gap-3">
            {formData.techniques.map((tech) => (
              <CheckboxItem
                key={tech}
                label={tech}
                checked={true}
                onToggle={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[16px] font-bold">Fishing Locations</h2>
          <div className="grid grid-cols-1 gap-3">
            {formData.locations.map((loc) => (
              <CheckboxItem
                key={loc}
                label={loc}
                checked={true}
                onToggle={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      <button className="mt-8 bg-[#f2a93b] hover:bg-[#e0962d] text-white px-10 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1">
        Add another trip <span className="text-lg">›</span>
      </button>

      <div className="mt-6 bg-[#f0f4ff] border border-[#d6e0ff] rounded-md p-4">
        <p className="text-lg font-semibold text-[#242424]">
          Please note
          <br />
          <span className="font-normal text-base text-gray-500">
            You can add multiple trips, if you wanted to add different durations
            for each trip for example, or allow users to fish different species
            etc.
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-12">
        <button className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
          Back
        </button>
        <button className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-10 py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1">
          Next
        </button>
      </div>
    </div>
  );
};

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
          : "bg-white border-gray-300 group-hover:border-[#5b61f1]"
      }`}
    >
      {checked && "✓"}
    </div>
    <span className="text-base text-[#9E9E9E] group-hover:text-[#5b61f1] transition-colors">
      {label}
    </span>
  </div>
);

export default Trips;
