"use client";

import { DatePicker } from "antd";
import moment from "moment";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import Image from "next/image";
import flag from "@/assets/flag.png";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [selected, setSelected] = useState<any>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [guests, setGuests] = useState<number>(0);
  const [isOpenGuest, setIsOpenGuest] = useState(false);
  const [location, setLocation] = useState("");

  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const handleChange = (date: any) => {
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  };

  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const bookingTypeRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGetBoatListByLocationQuery({});
  const destinations = data?.data || [];

  const route = useRouter();

  const bookingTypes = [
    {
      title: "Private booking",
      value: false,
      description:
        "Great if you want to hire out your own boat with a captain.",
    },
    {
      title: "Shared booking",
      value: true,
      description: "Join other group bookings to fill a boat.",
    },
  ];

  const increment = () => setGuests((prev: any) => prev + 1);
  const decrement = () => {
    if (guests > 1) setGuests((prev: any) => prev - 1);
  };

  const handleSearch = () => {
    localStorage.setItem("location", location);
    localStorage.setItem(
      "date",
      selectedDate ? selectedDate.format("YYYY-MM-DD") : ""
    );
    localStorage.setItem("bookingType", String(selected?.value));
    localStorage.setItem("Guests", guests.toString());
    route.push(
      selected === true
        ? "/group-charter?type=GROUP"
        : selected === false
        ? `/search-charter?booking-type=${selected}`
        : `/search-charter`
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(target)
      ) {
        setIsOpenGuest(false);
      }

      if (bookingTypeRef.current && !bookingTypeRef.current.contains(target)) {
        setIsOpen(false);
      }

      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(target)
      ) {
        setIsOpenLocation(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredDestinations = destinations.filter((d: any) =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDestination = (destination: { city: string }) => {
    setLocation(destination.city);
    setIsOpenLocation(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto -mt-20">
      <div
        className={`rounded-xl lg:rounded-full shadow-lg flex flex-col lg:flex-row justify-between items-center translate-y-10 searchbarShadow ${
          isDatePickerOpen || isOpen || isOpenGuest || isOpenLocation
            ? "bg-white border-2 border-[#636363] "
            : "bg-white border-2 border-white"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full text-sm ">
          {/* Where */}
          <div
            ref={locationDropdownRef}
            className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 cursor-pointer  ${
              isOpenLocation
                ? "border-2 border-[#bdbdbd]"
                : "border-b md:border-2  md:border-white  "
            }`}
          >
            <div
              className={`h-full px-10 ${
                isOpenLocation || isDatePickerOpen
                  ? ""
                  : "border-r-0 md:border-r-2 group-hover:border-none border-[#858585]"
              }`}
            >
              <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
                Where
              </h1>
              <input
                type="text"
                value={location}
                placeholder="Search destinations"
                onFocus={() => setIsOpenLocation(true)}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="mt-1 w-full text-sm text-[#474747] outline-none bg-white group-hover:bg-white"
              />
            </div>
            {isOpenLocation && (
              <div className="absolute z-50 mt-8 p-6 w-96 bg-white border border-gray-200 rounded-[24px] shadow-md max-h-96 overflow-y-auto slim-scroll">
                <h1 className="text-base font-normal leading-4">
                  Select Destination{" "}
                </h1>
                {filteredDestinations.length > 0 ? (
                  filteredDestinations?.map((destination: any, index: number) => (
                    <div
                      key={`${destination?.city}-${destination?.name || index}`}
                      onClick={() => handleSelectDestination(destination)}
                      className="px-4 cursor-pointer hover:bg-gray-100 flex items-center  gap-3 border-b py-3"
                    >
                      <Image
                        src={flag}
                        alt="flag imge"
                        height={100}
                        width={100}
                        className="size-6"
                      />
                      <div className="text-[22px] font-medium text-black leading-normal">
                        {destination?.city}
                      </div>
                      <div className="text-base font-normal leading-normal text-[#858585]">
                        {destination?._count?.boatId} Charters
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div
            className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 border-b md:border-b-0 ${
              isDatePickerOpen
                ? "border-2 border-[#bdbdbd]"
                : "border-b md:border-2 md:border-white"
            }`}
          >
            <div
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`group w-full min-w-0 rounded-lg md:rounded-full hover:bg-white hover:rounded-xl md:hover:rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                isDatePickerOpen ? "bg-white" : ""
              }`}
            >
              <div
                className={`h-full px-10 ${
                  isDatePickerOpen || isOpenGuest
                    ? ""
                    : "border-r-0 md:border-r-2 border-[#858585]"
                }`}
              >
                <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
                  Date
                </h1>
                <span className="text-base text-[#858585] font-normal mt-1">
                  {selectedDate
                    ? selectedDate.format("YYYY-MM-DD")
                    : "Select Date"}
                </span>
              </div>
            </div>

            {isDatePickerOpen && (
              <div className="absolute top-full left-0 z-50 bg-white mt-3 rounded-lg shadow-lg p-2">
                <DatePicker
                  onChange={handleChange}
                  value={selectedDate}
                  format="YYYY-MM-DD" // this also ensures the picker shows the date in that format
                />
              </div>
            )}
          </div>

          {/* Who */}
          <div className="relative w-full min-w-0 " ref={guestDropdownRef}>
            <div
              className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 cursor-pointer ${
                isOpenGuest
                  ? "border-2 border-[#bdbdbd]"
                  : "border-b md:border-2  md:border-white  "
              }`}
              onClick={() => setIsOpenGuest(!isOpenGuest)}
            >
              <div
                className={`h-full group-hover:border-none px-10 ${
                  isOpenGuest || isOpen
                    ? ""
                    : "border-r-0 md:border-r-2 border-[#858585]"
                }`}
              >
                <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
                  Who
                </h1>

                {guests && guests > 0 ? (
                  <span className="text-base font-normal leading-normal text-[#242424]">
                    {guests}
                  </span>
                ) : (
                  <span className="text-base text-[#858585] font-normal mt-1 ">
                    How many guest!
                  </span>
                )}
              </div>
            </div>

            {isOpenGuest && (
              <div className="absolute z-[9999] top-16 left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg mt-7 w-64 text-sm">
                <p className="text-base font-normal  leading-normal mb-2">
                  Add guests:
                </p>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-[22px] leading-6 font-normal">
                    Guests:
                  </span>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <CiCircleMinus
                      onClick={decrement}
                      className="size-8 text-[#878787] cursor-pointer"
                    />
                    <span className="text-base font-normal leading-normal text-[#242424]">
                      {guests ?? 0}
                    </span>
                    <GoPlusCircle
                      onClick={increment}
                      className="size-7 text-[#878787] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Type */}
          <div
            ref={bookingTypeRef}
            className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4  ${
              isOpen
                ? "border-2 border-[#bdbdbd]"
                : "border-b md:border-2  md:border-white  "
            }`}
          >
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between gap-2 w-full px-10 cursor-pointer"
            >
              {selected ? (
                <div>
                  <h1 className="text-sm sm:text-[18px] text-[#474747]">
                    {selected.title}
                  </h1>

                  <p className=" text-sm text-[#474747] mt-1 truncate w-48">
                    {selected.description}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-sm sm:text-[18px] text-[#474747] ">
                    Private or shared
                  </h1>
                  <p className="text-xs text-gray-400">What type of booking?</p>
                </div>
              )}
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transform transition-transform `}
              />
            </div>

            {isOpen && (
              <div ref={bookingTypeRef}>
                <div className="absolute top-20 md:top-20 z-10 mt-2 w-54 md:w-80 bg-white rounded-xl shadow-lg p-4 space-y-2 text-sm">
                  <h1>Select your booking type:</h1>
                  {bookingTypes?.map((type: any, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelected(type);
                        setIsOpen(false);
                      }}
                      className={`cursor-pointer p-3 rounded-lg border transition ${
                        selected === type.value
                          ? "border-blue-400"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <h3 className="font-semibold text-gray-800">
                        {type.title}
                      </h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="mx-3 mt-3 md:mt-0 w-full md:w-16 p-5 md:p-0">
          <div
            onClick={handleSearch}
            className="bg-[#0037ff] hover:bg-[#FF9500] text-white rounded-xl lg:rounded-full h-11 md:h-16 w-full md:w-16 flex items-center gap-3 md:gap-0 justify-center cursor-pointer"
          >
            <span className="block lg:hidden text-base">Search</span>
            <IoIosSearch className="text-2xl md:text-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
