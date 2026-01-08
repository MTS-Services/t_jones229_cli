// "use client";

// import { DatePicker } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// import { ChevronDownIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { IoIosSearch } from "react-icons/io";
// import { GoPlusCircle } from "react-icons/go";
// import { CiCircleMinus } from "react-icons/ci";
// import { useGetBoatListByLocationQuery } from "@/redux/api/boatApi";
// import Image from "next/image";
// import flag from "@/assets/flag.png";
// import { motion, AnimatePresence, Variants } from "framer-motion";

// const dropdownVariants: Variants = {
//   hidden: { opacity: 0, y: 15, scale: 0.98 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.3, ease: "easeOut" },
//   },
//   exit: {
//     opacity: 0,
//     y: 10,
//     scale: 0.98,
//     transition: { duration: 0.2, ease: "easeIn" },
//   },
// };

// export default function SearchBar({ scrolled }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<string | null>(null);
//   const [selected, setSelected] = useState<any>(null);
//   const [guests, setGuests] = useState<number>(0);
//   const [location, setLocation] = useState("");
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const route = useRouter();

//   const { data } = useGetBoatListByLocationQuery({});
//   const destinations = data?.data || [];

//   const bookingTypes = [
//     {
//       title: "Private booking",
//       value: false,
//       description: "Hire out your own boat with a captain.",
//     },
//     {
//       title: "Shared booking",
//       value: true,
//       description: "Join other group bookings to fill a boat.",
//     },
//   ];

//   const handleSearch = () => {
//     const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
//     localStorage.setItem("location", location);
//     localStorage.setItem("date", formattedDate);
//     localStorage.setItem("StartDate", formattedDate);
//     localStorage.setItem("bookingType", String(selected?.value));
//     localStorage.setItem("Guests", guests.toString());

//     route.push(
//       selected?.value === true ? "/group-charter?type=GROUP" : "/search-charter"
//     );
//   };

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setActiveTab(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredDestinations = destinations.filter((d: any) =>
//     d.city.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full max-w-5xl mx-auto px-4" ref={containerRef}>
//       <div
//         className={`relative flex flex-col lg:flex-row items-center bg-white rounded-2xl lg:rounded-full shadow-2xl transition-all duration-500 border-2 ${
//           activeTab ? "border-gray-200" : "border-white"
//         }`}
//       >
//         <div className="flex flex-col lg:flex-row w-full items-center">
//           {/* 1. WHERE */}
//           <div
//             onClick={() => setActiveTab("where")}
//             className={`relative flex flex-col flex-1 px-5 py-2.5 cursor-pointer rounded-full transition-all duration-300
//             ${
//               activeTab === "where"
//                 ? "bg-white shadow-xl z-20"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             <h1 className="text-[14px] font-bold text-black">Where</h1>
//             <input
//               type="text"
//               placeholder="Search destinations"
//               value={location}
//               onChange={(e) => {
//                 setLocation(e.target.value);
//                 setSearchTerm(e.target.value);
//               }}
//               className="bg-transparent outline-none text-[15px] text-[#858585] w-full"
//             />
//             <AnimatePresence>
//               {activeTab === "where" && (
//                 <motion.div
//                   variants={dropdownVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="absolute top-[115%] left-0 w-[350px] bg-white shadow-2xl rounded-[24px] p-6 z-50 border border-gray-100"
//                 >
//                   <h2 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-tight">
//                     Popular Destinations
//                   </h2>
//                   <div className="max-h-60 overflow-y-auto custom-scrollbar">
//                     {filteredDestinations.map((dest: any) => (
//                       <div
//                         key={dest.city}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setLocation(dest.city);
//                           setActiveTab(null);
//                         }}
//                         className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="size-8 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
//                           <Image
//                             src={flag}
//                             alt="flag"
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-semibold text-black">
//                             {dest.city}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {dest._count?.boatId} Charters
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* DIVIDER 1 */}
//           {!activeTab && (
//             <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
//           )}

//           {/* 2. DATE */}
//           <div
//             onClick={() => setActiveTab("when")}
//             className={`relative flex flex-col flex-1 px-5 py-2.5 cursor-pointer rounded-full transition-all duration-300
//             ${
//               activeTab === "when"
//                 ? "bg-white shadow-xl z-20"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             <h1 className="text-[14px] font-bold text-black">When</h1>
//             <span className="text-[15px] text-[#858585] mt-0.5">
//               {selectedDate ? selectedDate.format("MMM DD, YYYY") : "Add dates"}
//             </span>
//             <AnimatePresence>
//               {activeTab === "when" && (
//                 <motion.div
//                   variants={dropdownVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="absolute top-[115%] left-0 z-50 bg-white p-4 shadow-2xl rounded-[24px] border border-gray-100"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <DatePicker
//                     open
//                     getPopupContainer={(trigger) => trigger.parentElement!}
//                     value={selectedDate}
//                     onChange={(date) => {
//                       setSelectedDate(date);
//                       setActiveTab(null);
//                     }}
//                     className="opacity-0 h-0 w-0 absolute"
//                   />
//                   <style jsx global>{`
//                     .ant-picker-dropdown {
//                       position: static !important;
//                       box-shadow: none !important;
//                     }
//                     .ant-picker-panel-container {
//                       box-shadow: none !important;
//                       border: none !important;
//                     }
//                   `}</style>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* DIVIDER 2 */}
//           {!activeTab && (
//             <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
//           )}

//           {/* 3. WHO */}
//           <div
//             onClick={() => setActiveTab("who")}
//             className={`relative flex flex-col flex-1 px-5 py-2.5 cursor-pointer rounded-full transition-all duration-300
//             ${
//               activeTab === "who"
//                 ? "bg-white shadow-xl z-20"
//                 : "hover:bg-gray-200"
//             }`}
//           >
//             <h1 className="text-[14px] font-bold text-black">Who</h1>
//             <span className="text-[15px] text-[#858585] mt-0.5">
//               {guests > 0 ? `${guests} Guests` : "Add guests"}
//             </span>
//             <AnimatePresence>
//               {activeTab === "who" && (
//                 <motion.div
//                   variants={dropdownVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="absolute top-[115%] left-0 w-72 bg-white shadow-2xl rounded-[24px] p-8 z-50 border border-gray-100"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-bold">Guests</span>
//                     <div className="flex items-center gap-4">
//                       <CiCircleMinus
//                         onClick={() =>
//                           guests > 0 && setGuests((prev) => prev - 1)
//                         }
//                         className="size-9 text-gray-300 hover:text-black cursor-pointer transition-colors"
//                       />
//                       <span className="text-xl font-semibold w-5 text-center">
//                         {guests}
//                       </span>
//                       <GoPlusCircle
//                         onClick={() => setGuests((prev) => prev + 1)}
//                         className="size-8 text-gray-300 hover:text-black cursor-pointer transition-colors"
//                       />
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* DIVIDER 3 */}
//           {!activeTab && (
//             <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>
//           )}

//           {/* 4. BOOKING TYPE */}
//           <div
//             onClick={() => setActiveTab("type")}
//             className={`relative flex flex-col flex-1 px-5 py-2.5 cursor-pointer rounded-full transition-all duration-300
//             ${
//               activeTab === "type"
//                 ? "bg-white shadow-xl z-20"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             <div className="flex justify-between items-center h-full">
//               <div className="flex flex-col overflow-hidden">
//                 <h1 className="text-[14px] font-bold text-black">Type</h1>
//                 <p className="text-[15px] text-[#858585] truncate mt-0.5">
//                   {selected ? selected.title : "Select"}
//                 </p>
//               </div>
//               <ChevronDownIcon
//                 className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${
//                   activeTab === "type" ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             <AnimatePresence>
//               {activeTab === "type" && (
//                 <motion.div
//                   variants={dropdownVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                   className="absolute top-[115%] right-0 w-[300px] bg-white shadow-2xl rounded-[24px] p-4 z-50 border border-gray-100"
//                 >
//                   {bookingTypes.map((type) => (
//                     <div
//                       key={type.title}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelected(type);
//                         setActiveTab(null);
//                       }}
//                       className={`p-4 rounded-2xl cursor-pointer mb-1 border ${
//                         selected?.title === type.title
//                           ? "bg-blue-50 border-blue-100"
//                           : "border-transparent hover:bg-gray-100"
//                       }`}
//                     >
//                       <h3 className="font-bold text-sm text-gray-800">
//                         {type.title}
//                       </h3>
//                       <p className="text-[11px] text-gray-500 mt-1">
//                         {type.description}
//                       </p>
//                     </div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* SEARCH BUTTON */}
//           <div className="p-2">
//             <button
//               onClick={handleSearch}
//               className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-[#0f5e9e] hover:bg-[#0f6e9e] text-white rounded-full transition-all shadow-md active:scale-90"
//             >
//               <IoIosSearch className="text-2xl" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ===============================

"use client";

import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
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

export default function SearchBar({ scrolled }: { scrolled: boolean }) {
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

  const isExpanded = activeTab !== null || !scrolled;

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
    <div
      className={`w-full mx-auto px-4 transition-all duration-500 ease-in-out ${
        isExpanded ? "max-w-5xl" : "max-w-xl"
      }`}
      ref={containerRef}
    >
      <div
        className={`relative flex flex-col lg:flex-row items-center bg-white rounded-2xl md:rounded-full shadow-2xl transition-all duration-500 border-2 ${
          activeTab ? "border-gray-200" : "border-white"
        } ${isExpanded ? "py-0" : "py-1"}`}
      >
        <div className="flex flex-col md:flex-row w-full items-center justify-between">
          {/* 1. WHERE - Flex basis adjusted */}
          <div
            onClick={() => setActiveTab("where")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              !isExpanded
                ? "px-3 py-1.5 items-center flex-[0.8]"
                : "px-6 py-3 flex-1"
            } 
            ${
              activeTab === "where"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                !isExpanded ? "text-[13px]" : "text-[15px]"
              }`}
            >
              Where
            </h1>
            {isExpanded ? (
              <input
                autoFocus={activeTab === "where"}
                type="text"
                placeholder="Search"
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
                >
                  <h2 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-tight">
                    Destinations
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
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!activeTab && (
            <div
              className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
                !isExpanded ? "h-4" : "h-8"
              }`}
            ></div>
          )}

          {/* 2. DATE */}
          <div
            onClick={() => setActiveTab("when")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              !isExpanded
                ? "px-2 py-1.5 items-center flex-[0.6]"
                : "px-6 py-3 flex-1"
            } 
            ${
              activeTab === "when"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                !isExpanded ? "text-[13px]" : "text-[15px]"
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
                <span className="text-[10px] text-blue-600 font-bold">
                  {selectedDate.format("MMM DD")}
                </span>
              )
            )}
          </div>

          {!activeTab && (
            <div
              className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
                !isExpanded ? "h-4" : "h-8"
              }`}
            ></div>
          )}

          {/* 3. WHO */}
          <div
            onClick={() => setActiveTab("who")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              !isExpanded
                ? "px-2 py-1.5 items-center flex-[0.5]"
                : "px-6 py-3 flex-1"
            } 
            ${
              activeTab === "who"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                !isExpanded ? "text-[13px]" : "text-[15px]"
              }`}
            >
              Who
            </h1>
            {isExpanded ? (
              <span className="text-[12px] text-[#858585] mt-0.5">
                {guests > 0 ? `${guests} G` : "Add guests"}
              </span>
            ) : (
              guests > 0 && (
                <span className="text-[10px] text-blue-600 font-bold">
                  {guests} G
                </span>
              )
            )}
          </div>

          {!activeTab && (
            <div
              className={`hidden lg:block w-[1px] bg-gray-200 transition-all ${
                !isExpanded ? "h-4" : "h-8"
              }`}
            ></div>
          )}

          {/* 4. TYPE */}
          <div
            onClick={() => setActiveTab("type")}
            className={`relative flex flex-col cursor-pointer rounded-full transition-all duration-300 
            ${
              !isExpanded
                ? "px-2 py-1.5 items-center flex-[0.6]"
                : "px-6 py-3 flex-1"
            } 
            ${
              activeTab === "type"
                ? "bg-white shadow-xl z-20"
                : "hover:bg-gray-100"
            }`}
          >
            <h1
              className={`font-extrabold text-black transition-all ${
                !isExpanded ? "text-[13px]" : "text-[15px]"
              }`}
            >
              Type
            </h1>
            {isExpanded && (
              <p className="text-[12px] text-[#858585] truncate mt-0.5">
                {selected ? selected.title : "Select"}
              </p>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <div className="p-1.5">
            <button
              onClick={handleSearch}
              className={`flex items-center justify-center bg-[#105d9e] hover:bg-[#0c4a7e] text-white rounded-full transition-all shadow-md active:scale-90 ${
                !isExpanded ? "w-8 h-8" : "w-12 h-12 lg:w-14 lg:h-14"
              }`}
            >
              <IoIosSearch
                className={`${!isExpanded ? "text-lg" : "text-2xl"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
