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
  scrolled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
};

export default function ListBookingSearchBar({
  scrolled = false,
  onActiveChange,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [guests, setGuests] = useState(0);
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

    localStorage.setItem("location", location);
    localStorage.setItem("date", formattedDate);
    localStorage.setItem("bookingType", String(selected?.value));
    localStorage.setItem("Guests", guests.toString());

    router.push(
      selected?.value === true ? "/group-charter?type=GROUP" : "/search-charter"
    );
  };

  useEffect(() => {
    onActiveChange?.(activeTab !== null);
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
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="w-full mx-auto px-4 relative">
      <div
        className={`relative flex items-center bg-white rounded-full border-2 py-1 px-1 transition-all duration-300
        ${scrolled ? "shadow-lg" : "shadow-sm"} border-gray-100`}
      >
        <div className="flex w-full items-center justify-between">
          {/* WHERE */}
          <div
            onClick={() => setActiveTab("where")}
            className={`flex-1 text-center cursor-pointer rounded-full px-2 py-1.5 ${
              activeTab === "where"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-[12px]">Where</h1>
            {location && (
              <span className="text-[10px] text-blue-600 font-bold">
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
                  className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:w-[320px] bg-white shadow-2xl rounded-2xl p-6 z-[999]"
                >
                  <input
                    placeholder="Search destination"
                    className="w-full mb-4 border-b outline-none text-sm"
                    autoFocus
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {filteredDestinations.map((dest: any) => (
                    <div
                      key={dest.city}
                      onClick={() => {
                        setLocation(dest.city);
                        setActiveTab(null);
                      }}
                      className="flex gap-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <Image src={flag} alt="flag" width={24} height={24} />
                      <p className="font-semibold">{dest.city}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WHEN */}
          <div
            onClick={() => setActiveTab("when")}
            className={`flex-1 text-center cursor-pointer rounded-full px-2 py-1.5 ${
              activeTab === "when"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-[12px]">When</h1>
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
                  className="fixed md:absolute top-[80px] md:top-[120%] bg-white p-4 rounded-2xl shadow-2xl z-[999]"
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

          {/* WHO */}
          <div
            onClick={() => setActiveTab("who")}
            className={`flex-1 text-center cursor-pointer rounded-full px-2 py-1.5 ${
              activeTab === "who"
                ? "bg-white shadow-md z-20"
                : "hover:bg-gray-50"
            }`}
          >
            <h1 className="font-extrabold text-[12px]">Who</h1>
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
                  className="fixed md:absolute top-[80px] md:top-[120%] bg-white p-6 rounded-2xl shadow-2xl z-[999]"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Guests</span>
                    <div className="flex items-center gap-3">
                      <CiCircleMinus
                        className="text-2xl cursor-pointer"
                        onClick={() => guests > 0 && setGuests(guests - 1)}
                      />
                      <span>{guests}</span>
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

          {/* SEARCH */}
          <button
            onClick={handleSearch}
            className="bg-[#105d9e] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          >
            <IoIosSearch />
          </button>
        </div>
      </div>
    </div>
  );
}
