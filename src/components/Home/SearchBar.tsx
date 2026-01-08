// "use client";

// import { DatePicker } from "antd";
// import moment from "moment";
// import { ChevronDownIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { IoIosSearch } from "react-icons/io";
// import { GoPlusCircle } from "react-icons/go";
// import { CiCircleMinus } from "react-icons/ci";
// import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
// import Image from "next/image";
// import flag from "@/assets/flag.png";

// export default function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpenLocation, setIsOpenLocation] = useState(false);
//   const [selected, setSelected] = useState<any>();
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [guests, setGuests] = useState<number>(0);
//   const [isOpenGuest, setIsOpenGuest] = useState(false);
//   const [location, setLocation] = useState("");

//   const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
//   const handleChange = (date: any) => {
//     if (date) {
//       setSelectedDate(date);
//     } else {
//       setSelectedDate(null);
//     }
//   };

//   const guestDropdownRef = useRef<HTMLDivElement>(null);
//   const bookingTypeRef = useRef<HTMLDivElement>(null);
//   const locationDropdownRef = useRef<HTMLDivElement>(null);

//   const { data } = useGetBoatListByLocationQuery(
//     {},
//     {
//       pollingInterval: 0,
//       refetchOnMountOrArgChange: false,
//       refetchOnFocus: false,
//       refetchOnReconnect: false,
//     }
//   );
//   const destinations = data?.data || [];

//   const route = useRouter();

//   const bookingTypes = [
//     {
//       title: "Private booking",
//       value: false,
//       description:
//         "Great if you want to hire out your own boat with a captain.",
//     },
//     {
//       title: "Shared booking",
//       value: true,
//       description: "Join other group bookings to fill a boat.",
//     },
//   ];

//   const increment = () => setGuests((prev: any) => prev + 1);
//   const decrement = () => {
//     if (guests > 1) setGuests((prev: any) => prev - 1);
//   };

//   const handleSearch = () => {
//     const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
//     localStorage.setItem("location", location);
//     localStorage.setItem("date", formattedDate);
//     localStorage.setItem("StartDate", formattedDate); // Set StartDate as well
//     localStorage.setItem("bookingType", String(selected?.value));
//     localStorage.setItem("Guests", guests.toString());
//     route.push(
//       selected === true
//         ? "/group-charter?type=GROUP"
//         : selected === false
//         ? `/search-charter?booking-type=${selected}`
//         : `/search-charter`
//     );
//   };

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       const target = event.target as Node;

//       if (
//         guestDropdownRef.current &&
//         !guestDropdownRef.current.contains(target)
//       ) {
//         setIsOpenGuest(false);
//       }

//       if (bookingTypeRef.current && !bookingTypeRef.current.contains(target)) {
//         setIsOpen(false);
//       }

//       if (
//         locationDropdownRef.current &&
//         !locationDropdownRef.current.contains(target)
//       ) {
//         setIsOpenLocation(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const filteredDestinations = destinations.filter((d: any) =>
//     d.city.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSelectDestination = (destination: { city: string }) => {
//     setLocation(destination.city);
//     setIsOpenLocation(false);
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto -mt-20">
//       <div
//         className={`rounded-xl lg:rounded-full shadow-lg flex flex-col lg:flex-row justify-between items-center translate-y-10 searchbarShadow ${
//           isDatePickerOpen || isOpen || isOpenGuest || isOpenLocation
//             ? "bg-white border-2 border-[#636363] "
//             : "bg-white border-2 border-white"
//         }`}
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full text-sm ">
//           {/* Where */}
//           <div
//             ref={locationDropdownRef}
//             className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 cursor-pointer  ${
//               isOpenLocation
//                 ? "border-2 border-[#bdbdbd]"
//                 : "border-b md:border-2  md:border-white  "
//             }`}
//           >
//             <div
//               className={`h-full px-10 ${
//                 isOpenLocation || isDatePickerOpen
//                   ? ""
//                   : "border-r-0 md:border-r-2 group-hover:border-none border-[#858585]"
//               }`}
//             >
//               <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
//                 Where
//               </h1>
//               <input
//                 type="text"
//                 value={location}
//                 placeholder="Search destinations"
//                 onFocus={() => setIsOpenLocation(true)}
//                 onChange={(e) => {
//                   setLocation(e.target.value);
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="mt-1 w-full text-sm text-[#474747] outline-none bg-white group-hover:bg-white"
//               />
//             </div>
//             {isOpenLocation && (
//               <div className="absolute z-50 mt-8 p-6 w-96 bg-white border border-gray-200 rounded-[24px] shadow-md max-h-96 overflow-y-auto slim-scroll">
//                 <h1 className="text-base font-normal leading-4">
//                   Select Destination{" "}
//                 </h1>
//                 {filteredDestinations.length > 0 ? (
//                   filteredDestinations?.map(
//                     (destination: any, index: number) => (
//                       <div
//                         key={`${destination?.city}-${
//                           destination?.name || index
//                         }`}
//                         onClick={() => handleSelectDestination(destination)}
//                         className="px-4 cursor-pointer hover:bg-gray-100 flex items-center  gap-3 border-b py-3"
//                       >
//                         <Image
//                           src={flag}
//                           alt="flag imge"
//                           height={100}
//                           width={100}
//                           className="size-6"
//                         />
//                         <div className="text-[22px] font-medium text-black leading-normal">
//                           {destination?.city}
//                         </div>
//                         <div className="text-base font-normal leading-normal text-[#858585]">
//                           {destination?._count?.boatId} Charters
//                         </div>
//                       </div>
//                     )
//                   )
//                 ) : (
//                   <div className="px-4 py-2 text-sm text-gray-500">
//                     No results
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Date */}
//           <div
//             className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 border-b md:border-b-0 ${
//               isDatePickerOpen
//                 ? "border-2 border-[#bdbdbd]"
//                 : "border-b md:border-2 md:border-white"
//             }`}
//           >
//             <div
//               onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
//               className={`group w-full min-w-0 rounded-lg md:rounded-full hover:bg-white hover:rounded-xl md:hover:rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
//                 isDatePickerOpen ? "bg-white" : ""
//               }`}
//             >
//               <div
//                 className={`h-full px-10 ${
//                   isDatePickerOpen || isOpenGuest
//                     ? ""
//                     : "border-r-0 md:border-r-2 border-[#858585]"
//                 }`}
//               >
//                 <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
//                   Date
//                 </h1>
//                 <span className="text-base text-[#858585] font-normal mt-1">
//                   {selectedDate
//                     ? selectedDate.format("YYYY-MM-DD")
//                     : "Select Date"}
//                 </span>
//               </div>
//             </div>

//             {isDatePickerOpen && (
//               <div className="absolute top-full left-0 z-50 bg-white mt-3 rounded-lg shadow-lg p-2">
//                 <DatePicker
//                   onChange={handleChange}
//                   value={selectedDate}
//                   format="YYYY-MM-DD" // this also ensures the picker shows the date in that format
//                 />
//               </div>
//             )}
//           </div>

//           {/* Who */}
//           <div className="relative w-full min-w-0 " ref={guestDropdownRef}>
//             <div
//               className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4 cursor-pointer ${
//                 isOpenGuest
//                   ? "border-2 border-[#bdbdbd]"
//                   : "border-b md:border-2  md:border-white  "
//               }`}
//               onClick={() => setIsOpenGuest(!isOpenGuest)}
//             >
//               <div
//                 className={`h-full group-hover:border-none px-10 ${
//                   isOpenGuest || isOpen
//                     ? ""
//                     : "border-r-0 md:border-r-2 border-[#858585]"
//                 }`}
//               >
//                 <h1 className="text-sm sm:text-[18px] font-normal text-[#474747]">
//                   Who
//                 </h1>

//                 {guests && guests > 0 ? (
//                   <span className="text-base font-normal leading-normal text-[#242424]">
//                     {guests}
//                   </span>
//                 ) : (
//                   <span className="text-base text-[#858585] font-normal mt-1 ">
//                     How many guest!
//                   </span>
//                 )}
//               </div>
//             </div>

//             {isOpenGuest && (
//               <div className="absolute z-[9999] top-16 left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-lg mt-7 w-64 text-sm">
//                 <p className="text-base font-normal  leading-normal mb-2">
//                   Add guests:
//                 </p>
//                 <div className="flex items-center justify-between mt-6">
//                   <span className="text-[22px] leading-6 font-normal">
//                     Guests:
//                   </span>
//                   <div className="flex items-center space-x-3 cursor-pointer">
//                     <CiCircleMinus
//                       onClick={decrement}
//                       className="size-8 text-[#878787] cursor-pointer"
//                     />
//                     <span className="text-base font-normal leading-normal text-[#242424]">
//                       {guests ?? 0}
//                     </span>
//                     <GoPlusCircle
//                       onClick={increment}
//                       className="size-7 text-[#878787] cursor-pointer"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Booking Type */}
//           <div
//             ref={bookingTypeRef}
//             className={`relative w-full min-w-0 bg-white rounded-lg md:rounded-full py-4  ${
//               isOpen
//                 ? "border-2 border-[#bdbdbd]"
//                 : "border-b md:border-2  md:border-white  "
//             }`}
//           >
//             <div
//               onClick={() => setIsOpen(!isOpen)}
//               className="flex items-center justify-between gap-2 w-full px-10 cursor-pointer"
//             >
//               {selected ? (
//                 <div>
//                   <h1 className="text-sm sm:text-[18px] text-[#474747]">
//                     {selected.title}
//                   </h1>

//                   <p className=" text-sm text-[#474747] mt-1 truncate w-48">
//                     {selected.description}
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <h1 className="text-sm sm:text-[18px] text-[#474747] ">
//                     Private or shared
//                   </h1>
//                   <p className="text-xs text-gray-400">What type of booking?</p>
//                 </div>
//               )}
//               <ChevronDownIcon
//                 className={`w-5 h-5 text-gray-500 transform transition-transform `}
//               />
//             </div>

//             {isOpen && (
//               <div ref={bookingTypeRef}>
//                 <div className="absolute top-20 md:top-20 z-10 mt-2 w-54 md:w-80 bg-white rounded-xl shadow-lg p-4 space-y-2 text-sm">
//                   <h1>Select your booking type:</h1>
//                   {bookingTypes?.map((type: any, index) => (
//                     <div
//                       key={index}
//                       onClick={() => {
//                         setSelected(type);
//                         setIsOpen(false);
//                       }}
//                       className={`cursor-pointer p-3 rounded-lg border transition ${
//                         selected === type.value
//                           ? "border-blue-400"
//                           : "border-gray-200 hover:bg-gray-100"
//                       }`}
//                     >
//                       <h3 className="font-semibold text-gray-800">
//                         {type.title}
//                       </h3>
//                       <p className="text-gray-600">{type.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="mx-3 mt-3 md:mt-0 w-full md:w-16 p-5 md:p-0">
//           <div
//             onClick={handleSearch}
//             className="bg-[#0037ff] hover:bg-[#FF9500] text-white rounded-xl lg:rounded-full h-11 md:h-16 w-full md:w-16 flex items-center gap-3 md:gap-0 justify-center cursor-pointer"
//           >
//             <span className="block lg:hidden text-base">Search</span>
//             <IoIosSearch className="text-2xl md:text-4xl" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { CiCircleMinus } from "react-icons/ci";
import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
import Image from "next/image";
import flag from "@/assets/flag.png";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

export default function SearchBar({scrolled}) {
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

  const handleSearch = () => {
    const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
    localStorage.setItem("location", location);
    localStorage.setItem("date", formattedDate);
    localStorage.setItem("StartDate", formattedDate);
    localStorage.setItem("bookingType", String(selected?.value));
    localStorage.setItem("Guests", guests.toString());

    route.push(
      selected?.value === true ? "/group-charter?type=GROUP" : "/search-charter"
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinations = destinations.filter((d: any) =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4" ref={containerRef}>
      <div
        className={`relative flex flex-col lg:flex-row items-center bg-white rounded-2xl lg:rounded-full shadow-2xl transition-all duration-500 border-2 ${
          activeTab ? "border-gray-200" : "border-white"
        }`}
      >
        <div className="flex flex-col lg:flex-row w-full items-center">
          {/* 1. WHERE */}
          <div
            onClick={() => setActiveTab("where")}
            className={`relative flex flex-col flex-1 px-8 py-4 cursor-pointer rounded-full transition-all duration-300 
            ${
              activeTab === "where"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1 className="text-[14px] font-bold text-black">Where</h1>
            <input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setSearchTerm(e.target.value);
              }}
              className="bg-transparent outline-none text-[15px] text-[#858585] mt-0.5 w-full"
            />
            <AnimatePresence>
              {activeTab === "where" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-0 w-[350px] bg-white shadow-2xl rounded-[24px] p-6 z-50 border border-gray-100"
                >
                  <h2 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-tight">
                    Popular Destinations
                  </h2>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredDestinations.map((dest: any) => (
                      <div
                        key={dest.city}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(dest.city);
                          setActiveTab(null);
                        }}
                        className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors"
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
                          <p className="text-xs text-gray-500">
                            {dest._count?.boatId} Charters
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DIVIDER 1 */}
          {!activeTab && (
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
          )}

          {/* 2. DATE */}
          <div
            onClick={() => setActiveTab("when")}
            className={`relative flex flex-col flex-1 px-8 py-4 cursor-pointer rounded-full transition-all duration-300 
            ${
              activeTab === "when"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1 className="text-[14px] font-bold text-black">When</h1>
            <span className="text-[15px] text-[#858585] mt-0.5">
              {selectedDate ? selectedDate.format("MMM DD, YYYY") : "Add dates"}
            </span>
            <AnimatePresence>
              {activeTab === "when" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-0 z-50 bg-white p-4 shadow-2xl rounded-[24px] border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DatePicker
                    open
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setActiveTab(null);
                    }}
                    className="opacity-0 h-0 w-0 absolute"
                  />
                  <style jsx global>{`
                    .ant-picker-dropdown {
                      position: static !important;
                      box-shadow: none !important;
                    }
                    .ant-picker-panel-container {
                      box-shadow: none !important;
                      border: none !important;
                    }
                  `}</style>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DIVIDER 2 */}
          {!activeTab && (
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
          )}

          {/* 3. WHO */}
          <div
            onClick={() => setActiveTab("who")}
            className={`relative flex flex-col flex-1 px-8 py-4 cursor-pointer rounded-full transition-all duration-300 
            ${
              activeTab === "who"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-200"
            }`}
          >
            <h1 className="text-[14px] font-bold text-black">Who</h1>
            <span className="text-[15px] text-[#858585] mt-0.5">
              {guests > 0 ? `${guests} Guests` : "Add guests"}
            </span>
            <AnimatePresence>
              {activeTab === "who" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] left-0 w-72 bg-white shadow-2xl rounded-[24px] p-8 z-50 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Guests</span>
                    <div className="flex items-center gap-4">
                      <CiCircleMinus
                        onClick={() =>
                          guests > 0 && setGuests((prev) => prev - 1)
                        }
                        className="size-9 text-gray-300 hover:text-black cursor-pointer transition-colors"
                      />
                      <span className="text-xl font-semibold w-5 text-center">
                        {guests}
                      </span>
                      <GoPlusCircle
                        onClick={() => setGuests((prev) => prev + 1)}
                        className="size-8 text-gray-300 hover:text-black cursor-pointer transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DIVIDER 3 */}
          {!activeTab && (
            <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
          )}

          {/* 4. BOOKING TYPE */}
          <div
            onClick={() => setActiveTab("type")}
            className={`relative flex flex-col flex-1 px-8 py-4 cursor-pointer rounded-full transition-all duration-300 
            ${
              activeTab === "type"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-[14px] font-bold text-black">Type</h1>
                <p className="text-[15px] text-[#858585] truncate mt-0.5">
                  {selected ? selected.title : "Select"}
                </p>
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${
                  activeTab === "type" ? "rotate-180" : ""
                }`}
              />
            </div>
            <AnimatePresence>
              {activeTab === "type" && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-[115%] right-0 w-[300px] bg-white shadow-2xl rounded-[24px] p-4 z-50 border border-gray-100"
                >
                  {bookingTypes.map((type) => (
                    <div
                      key={type.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(type);
                        setActiveTab(null);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer mb-1 border ${
                        selected?.title === type.title
                          ? "bg-blue-50 border-blue-100"
                          : "border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <h3 className="font-bold text-sm text-gray-800">
                        {type.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-2">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-[#0f5e9e] hover:bg-[#0f6e9e] text-white rounded-full transition-all shadow-md active:scale-90"
            >
              <IoIosSearch className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
