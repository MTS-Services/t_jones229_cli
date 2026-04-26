"use client";

import { Calendar } from "antd";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";

import dayjs, { Dayjs } from "dayjs";
import { MapPin } from "lucide-react";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

type Props = {
  scrolled?: boolean; // optional now
  onActiveChange?: (isActive: boolean) => void;
};

export default function ListBookingSearchBar({
  scrolled,
  onActiveChange,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [guests, setGuests] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    localStorage.setItem("StartDate", formattedDate); // For backward compatibility
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

    router.push(fullUrl);
  };

  useEffect(() => {
    if (onActiveChange) onActiveChange(activeTab !== null);
  }, [activeTab, onActiveChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinations = destinations.filter((d: any) =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full mx-auto relative" ref={containerRef}>
      <div className="relative flex items-center bg-white rounded-full border-2 shadow-sm border-gray-100 py-1 px-1">
        <div className="flex flex-row w-full items-center justify-between">
          {/* WHERE SECTION */}
          <div
            onClick={() => setActiveTab("where")}
            className={`relative flex flex-col items-center justify-center cursor-pointer rounded-full transition-all duration-300 px-2 py-2.5 flex-1 ${
              activeTab === "where"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-black text-[12px] md:text-[13px]">
              Where
            </h1>
            {location && (
              <span className="text-[10px] text-blue-600 font-bold truncate max-w-[50px]">
                {location}
              </span>
            )}

            <AnimatePresence>
              {activeTab === "where" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:left-0 md:right-auto md:w-[320px] bg-white shadow-2xl rounded-[24px] p-6 z-[999] border border-gray-100 mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Search destination"
                    autoFocus
                    className="w-full mb-4 p-2 border-b outline-none text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredDestinations.map((dest: any) => (
                      <div
                        key={dest.city}
                        onClick={() => {
                          setLocation(dest.city);
                          setActiveTab(null);
                        }}
                        className="flex items-center gap-2 my-2 rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="size-7 relative flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                          <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600">
                          {dest.city}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WHEN SECTION */}
          <div
            onClick={() => setActiveTab("when")}
            className={`relative flex flex-col items-center justify-center cursor-pointer rounded-full transition-all duration-300 px-2 py-2.5 flex-1 ${
              activeTab === "when"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-black text-[12px] md:text-[13px]">
              When
            </h1>
            {selectedDate && (
              <span className="text-[10px] text-blue-600 font-bold">
                {selectedDate.format("MMM DD")}
              </span>
            )}

            <AnimatePresence>
              {activeTab === "when" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:left-0 md:-translate-x-1/2 md:w-[320px] bg-white shadow-2xl rounded-3xl p-4 z-[999] border border-gray-100 mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar
                    fullscreen={false}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setActiveTab(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WHO SECTION */}
          <div
            onClick={() => setActiveTab("who")}
            className={`relative flex flex-col items-center justify-center cursor-pointer rounded-full transition-all duration-300 px-2 py-2.5 flex-1 ${
              activeTab === "who"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-black text-[12px] md:text-[13px]">
              Who
            </h1>
            {guests > 0 && (
              <span className="text-[10px] text-blue-600 font-bold">
                {guests}
              </span>
            )}

            <AnimatePresence>
              {activeTab === "who" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:left-0 md:-translate-x-1/2 md:w-64 bg-white p-6 rounded-2xl shadow-2xl z-[999] border border-gray-100 mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Guests</span>
                    <div className="flex items-center gap-3">
                      <CiCircleMinus
                        className="text-2xl cursor-pointer"
                        onClick={() => guests > 0 && setGuests(guests - 1)}
                      />
                      <span className="text-lg">{guests}</span>
                      <GoPlusCircle
                        className="text-2xl cursor-pointer"
                        onClick={() => setGuests(guests + 1)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TYPE SECTION */}
          <div
            onClick={() => setActiveTab("type")}
            className={`relative flex flex-col items-center justify-center cursor-pointer rounded-full transition-all duration-300 px-2 py-2.5 flex-1 ${
              activeTab === "type"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-black text-[12px] md:text-[13px]">
              Type
            </h1>
            <AnimatePresence>
              {activeTab === "type" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:right-0 md:left-0 md:w-80 bg-white shadow-2xl rounded-2xl p-5 z-[999] border border-gray-100 mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    {bookingTypes.map((type, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelected(type);
                          setActiveTab(null);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer ${
                          selected?.value === type.value
                            ? "bg-blue-50 border-blue-500"
                            : "border-gray-100"
                        }`}
                      >
                        <p className="text-sm font-bold text-gray-800">
                          {type.title}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-1">
            <button
              onClick={handleSearch}
              className="bg-[#105d9e] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
            >
              <IoIosSearch className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
