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
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import dayjs, { Dayjs } from "dayjs";
import { MapPin, X } from "lucide-react";

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
    description: "Join other group bookings to fill a boats.",
  },
] as const;

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

const MOBILE_SECTIONS = ["where", "when", "who", "type"] as const;

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */

type BookingType = (typeof BOOKING_TYPES)[number];

type Destination = { city: string; country?: string };

type SearchState = {
  location: string;
  selectedDate: Dayjs | null;
  guests: number;
  selected: BookingType | null;
};

type Props = {
  scrolled: boolean;
  onActiveChange?: (isActive: boolean) => void;
};

/* ─────────────────────────────────────────────────────────────────
   LOCAL STORAGE HELPERS
───────────────────────────────────────────────────────────────── */

function writeSearchData(state: SearchState): void {
  const formattedDate = state.selectedDate
    ? state.selectedDate.format("YYYY-MM-DD")
    : "";
  const data = {
    location: state.location,
    date: formattedDate,
    startDate: formattedDate,
    bookingType: String(state.selected?.value),
    guests: state.guests.toString(),
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(SEARCH_DATA_KEY, JSON.stringify(data));
}

function buildSearchUrl(state: SearchState): string {
  const formattedDate = state.selectedDate
    ? state.selectedDate.format("YYYY-MM-DD")
    : "";
  const params = new URLSearchParams();
  if (state.location) params.set("location", state.location);
  if (formattedDate) params.set("date", formattedDate);
  if (state.guests > 0) params.set("guests", state.guests.toString());
  if (state.selected) params.set("bookingType", String(state.selected.value));
  const base =
    state.selected?.value === true ? "/group-charter" : "/search-charter";
  return params.toString() ? `${base}?${params}` : base;
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE MODAL SUB-COMPONENTS
───────────────────────────────────────────────────────────────── */

function MobileProgressBar({ active }: { active: string }) {
  const currentIndex = MOBILE_SECTIONS.indexOf(
    active as (typeof MOBILE_SECTIONS)[number],
  );
  return (
    <div className="px-4 py-2 bg-white/95 backdrop-blur-sm">
      <div className="flex space-x-2">
        {MOBILE_SECTIONS.map((section, index) => (
          <div
            key={section}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index <= currentIndex
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MobileWhereCard({
  active,
  location,
  destinations,
  onActivate,
  onSelect,
  onLocationChange,
}: {
  active: boolean;
  location: string;
  destinations: Destination[];
  onActivate: () => void;
  onSelect: (city: string) => void;
  onLocationChange: (val: string) => void;
}) {
  const filtered = useMemo(
    () =>
      destinations.filter((d) =>
        d.city.toLowerCase().includes(location.toLowerCase()),
      ),
    [destinations, location],
  );

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow border border-white/70 transition-all duration-300 p-4 ${
        active
          ? "ring-2 ring-blue-100 ring-opacity-30"
          : "cursor-pointer hover:shadow-xl"
      }`}
      onClick={onActivate}
    >
      {active ? (
        <div className="space-y-2">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-800">Where to?</h3>
            <p className="text-sm text-gray-500">
              Choose your fishing destination
            </p>
          </div>
          <div className="relative">
            <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
            <input
              autoFocus
              type="text"
              placeholder="Search destinations..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium placeholder-gray-400"
            />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {filtered.slice(0, 6).map((dest, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(dest.city);
                }}
                className="w-full flex items-center space-x-2 p-0 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 text-left group"
              >
                <div className="p-1 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                  <MapPin className="text-gray-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 group-hover:text-blue-700">
                    {dest.city}
                  </p>
                  {dest.country && (
                    <p className="text-xs text-gray-500">{dest.country}</p>
                  )}
                </div>
                <IoChevronForwardOutline className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IoLocationOutline className="text-2xl text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Where</h3>
              <p className="text-sm text-gray-500">
                {location || "Choose destination"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {location && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            <IoChevronForwardOutline className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function MobileWhenCard({
  active,
  selectedDate,
  onActivate,
  onSelect,
}: {
  active: boolean;
  selectedDate: Dayjs | null;
  onActivate: () => void;
  onSelect: (d: Dayjs) => void;
}) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 p-4 ${
        active
          ? "ring-2 ring-green-500 ring-opacity-30"
          : "cursor-pointer hover:shadow-xl hover:scale-[1.01]"
      }`}
      onClick={onActivate}
    >
      {active ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <IoCalendarOutline className="text-xl text-gray-600" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-800">When?</h3>
              <p className="text-sm text-gray-500">
                Select your preferred date
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <Calendar
              fullscreen={false}
              onSelect={onSelect}
              value={selectedDate ?? undefined}
              className="custom-calendar"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <IoCalendarOutline className="text-lg text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">When</h3>
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
  );
}

function MobileWhoCard({
  active,
  guests,
  onActivate,
  onDecrement,
  onIncrement,
  onContinue,
}: {
  active: boolean;
  guests: number;
  onActivate: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 p-4 ${
        active
          ? "ring-2 ring-purple-500 ring-opacity-30"
          : "cursor-pointer hover:shadow-xl hover:scale-[1.01]"
      }`}
      onClick={onActivate}
    >
      {active ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <IoPeopleOutline className="text-xl text-gray-600" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-800">Who's coming?</h3>
              <p className="text-sm text-gray-500">Add guests to your trip</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800 text-sm">
                Guests
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrement();
                  }}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 active:scale-95 transition-all"
                >
                  <IoRemoveOutline className="text-gray-600 text-lg" />
                </button>
                <div className="w-16 text-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {guests}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrement();
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
              onContinue();
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <IoPeopleOutline className="text-lg text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Who</h3>
              <p className="text-sm text-gray-500">
                {guests > 0
                  ? `${guests} guest${guests > 1 ? "s" : ""}`
                  : "Add guests"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {guests > 0 && (
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            )}
            <IoChevronForwardOutline className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function MobileTypeCard({
  active,
  selected,
  onActivate,
  onSelect,
}: {
  active: boolean;
  selected: BookingType | null;
  onActivate: () => void;
  onSelect: (t: BookingType) => void;
}) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 p-4 ${
        active
          ? "ring-2 ring-orange-500 ring-opacity-30"
          : "cursor-pointer hover:shadow-xl hover:scale-[1.01]"
      }`}
      onClick={onActivate}
    >
      {active ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <IoBoatOutline className="text-xl text-gray-600" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-800">Trip type</h3>
              <p className="text-sm text-gray-500">
                Choose your booking preference
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {BOOKING_TYPES.map((type, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(type);
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
            <IoBoatOutline className="text-lg text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Type</h3>
              <p className="text-sm text-gray-500">
                {selected ? selected.title : "Select trip type"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selected && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            <IoChevronForwardOutline className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function MobileSearchFooter({
  location,
  selectedDate,
  selected,
  onSearch,
}: {
  location: string;
  selectedDate: Dayjs | null;
  selected: BookingType | null;
  onSearch: () => void;
}) {
  const isReady = !!location && !!selectedDate && !!selected;
  return (
    <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100/50">
      <button
        onClick={onSearch}
        disabled={!isReady}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200"
      >
        <IoIosSearch className="text-xl" />
        {isReady ? "Search Fishing Trips" : "Complete Fields to Search"}
      </button>
      {!isReady && (
        <div className="flex items-center justify-center mt-3 space-x-4">
          {[
            { label: "Where", done: !!location },
            { label: "When", done: !!selectedDate },
            { label: "Type", done: !!selected },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${done ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DESKTOP DROPDOWN PANELS
───────────────────────────────────────────────────────────────── */

function DesktopWhereDropdown({
  destinations,
  searchTerm,
  location,
  onSelect,
  onSearchChange,
  onClear,
}: {
  destinations: Destination[];
  searchTerm: string;
  location: string;
  onSelect: (city: string) => void;
  onSearchChange: (val: string) => void;
  onClear: () => void;
}) {
  const filtered = useMemo(
    () =>
      destinations.filter((d) =>
        d.city.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [destinations, searchTerm],
  );
  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-[105%] left-0 w-[300px] bg-white shadow-2xl rounded-2xl p-6 z-50 border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight mb-4">
        Destinations
      </h2>
      <div className="max-h-60 overflow-y-auto custom-scrollbar">
        {filtered.map((dest, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(dest.city)}
            className="flex items-center gap-2 my-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="size-8 flex items-center justify-center bg-gray-100 rounded-md">
              <MapPin className="text-gray-400 w-4 h-4" />
            </div>
            <p className="font-semibold text-sm text-gray-600 flex-1">
              {dest.city}
            </p>
            {(searchTerm || location) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="text-gray-400 hover:text-gray-600 w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DesktopWhenDropdown({
  onSelect,
  selectedDate,
}: {
  onSelect: (d: Dayjs) => void;
  selectedDate: Dayjs | null;
}) {
  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-[104%] left-0 z-50 bg-white shadow-2xl rounded-xl p-4 border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <Calendar
        fullscreen={false}
        onSelect={onSelect}
        value={selectedDate ?? undefined}
      />
    </motion.div>
  );
}

function DesktopWhoDropdown({
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
      className="absolute top-[105%] left-0 -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl w-64 z-50 border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold">Guests</span>
        <div className="flex items-center gap-3">
          <CiCircleMinus
            onClick={onDecrement}
            className="text-3xl text-gray-400 hover:text-black cursor-pointer"
          />
          <span className="font-bold">{guests}</span>
          <GoPlusCircle
            onClick={onIncrement}
            className="text-3xl text-gray-400 hover:text-black cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
}

function DesktopTypeDropdown({
  selected,
  onSelect,
}: {
  selected: BookingType | null;
  onSelect: (t: BookingType) => void;
}) {
  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-[105%] left-0 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-2">
        {BOOKING_TYPES.map((type, i) => (
          <div
            key={i}
            onClick={() => onSelect(type)}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selected?.value === type.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-100 hover:bg-gray-50"
            }`}
          >
            <h3 className="font-bold text-gray-800">{type.title}</h3>
            <p className="text-xs text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */

export default function SearchBar({ scrolled, onActiveChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeMobileSection, setActiveMobileSection] =
    useState<string>("where");
  const [selected, setSelected] = useState<BookingType | null>(null);
  const [guests, setGuests] = useState(0);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data } = useGetBoatListByLocationQuery({});
  const destinations: Destination[] = data?.data || [];

  const isExpanded = !scrolled || activeTab !== null;

  // Mount flag for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Notify parent when desktop dropdown opens/closes
  useEffect(() => {
    onActiveChange?.(activeTab !== null);
  }, [activeTab, onActiveChange]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    if (!activeTab) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeTab]);

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    document.body.style.overflow = isMobileModalOpen ? "hidden" : "";
  }, [isMobileModalOpen]);

  const handleSearch = () => {
    const state: SearchState = { location, selectedDate, guests, selected };
    writeSearchData(state);
    setIsMobileModalOpen(false);
    router.push(buildSearchUrl(state));
  };

  return (
    <>
      {/* ── MOBILE COMPACT TRIGGER BAR ───────────────────────── */}
      <div className="md:hidden w-full px-4 pb-2">
        <div
          onClick={() => setIsMobileModalOpen(true)}
          className={`w-full flex items-center gap-3 bg-white rounded-full shadow-lg border border-gray-200 ${
            scrolled ? "px-3 py-1" : "px-5 py-1"
          } cursor-pointer transition-all duration-300`}
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

      {/* ── MOBILE FULL-SCREEN MODAL (portal) ────────────────── */}
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
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 border-b border-gray-100/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
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

                <MobileProgressBar active={activeMobileSection} />

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                  <MobileWhereCard
                    active={activeMobileSection === "where"}
                    location={location}
                    destinations={destinations}
                    onActivate={() => setActiveMobileSection("where")}
                    onSelect={(city) => {
                      setLocation(city);
                      setActiveMobileSection("when");
                    }}
                    onLocationChange={setLocation}
                  />
                  <MobileWhenCard
                    active={activeMobileSection === "when"}
                    selectedDate={selectedDate}
                    onActivate={() => setActiveMobileSection("when")}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setActiveMobileSection("who");
                    }}
                  />
                  <MobileWhoCard
                    active={activeMobileSection === "who"}
                    guests={guests}
                    onActivate={() => setActiveMobileSection("who")}
                    onDecrement={() => setGuests((g) => Math.max(0, g - 1))}
                    onIncrement={() => setGuests((g) => g + 1)}
                    onContinue={() => setActiveMobileSection("type")}
                  />
                  <MobileTypeCard
                    active={activeMobileSection === "type"}
                    selected={selected}
                    onActivate={() => setActiveMobileSection("type")}
                    onSelect={setSelected}
                  />
                </div>

                <MobileSearchFooter
                  location={location}
                  selectedDate={selectedDate}
                  selected={selected}
                  onSearch={handleSearch}
                />
              </motion.div>
            )}
          </div>,
          document.body,
        )}

      {/* ── DESKTOP SEARCH BAR ───────────────────────────────── */}
      <div
        className={`hidden md:block w-full mx-auto px-4 transition-all duration-700 ease-in-out ${
          isExpanded ? "max-w-5xl" : "max-w-xl"
        }`}
        ref={containerRef}
      >
        <div
          className={`relative flex flex-col lg:flex-row items-center bg-white rounded-full transition-all duration-700 ease-in-out border-2 shadow-sm ${
            activeTab ? "border-gray-100 shadow-xl" : "border-gray-100"
          }`}
        >
          <div className="flex flex-row w-full items-center justify-between">
            {/* WHERE */}
            <div
              onClick={() => setActiveTab("where")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${
                isExpanded
                  ? "px-6 py-3 flex-1"
                  : "px-3 py-2.5 items-center flex-[0.8]"
              } ${activeTab === "where" ? "bg-white border z-20 scale-105" : "hover:bg-gray-100"}`}
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
                  placeholder="Search destinations..."
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
                  <DesktopWhereDropdown
                    destinations={destinations}
                    searchTerm={searchTerm}
                    location={location}
                    onSelect={(city) => {
                      setLocation(city);
                      setSearchTerm(city);
                      setActiveTab(null);
                    }}
                    onSearchChange={setSearchTerm}
                    onClear={() => {
                      setSearchTerm("");
                      setLocation("");
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-8 bg-gray-200 mx-1" />

            {/* WHEN */}
            <div
              onClick={() => setActiveTab("when")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${
                isExpanded
                  ? "px-6 py-3 flex-1"
                  : "px-2 py-1.5 items-center flex-[0.6]"
              } ${activeTab === "when" ? "bg-white border rounded-none z-20 scale-105" : "hover:bg-gray-100"}`}
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
                  <DesktopWhenDropdown
                    selectedDate={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setActiveTab(null);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-8 bg-gray-200 mx-1" />

            {/* WHO */}
            <div
              onClick={() => setActiveTab("who")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${
                isExpanded
                  ? "px-6 py-3 flex-1"
                  : "px-2 py-1.5 items-center flex-[0.5]"
              } ${activeTab === "who" ? "bg-white border rounded-none z-20 scale-105" : "hover:bg-gray-100"}`}
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
                  <DesktopWhoDropdown
                    guests={guests}
                    onDecrement={() => guests > 0 && setGuests(guests - 1)}
                    onIncrement={() => setGuests(guests + 1)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* TYPE */}
            <div
              onClick={() => setActiveTab("type")}
              className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-500 ease-in-out ${
                isExpanded
                  ? "px-6 py-3 flex-1"
                  : "px-2 py-1.5 items-center flex-[0.6]"
              } ${activeTab === "type" ? "bg-white border z-20 scale-105" : "hover:bg-gray-100"}`}
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
                  <DesktopTypeDropdown
                    selected={selected}
                    onSelect={(t) => {
                      setSelected(t);
                      setActiveTab(null);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* SEARCH BUTTON */}
            <div className="p-1.5">
              <button
                onClick={handleSearch}
                className={`flex items-center justify-center bg-[#105d9e] hover:bg-[#0c4a7e] text-white rounded-full transition-all duration-500 ease-in-out shadow-md hover:shadow-xl active:scale-90 ${
                  isExpanded ? "w-24 h-12 lg:w-28 lg:h-14" : "w-10 h-10"
                }`}
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
