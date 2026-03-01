"use client";

import { Calendar } from "antd";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import {
  IoCloseOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoBoatOutline,
  IoChevronForwardOutline,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import Image from "next/image";
import flag from "@/assets/flag.png";
import dayjs, { Dayjs } from "dayjs";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

export default function SearchBar({
  scrolled,
  onActiveChange,
}: {
  scrolled: boolean;
  onActiveChange?: (isActive: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeMobileSection, setActiveMobileSection] =
    useState<string>("where");
  const [selected, setSelected] = useState<any>(null);
  const [guests, setGuests] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const isExpanded = !scrolled || activeTab !== null;

  const handleSearch = () => {
    const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
    localStorage.setItem("location", location);
    localStorage.setItem("date", formattedDate);
    localStorage.setItem("StartDate", formattedDate);
    localStorage.setItem("bookingType", String(selected?.value));
    localStorage.setItem("Guests", guests.toString());

    setIsMobileModalOpen(false);
    route.push(
      selected?.value === true
        ? "/group-charter?type=GROUP"
        : "/search-charter",
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    }

    // Only add event listener when there's an active dropdown
    if (activeTab) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeTab]);

  useEffect(() => {
    setMounted(true);
    if (onActiveChange) onActiveChange(activeTab !== null);
  }, [activeTab, onActiveChange]);

  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileModalOpen]);

  const filteredDestinations = useMemo(
    () =>
      destinations.filter((d: any) =>
        d?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [destinations, searchTerm],
  );

  return (
    <>
      {/* --- Mobile Compact Bar --- */}
      <div className="md:hidden w-full px-4 pb-2">
        <div
          onClick={() => setIsMobileModalOpen(true)}
          className={`w-full flex items-center gap-3 bg-white rounded-full shadow-lg border border-gray-200 ${scrolled ? "px-3 py-1" : "px-5 py-1"} cursor-pointer transition-all duration-300`}
        >
          <IoIosSearch className="text-2xl text-gray-700" />
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">
              {location || "Where to?"}
            </p>
            <p className="text-[11px] text-gray-500">
              Anywhere • Any week • Add guests
            </p>
          </div>
        </div>
      </div>

      {/* --- Mobile Full Screen Modal (Using Portal) --- */}
      {mounted &&
        createPortal(
          <div>
            {isMobileModalOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="md:hidden fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col"
                style={{ zIndex: 999999 }}
              >
                {/* Enhanced Header */}
                <div className="bg-white/95 backdrop-blur-sm px-6 py-2 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 mb-1">
                        Find Your Adventure
                      </h2>
                      <p className="text-sm text-gray-500">
                        Search for the perfect fishing trip
                      </p>
                    </div>
                    <button
                      onClick={() => setIsMobileModalOpen(false)}
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      <IoCloseOutline className="text-xl text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="px-4 py-2 bg-white/95 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    {["where", "when", "who", "type"].map((section, index) => {
                      const currentIndex = [
                        "where",
                        "when",
                        "who",
                        "type",
                      ].indexOf(activeMobileSection);
                      return (
                        <div
                          key={section}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            index <= currentIndex
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                  {/* Where Card - Enhanced */}
                  <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow border border-white/70 transition-all duration-300 ${
                      activeMobileSection === "where"
                        ? "p-4 ring-2 ring-blue-100 ring-opacity-30 "
                        : "p-4 cursor-pointer hover:shadow-xl"
                    }`}
                    onClick={() => setActiveMobileSection("where")}
                  >
                    {activeMobileSection === "where" ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <IoLocationOutline className="text-2xl text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800">
                              Where to?
                            </h3>
                            <p className="text-sm text-gray-500">
                              Choose your fishing destination
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search destinations..."
                            value={location}
                            onChange={(e) => {
                              setLocation(e.target.value);
                              setSearchTerm(e.target.value);
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                          {filteredDestinations
                            .slice(0, 6)
                            .map((destination: any, index: number) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation(destination.city);
                                  setActiveMobileSection("when");
                                }}
                                className="w-full flex items-center space-x-2 p-0 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 text-left group"
                              >
                                <div className="p-1 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                                  <Image
                                    src={flag}
                                    alt="flag"
                                    width={20}
                                    height={20}
                                    className="rounded-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800 group-hover:text-blue-700">
                                    {destination.city}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {destination.country}
                                  </p>
                                </div>
                                <IoChevronForwardOutline className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <IoLocationOutline className="text-2xl text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              Where
                            </h3>
                            <p className="text-sm text-gray-500">
                              {location || "Choose destination"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {location && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          <IoChevronForwardOutline className="text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* When Card - Enhanced */}
                  <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 ${
                      activeMobileSection === "when"
                        ? "p-4 ring-2 ring-green-500 ring-opacity-30"
                        : "p-4 cursor-pointer hover:shadow-xl hover:scale-[1.01]"
                    }`}
                    onClick={() => setActiveMobileSection("when")}
                  >
                    {activeMobileSection === "when" ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <IoCalendarOutline className="text-xl text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800">
                              When?
                            </h3>
                            <p className="text-sm text-gray-500">
                              Select your preferred date
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
                          <Calendar
                            fullscreen={false}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setActiveMobileSection("who");
                            }}
                            className="custom-calendar"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="">
                            <IoCalendarOutline className="text-lg text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              When
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selectedDate
                                ? selectedDate.format("MMM DD, YYYY")
                                : "Select date"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedDate && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          <IoChevronForwardOutline className="text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Who Card - Enhanced */}
                  <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 ${
                      activeMobileSection === "who"
                        ? "p-4 ring-2 ring-purple-500 ring-opacity-30"
                        : "p-4 cursor-pointer hover:shadow-xl hover:scale-[1.01]"
                    }`}
                    onClick={() => setActiveMobileSection("who")}
                  >
                    {activeMobileSection === "who" ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="">
                            <IoPeopleOutline className="text-xl text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800">
                              Who's coming?
                            </h3>
                            <p className="text-sm text-gray-500">
                              Add guests to your trip
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800 text-sm">
                              Guests
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGuests(Math.max(0, guests - 1));
                                }}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 active:scale-95 transition-all"
                              >
                                <IoRemoveOutline className="text-gray-600 text-lg" />
                              </button>
                              <div className="w-16 text-center">
                                <span className="text-2xl font-bold text-gray-800">
                                  {guests}
                                </span>
                                <p className="text-xs text-gray-500">
                                  guest{guests !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGuests(guests + 1);
                                }}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 active:scale-95 transition-all"
                              >
                                <IoAddOutline className="text-gray-600 text-lg" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMobileSection("type");
                          }}
                          className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="">
                            <IoPeopleOutline className="text-lg text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              Who
                            </h3>
                            <p className="text-sm text-gray-500 ">
                              {guests > 0
                                ? `${guests} guest${guests > 1 ? "s" : ""}`
                                : "Add guests"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {guests > 0 && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                          <IoChevronForwardOutline className="text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Type Card - Enhanced */}
                  <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 ${
                      activeMobileSection === "type"
                        ? "p-4 ring-2 ring-orange-500 ring-opacity-30"
                        : "p-4 cursor-pointer hover:shadow-xl hover:scale-[1.01]"
                    }`}
                    onClick={() => setActiveMobileSection("type")}
                  >
                    {activeMobileSection === "type" ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="">
                            <IoBoatOutline className="text-xl text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-800">
                              Trip type
                            </h3>
                            <p className="text-sm text-gray-500 ">
                              Choose your booking preference
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {bookingTypes.map((type, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(type);
                              }}
                              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                selected?.value === type.value
                                  ? "border-orange-300 bg-orange-50 ring-2 ring-orange-200 scale-[1.02]"
                                  : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 hover:scale-[1.01]"
                              }`}
                            >
                              <h4 className="font-semibold text-gray-800 text-sm mb-2">
                                {type.title}
                              </h4>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {type.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="">
                            <IoBoatOutline className="text-lg text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              Type
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selected ? selected.title : "Select trip type"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selected && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          <IoChevronForwardOutline className="text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Bottom Search Button */}
                <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100/50">
                  <button
                    onClick={handleSearch}
                    disabled={!location || !selectedDate || !selected}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200"
                  >
                    <IoIosSearch className="text-xl" />
                    {!location || !selectedDate || !selected
                      ? "Complete Fields to Search"
                      : "Search Fishing Trips"}
                  </button>
                  {(!location || !selectedDate || !selected) && (
                    <div className="flex items-center justify-center mt-3 space-x-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${location ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-500">Where</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${selectedDate ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-500">When</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${selected ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-500">Type</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>,
          document.body,
        )}

      {/* --- Desktop Search Bar (Keep your original UI) --- */}
      <div
        className={`hidden md:block w-full mx-auto px-4 transition-all duration-700 ease-in-out ${isExpanded ? "max-w-5xl" : "max-w-xl"}`}
        ref={containerRef}
      >
        <div
          className={`relative flex flex-col lg:flex-row items-center bg-white rounded-full transition-all duration-700 ease-in-out border-2 shadow-sm ${activeTab ? "border-gray-100 shadow-xl" : "border-gray-100"}`}
        >
          <div className="flex flex-row w-full items-center justify-between">
            {/* Desktop Where */}
            <div
              onClick={() => setActiveTab("where")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${isExpanded ? "px-6 py-3 flex-1" : "px-3 py-2.5 items-center flex-[0.8]"} ${activeTab === "where" ? "bg-white shadow-xl z-20 scale-105" : "hover:bg-gray-100 hover:scale-102"}`}
            >
              <h1
                className={`font-extrabold text-black ${isExpanded ? "text-[15px]" : "text-[13px]"}`}
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
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight">
                        Destinations
                      </h2>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredDestinations.map((dest: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setLocation(dest.city);
                            setSearchTerm(dest.city);
                            setActiveTab(null);
                          }}
                          className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                          <div className="size-8 relative bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={flag}
                              alt="flag"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-semibold text-black flex-1">
                            {dest.city}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Clear search to show all destinations
                              setSearchTerm("");
                              setLocation("");
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                          >
                            {(searchTerm || location) && (
                              <MdOutlineClose className="text-gray-400 hover:text-gray-600 text-sm" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-8 bg-gray-200 mx-1" />

            {/* Desktop When */}
            <div
              onClick={() => setActiveTab("when")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${isExpanded ? "px-6 py-3 flex-1" : "px-2 py-1.5 items-center flex-[0.6]"} ${activeTab === "when" ? "bg-white shadow-xl z-20 scale-105" : "hover:bg-gray-100 hover:scale-102"}`}
            >
              <h1 className="font-extrabold text-black">When</h1>
              {isExpanded ? (
                <span className="text-[12px] text-[#858585]">
                  {selectedDate ? selectedDate.format("MMM DD") : "Add date"}
                </span>
              ) : (
                selectedDate && (
                  <span className="text-[10px] text-blue-600 font-bold">
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
                    className="absolute top-[115%] left-0 z-50 bg-white shadow-2xl rounded-3xl p-4 border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Calendar
                      fullscreen={false}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setActiveTab(null);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-8 bg-gray-200 mx-1" />

            {/* Desktop Who */}
            <div
              onClick={() => setActiveTab("who")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${isExpanded ? "px-6 py-3 flex-1" : "px-2 py-1.5 items-center flex-[0.5]"} ${activeTab === "who" ? "bg-white shadow-xl z-20 scale-105" : "hover:bg-gray-100 hover:scale-102"}`}
            >
              <h1 className="font-extrabold text-black">Who</h1>
              {isExpanded ? (
                <span className="text-[12px] text-[#858585]">
                  {guests > 0 ? `${guests} Guests` : "Add guests"}
                </span>
              ) : (
                guests > 0 && (
                  <span className="text-[10px] text-blue-600 font-bold">
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
                      <span className="font-bold">Guests</span>
                      <div className="flex items-center gap-3">
                        <CiCircleMinus
                          onClick={() => guests > 0 && setGuests(guests - 1)}
                          className="text-3xl text-gray-400 hover:text-black cursor-pointer"
                        />
                        <span className="font-bold">{guests}</span>
                        <GoPlusCircle
                          onClick={() => setGuests(guests + 1)}
                          className="text-3xl text-gray-400 hover:text-black cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Type */}
            <div
              onClick={() => setActiveTab("type")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${isExpanded ? "px-6 py-3 flex-1" : "px-2 py-1.5 items-center flex-[0.6]"} ${activeTab === "type" ? "bg-white shadow-xl z-20 scale-105" : "hover:bg-gray-100 hover:scale-102"}`}
            >
              <h1 className="font-extrabold text-black">Type</h1>
              {isExpanded ? (
                <p className="text-[12px] text-[#858585] truncate">
                  {selected ? selected.title : "Select type"}
                </p>
              ) : (
                selected && (
                  <p className="text-[10px] text-blue-600 font-bold truncate max-w-[80px]">
                    {selected.title}
                  </p>
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
                          onClick={() => {
                            setSelected(type);
                            setActiveTab(null);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${selected?.value === type.value ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
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

            {/* Search Button */}
            <div className="p-1.5">
              <button
                onClick={handleSearch}
                className={`flex items-center justify-center bg-[#105d9e] hover:bg-[#0c4a7e] text-white rounded-full transition-all duration-500 ease-in-out shadow-md hover:shadow-xl active:scale-90 ${isExpanded ? "w-24 h-12 lg:w-28 lg:h-14" : "w-10 h-10"}`}
              >
                <IoIosSearch
                  className={`transition-all duration-500 ease-in-out ${isExpanded ? "text-2xl w-6 h-6" : "text-lg"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
