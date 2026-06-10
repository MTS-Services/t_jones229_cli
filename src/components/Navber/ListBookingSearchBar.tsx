"use client";

import { Calendar } from "antd";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { SearchButtonSpinner } from "@/components/ui/Loader";
import { markCharterSearchPending } from "@/lib/searchLoading";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import dayjs, { Dayjs } from "dayjs";
import { MapPin } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */

const SEARCH_DATA_KEY = "searchData";

const BOOKING_TYPES = [
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
] as const;

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

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */

type BookingType = (typeof BOOKING_TYPES)[number];

type SearchData = {
  location: string;
  date: string;
  startDate: string;
  bookingType: string;
  guests: string;
  timestamp: string;
};

type Props = {
  scrolled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
};

/* ─────────────────────────────────────────────────────────────────
   LOCAL STORAGE HELPERS
───────────────────────────────────────────────────────────────── */

function readSearchData(): Partial<SearchData> {
  try {
    const raw = localStorage.getItem(SEARCH_DATA_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSearchData(data: SearchData): void {
  localStorage.setItem(SEARCH_DATA_KEY, JSON.stringify(data));
}

/* ─────────────────────────────────────────────────────────────────
   DROPDOWN PANEL SUB-COMPONENTS
───────────────────────────────────────────────────────────────── */

function WherePanel({
  destinations,
  onSelect,
}: {
  destinations: { city: string }[];
  onSelect: (city: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = destinations.filter((d) =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
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
        {filtered.map((dest) => (
          <div
            key={dest.city}
            onClick={() => onSelect(dest.city)}
            className="flex items-center gap-2 my-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <div className="size-7 relative flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
              <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-600">{dest.city}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WhenPanel({ onSelect }: { onSelect: (d: Dayjs) => void }) {
  return (
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
        onSelect={onSelect}
        disabledDate={(current) => current && current.isBefore(dayjs().startOf("day"))}
      />
    </motion.div>
  );
}

function WhoPanel({
  guests,
  onDecrement,
  onIncrement,
}: {
  guests: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
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
            onClick={onDecrement}
          />
          <span className="text-lg">{guests}</span>
          <GoPlusCircle
            className="text-2xl cursor-pointer"
            onClick={onIncrement}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TypePanel({
  selected,
  onSelect,
}: {
  selected: BookingType | null;
  onSelect: (type: BookingType) => void;
}) {
  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed md:absolute top-[80px] md:top-[120%] left-4 right-4 md:right-0 md:left-0 md:w-80 bg-white shadow-2xl rounded-2xl p-5 z-[999] border border-gray-100 mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        {BOOKING_TYPES.map((type, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(type)}
            className={`p-3 rounded-xl border text-left cursor-pointer ${
              selected?.value === type.value
                ? "bg-blue-50 border-blue-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-sm font-bold text-gray-800">{type.title}</p>
            <p className="text-[10px] text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */

export default function ListBookingSearchBar({ onActiveChange }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selected, setSelected] = useState<BookingType | null>(null);
  const [guests, setGuests] = useState(0);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useGetBoatListByLocationQuery({});
  const destinations: { city: string }[] = data?.data || [];

  // Pre-populate fields from localStorage on mount
  useEffect(() => {
    const saved = readSearchData();
    if (saved.location) setLocation(saved.location);
    if (saved.guests) setGuests(Number(saved.guests) || 0);
    if (saved.date) {
      const d = dayjs(saved.date);
      if (d.isValid()) setSelectedDate(d);
    }
    if (saved.bookingType !== undefined) {
      const boolVal = saved.bookingType === "true";
      const match = BOOKING_TYPES.find((b) => b.value === boolVal);
      if (match) setSelected(match);
    }
  }, []);

  useEffect(() => {
    setIsSearching(false);
  }, [searchParams]);

  // Notify parent when a dropdown opens / closes
  useEffect(() => {
    onActiveChange?.(activeTab !== null);
  }, [activeTab, onActiveChange]);

  // Close all dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (isSearching) return;
    const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";

    setIsSearching(true);
    markCharterSearchPending();
    writeSearchData({
      location,
      date: formattedDate,
      startDate: formattedDate,
      bookingType: selected ? String(selected.value) : "",
      guests: guests.toString(),
      timestamp: new Date().toISOString(),
    });

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (formattedDate) params.set("date", formattedDate);
    if (guests > 0) params.set("guests", guests.toString());
    if (selected) params.set("bookingType", String(selected.value));

    const baseUrl =
      selected?.value === true ? "/group-charter" : "/search-charter";
    router.push(params.toString() ? `${baseUrl}?${params}` : baseUrl);
  };

  const tabClass = (key: string) =>
    `relative flex flex-col items-center justify-center cursor-pointer rounded-full transition-all duration-300 px-2 py-2.5 flex-1 ${
      activeTab === key ? "bg-white shadow-md z-20" : "hover:bg-gray-50"
    }`;

  return (
    <div className="w-full mx-auto relative" ref={containerRef}>
      <div className="relative flex items-center bg-white rounded-full border-2 shadow-sm border-gray-100 py-1 px-1">
        <div className="flex flex-row w-full items-center justify-between">
          {/* WHERE */}
          <div
            onClick={() => setActiveTab("where")}
            className={tabClass("where")}
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
                <WherePanel
                  destinations={destinations}
                  onSelect={(city) => {
                    setLocation(city);
                    setActiveTab(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* WHEN */}
          <div
            onClick={() => setActiveTab("when")}
            className={tabClass("when")}
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
                <WhenPanel
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setActiveTab(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* WHO */}
          <div onClick={() => setActiveTab("who")} className={tabClass("who")}>
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
                <WhoPanel
                  guests={guests}
                  onDecrement={() => setGuests((g) => Math.max(0, g - 1))}
                  onIncrement={() => setGuests((g) => g + 1)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* TYPE */}
          <div
            onClick={() => setActiveTab("type")}
            className={tabClass("type")}
          >
            <h1 className="font-extrabold text-black text-[12px] md:text-[13px]">
              Type
            </h1>
            <AnimatePresence>
              {activeTab === "type" && (
                <TypePanel
                  selected={selected}
                  onSelect={(type) => {
                    setSelected(type);
                    setActiveTab(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-1">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-[#105d9e] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <SearchButtonSpinner className="h-4 w-4" />
              ) : (
                <IoIosSearch className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
