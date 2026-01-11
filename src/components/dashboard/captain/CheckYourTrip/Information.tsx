
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
    <div className="h-screen w-full">
      {/* <div className="lg:pb-10 md:pb-8 pb-6"> */}
      <div className="">
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
          {/* <div className="lg:mt-12 md:mt-10 mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-[#f2a93b] hover:bg-[#e0962d] text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
            >
              Next <span className="text-xl">›</span>
            </button>
          </div> */}
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
