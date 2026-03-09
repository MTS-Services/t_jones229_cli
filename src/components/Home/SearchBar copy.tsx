"use client";

import { Calendar } from "antd";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import Image from "next/image";
import flag from "@/assets/flag.png";
import dayjs, { Dayjs } from "dayjs";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Added onActiveChange to props definition
export default function SearchBar({
  scrolled,
  onActiveChange,
}: {
  scrolled: boolean;
  onActiveChange?: (isActive: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [guests, setGuests] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const route = useRouter();

  const { data } = useGetBoatListByLocationQuery({});
  const destinations = data?.data || [];

  const bookingTypes = [
    {
      title: "Private booking",
      value: false,
      description: "Hire out your own boat with a captain.",
    },
    {
      title: "Shared booking",
      value: true,
      description: "Join other group bookings to fill a boat.",
    },
  ];

  // Keep expanded by default, compact only when scrolled AND no active tab
  const isExpanded = !scrolled || activeTab !== null;

  const handleSearch = () => {
    const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";

    // Store all search data as a single object for better organization
    const searchData = {
      location: location,
      date: formattedDate,
      startDate: formattedDate, // For backward compatibility
      bookingType: String(selected?.value),
      guests: guests.toString(),
      timestamp: new Date().toISOString(),
    };

    // Store as object in localStorage
    localStorage.setItem("searchData", JSON.stringify(searchData));

    // Keep individual items for backward compatibility (remove these later)
    localStorage.setItem("location", location);
    localStorage.setItem("date", formattedDate);
    localStorage.setItem("StartDate", formattedDate);
    localStorage.setItem("bookingType", String(selected?.value));
    localStorage.setItem("Guests", guests.toString());

    // Build URL parameters
    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (formattedDate) searchParams.set("date", formattedDate);
    if (guests > 0) searchParams.set("guests", guests.toString());
    if (selected) searchParams.set("bookingType", String(selected.value));

    const queryString = searchParams.toString();
    const baseUrl =
      selected?.value === true ? "/group-charter" : "/search-charter";
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    route.push(fullUrl);
  };

  // Signal the parent Navbar when a tab becomes active/inactive
  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(activeTab !== null);
    }
  }, [activeTab, onActiveChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinations = destinations.filter((d: any) =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`w-full mx-auto px-4 transition-all duration-500 ease-in-out ${
        isExpanded ? "max-w-5xl" : "max-w-xl"
      }`}
      ref={containerRef}
    >
      <div
        className={`relative flex flex-col lg:flex-row items-center bg-white rounded-2xl md:rounded-full transition-all duration-500 border-2 shadow-sm ${
          activeTab
            ? "border-gray-100"
            : scrolled
              ? "border-gray-100"
              : "border-gray-100"
        } ${isExpanded ? "py-0" : "py-0"}`}
      >
        <div className="flex flex-col md:flex-row w-full items-center justify-between">
          <div
            onClick={() => setActiveTab("where")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              isExpanded
                ? "px-6 py-3 flex-1"
                : "px-3 py-2.5 items-center flex-[0.8]"
            } 
            ${
              activeTab === "where"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                isExpanded ? "text-[15px]" : "text-[13px]"
              }`}
            >
              Where
            </h1>
            {isExpanded ? (
              <input
                autoFocus={activeTab === "where"}
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="bg-transparent outline-none text-[12px] text-[#858585] w-full"
              />
            ) : (
              location && (
                <span className="text-[10px] text-blue-600 font-bold truncate max-w-[60px]">
                  {location}
                </span>
              )
            )}

            <AnimatePresence>
              {activeTab === "where" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-0 w-[300px] bg-white shadow-2xl rounded-[24px] p-6 z-50 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-tight">
                    Destinations
                  </h2>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((dest: any) => (
                        <div
                          key={dest.city}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(dest.city);
                            setSearchTerm(dest.city);
                            setActiveTab(null);
                          }}
                          className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="size-8 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={flag}
                              alt="flag"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-black">
                              {dest.city}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-4">
                        No destinations found
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
              isExpanded ? "h-8" : "h-4"
            }`}
          ></div>

          <div
            onClick={() => setActiveTab("when")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              isExpanded
                ? "px-6 py-3 flex-1"
                : "px-2 py-1.5 items-center flex-[0.6]"
            } 
            ${
              activeTab === "when"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                isExpanded ? "text-[15px]" : "text-[13px]"
              }`}
            >
              When
            </h1>
            {isExpanded ? (
              <span className="text-[12px] text-[#858585] mt-0.5">
                {selectedDate ? selectedDate.format("MMM DD") : "Add date"}
              </span>
            ) : (
              selectedDate && (
                <span className="text-[10px] text-blue-600 font-bold truncate max-w-[60px]">
                  {selectedDate.format("MMM DD")}
                </span>
              )
            )}

            <AnimatePresence>
              {activeTab === "when" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-0 z-50 bg-white shadow-2xl rounded-3xl p-4 border border-gray-100 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-[300px]">
                    <Calendar
                      fullscreen={false}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setActiveTab(null);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
              isExpanded ? "h-8" : "h-4"
            }`}
          ></div>

          <div
            onClick={() => setActiveTab("who")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              isExpanded
                ? "px-6 py-3 flex-1"
                : "px-2 py-1.5 items-center flex-[0.5]"
            } 
            ${
              activeTab === "who"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                isExpanded ? "text-[15px]" : "text-[13px]"
              }`}
            >
              Who
            </h1>
            {isExpanded ? (
              <span className="text-[12px] text-[#858585] mt-0.5">
                {guests > 0 ? `${guests} Guests` : "Add guests"}
              </span>
            ) : (
              guests > 0 && (
                <span className="text-[10px] text-blue-600 font-bold truncate max-w-[60px]">
                  {guests} Guests
                </span>
              )
            )}

            <AnimatePresence>
              {activeTab === "who" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-1/2 -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl w-64 z-50 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Guests</span>
                    <div className="flex items-center gap-3">
                      <CiCircleMinus
                        onClick={(e) => {
                          e.stopPropagation();
                          guests > 0 && setGuests(guests - 1);
                        }}
                        className="text-3xl text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                      />
                      <span className="text-lg font-medium w-4 text-center">
                        {guests}
                      </span>
                      <GoPlusCircle
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuests(guests + 1);
                        }}
                        className="text-3xl text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
              isExpanded ? "h-8" : "h-4"
            }`}
          ></div>

          <div
            onClick={() => setActiveTab("type")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              isExpanded
                ? "px-6 py-3 flex-1"
                : "px-2 py-1.5 items-center flex-[0.6]"
            } 
            ${
              activeTab === "type"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                isExpanded ? "text-[15px]" : "text-[13px]"
              }`}
            >
              Type
            </h1>
            {isExpanded ? (
              <p className="text-[12px] text-[#858585] truncate mt-0.5">
                {selected ? selected.title : "Select type"}
              </p>
            ) : (
              selected && (
                <span className="text-[10px] text-blue-600 font-bold truncate max-w-[60px]">
                  {selected.title}
                </span>
              )
            )}

            <AnimatePresence>
              {activeTab === "type" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] right-0 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2">
                    {bookingTypes.map((type, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(type);
                          setActiveTab(null);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          selected?.value === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <h3 className="font-bold text-gray-800">
                          {type.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-1.5">
            <button
              onClick={handleSearch}
              className={`flex items-center justify-center bg-[#105d9e] hover:bg-[#0c4a7e] text-white rounded-full transition-all shadow-md active:scale-90 ${
                isExpanded ? "w-24 h-12 lg:w-28 lg:h-14" : "w-8 h-8"
              }`}
            >
              <IoIosSearch
                className={`${isExpanded ? "text-2xl w-6 h-6" : "text-lg"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
