"use client";

import { Calendar } from "antd";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
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
          <AnimatePresence>
            {isMobileModalOpen && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="md:hidden fixed inset-0 bg-[#F7F7F7] flex flex-col"
                style={{ zIndex: 999999 }}
              >
                {/* Header */}
                <div className="bg-white px-4 pt-4 pb-2">
                  <div className="flex items-center relative h-10">
                    <button
                      onClick={() => setIsMobileModalOpen(false)}
                      className="absolute left-0 p-1.5 border border-gray-300 rounded-full"
                    >
                      <IoCloseOutline className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-24">
                  {/* Where Card */}
                  <div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all ${activeMobileSection === "where" ? "p-4" : "p-3 flex justify-between items-center cursor-pointer"}`}
                    onClick={() => setActiveMobileSection("where")}
                  >
                    {activeMobileSection === "where" ? (
                      <>
                        <h2 className="text-xl font-bold mb-3">Where to?</h2>
                        <div className="relative mb-3">
                          <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search destinations"
                            value={location}
                            onChange={(e) => {
                              setLocation(e.target.value);
                              setSearchTerm(e.target.value);
                            }}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 ring-black text-sm"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                          {filteredDestinations.map((dest: any, i: number) => (
                            <div
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(dest.city);
                                setActiveMobileSection("when");
                              }}
                              className="flex items-center gap-3 py-2.5 border-b border-gray-50 active:bg-gray-50"
                            >
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Image
                                  src={flag}
                                  alt="flag"
                                  width={20}
                                  height={20}
                                />
                              </div>
                              <span className="font-semibold text-gray-700 text-sm">
                                {dest.city}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm font-medium">
                          Where
                        </span>
                        <span className="font-bold text-xs">
                          {location || "Add destination"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* When Card */}
                  <div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all ${activeMobileSection === "when" ? "p-4" : "p-3 flex justify-between items-center cursor-pointer"}`}
                    onClick={() => setActiveMobileSection("when")}
                  >
                    {activeMobileSection === "when" ? (
                      <>
                        <h2 className="text-xl font-bold mb-3">When</h2>
                        <div className="scale-95 origin-top">
                          <Calendar
                            fullscreen={false}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setActiveMobileSection("who");
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm font-medium">
                          When
                        </span>
                        <span className="font-bold text-xs">
                          {selectedDate
                            ? selectedDate.format("MMM DD")
                            : "Add dates"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Who Card */}
                  <div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all ${activeMobileSection === "who" ? "p-4" : "p-3 flex justify-between items-center cursor-pointer"}`}
                    onClick={() => setActiveMobileSection("who")}
                  >
                    {activeMobileSection === "who" ? (
                      <>
                        <h2 className="text-xl font-bold mb-3">Who</h2>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-base font-bold">Guests</span>
                          <div className="flex items-center gap-4">
                            <CiCircleMinus
                              onClick={(e) => {
                                e.stopPropagation();
                                guests > 0 && setGuests(guests - 1);
                              }}
                              className="text-3xl text-gray-300 active:text-black cursor-pointer"
                            />
                            <span className="text-lg font-bold w-4 text-center">
                              {guests}
                            </span>
                            <GoPlusCircle
                              onClick={(e) => {
                                e.stopPropagation();
                                setGuests(guests + 1);
                              }}
                              className="text-3xl text-gray-300 active:text-black cursor-pointer"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm font-medium">
                          Who
                        </span>
                        <span className="font-bold text-xs">
                          {guests > 0 ? `${guests} guests` : "Add guests"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Type Card */}
                  <div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all ${activeMobileSection === "type" ? "p-4" : "p-3 flex justify-between items-center cursor-pointer"}`}
                    onClick={() => setActiveMobileSection("type")}
                  >
                    {activeMobileSection === "type" ? (
                      <>
                        <h2 className="text-xl font-bold mb-3">Type</h2>
                        <div className="space-y-2.5">
                          {bookingTypes.map((type, index) => (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(type);
                              }}
                              className={`p-3.5 rounded-xl border-2 transition-all ${
                                selected?.value === type.value
                                  ? "border-[#105d9e] bg-blue-50"
                                  : "border-gray-100 bg-gray-50"
                              }`}
                            >
                              <h3 className="font-bold text-gray-800 text-sm">
                                {type.title}
                              </h3>
                              <p className="text-[11px] text-gray-500 leading-tight">
                                {type.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm font-medium">
                          Type
                        </span>
                        <span className="font-bold text-xs">
                          {selected ? selected.title : "Select type"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Search Bar (Simplified) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <button
                    onClick={handleSearch}
                    className="w-full py-3 bg-[#105d9e] text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <IoIosSearch className="text-xl" />
                    Search
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
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
