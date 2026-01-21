// "use client";

// import DetailsCarousel from "@/components/DetailsPage/DetailsCarousel";
// import React, { useEffect, useState } from "react";
// import image from "@/assets/capt.png";
// import Image from "next/image";
// import { IoLocationOutline } from "react-icons/io5";
// import Faq from "@/components/DetailsPage/Faq";
// import KeyFeature from "@/components/DetailsPage/KeyFeature";
// import PricingCard from "@/components/DetailsPage/PriceingCard";
// import { useParams } from "next/navigation";
// import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
// import Loader from "@/components/ui/Loader";
// import PaymentMap from "@/components/Payment/PaymentMap";
// import Container from "@/components/common/Container";

// export default function Page() {
//   const [location, setLocation] = useState<string | null>();
//   const [date, setDate] = useState<string | null>();
//   const [guests, setGuests] = useState<string | null>();
//   const params = useParams();
//   const id = params?.id;

//   useEffect(() => {
//     const location = localStorage.getItem("location");
//     setLocation(location);
//     const startDate = localStorage.getItem("StartDate");
//     setDate(startDate);

//     const guests = localStorage.getItem("Guests");
//     setGuests(guests);
//   }, []);

//   const { data, isLoading } = useGetSingleBoatQuery(id);
//   const boatInfo = data?.data;

//   if (isLoading) {
//     return <Loader />;
//   }
//   return (
//     <Container className="">
//       {/* <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mt-10 px-5 lg:px-2"> */}
//       <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
//         <div className="col-span-1 order-1 md:order-1">
//           <DetailsCarousel product={boatInfo?.photos} />
//         </div>
//         <div className="col-span-1 order-2 md:order-2">
//           <div>
//             <h1 className="text-xl md:text-3xl text-[#242424] font-bold">
//               {boatInfo?.descriptions?.[0]?.listingTypeTitle}
//             </h1>
//             <p className="text-base text-[#878787] font-normal font-satoshi mt-3">
//               {boatInfo?.descriptions?.[0]?.listingTypeDescription}
//             </p>
//           </div>

//           <div className="border-y border-[#D9D9D9] mt-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between py-6">
//               <div className="flex items-center gap-4">
//                 <Image
//                   src={image}
//                   alt="capten"
//                   height={100}
//                   width={100}
//                   className="h-16 w-16"
//                 />

//                 <h1 className="text-base font-bold text-[#242424]">
//                   Captain{" "}
//                   <span className=" font-normal text-[#878787]">
//                     {boatInfo?.captain?.firstName}{" "}
//                     {boatInfo?.captain?.lastName
//                       ? boatInfo?.captain?.lastName
//                       : "N/A"}
//                   </span>
//                 </h1>
//               </div>
//               <span className="text-[#9E9E9E] text-base font-normal leading-7 flex items-center gap-1">
//                 <IoLocationOutline className="text-[#FF9500] h-6 w-6 font-bold" />
//                 {boatInfo?.meetingPoint?.[0]?.city}
//               </span>
//             </div>
//           </div>

//           {/* FIX APPLIED HERE: Passing the correct object type to PaymentMap */}
//           <div className="">
//             <PaymentMap location={boatInfo?.meetingPoint?.[0]} />
//           </div>

//           <div className="border-b border-[#D9D9D9] pb-4">
//             <KeyFeature boatInfo={boatInfo} />
//           </div>

//           <div>
//             <h1 className="text-base font-bold text-[#171717] mt-4">
//               See the details
//             </h1>

//             <Faq />
//           </div>
//         </div>
//       </div>

//       {/* Select your trip */}
// <div className="mt-5 md:mt-24  px-5 lg:px-2">
//   <h1 className="text-xl md:text-[40px] text-[#242424] font-bold leading-7">
//     Select your trip
//   </h1>
//   <h1 className="text-lg md:text-2xl text-[#242424] font-bold py-6">
//     {location ? location : ""}
//     {" / "}
//     {date && !isNaN(new Date(date).getTime())
//       ? new Date(date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         })
//       : ""}{" "}
//     / {guests} people
//   </h1>

//   <div className="w-full">
//     {boatInfo &&
//       boatInfo?.trips?.map((card: any) => (
//         <PricingCard
//           key={card.id}
//           tripInfo={card}
//           boatId={id}
//           image={boatInfo?.photos?.[0]?.url}
//         />
//       ))}
//   </div>
// </div>
//     </Container>
//   );
// }

"use client";

import DetailsCarousel from "@/components/DetailsPage/DetailsCarousel";
import React, { useEffect, useState, useRef } from "react";
import image from "@/assets/capt.png";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { ChevronDown, Calendar, Users } from "lucide-react"; // Added Icons
import Faq from "@/components/DetailsPage/Faq";
import KeyFeature from "@/components/DetailsPage/KeyFeature";
import PricingCard from "@/components/DetailsPage/PriceingCard";
import { useParams } from "next/navigation";
import { useGetSingleBoatQuery } from "@/redux/api/boatApi";
import Loader from "@/components/ui/Loader";
import PaymentMap from "@/components/Payment/PaymentMap";
import Container from "@/components/common/Container";

export default function Page() {
  const [location, setLocation] = useState<string | null>();
  const [date, setDate] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const id = params?.id as string;

  // Style for our inputs to keep them looking the same
  const inputStyles =
    "w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] transition-all cursor-pointer text-gray-700";

  useEffect(() => {
    const storedLoc = localStorage.getItem("location");
    setLocation(storedLoc);
    const storedDate = localStorage.getItem("StartDate");
    if (storedDate) setDate(storedDate);
    const storedGuests = localStorage.getItem("Guests");
    if (storedGuests) setGuests(Number(storedGuests));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading } = useGetSingleBoatQuery(id);
  const boatInfo = data?.data;

  if (isLoading) return <Loader />;

  return (
    <Container className="">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 lg:mt-30 md:mt-28 mt-24 mt-20">
        <div className="col-span-1 order-1">
          <DetailsCarousel product={boatInfo?.photos} />
        </div>
        <div className="col-span-1 order-2">
          <div>
            <h1 className="text-xl md:text-3xl text-[#242424] font-bold">
              {boatInfo?.descriptions?.[0]?.listingTypeTitle}
            </h1>
            <p className="text-base text-[#878787] font-normal mt-3">
              {boatInfo?.descriptions?.[0]?.listingTypeDescription}
            </p>
          </div>

          <div className="border-y border-[#D9D9D9] mt-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={image}
                  alt="captain"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />
                <h1 className="text-base font-bold text-[#242424]">
                  Captain{" "}
                  <span className="font-normal text-[#878787]">
                    {boatInfo?.captain?.firstName}
                  </span>
                </h1>
              </div>
              <span className="text-[#9E9E9E] flex items-center gap-1">
                <IoLocationOutline className="text-[#FF9500] h-6 w-6" />
                {boatInfo?.meetingPoint?.[0]?.city}
              </span>
            </div>
          </div>

          <div className="my-4">
            <PaymentMap location={boatInfo?.meetingPoint?.[0]} />
          </div>

          <div className="border-b border-[#D9D9D9] pb-4">
            <KeyFeature boatInfo={boatInfo} />
          </div>
          <Faq />
        </div>
      </div>

      {/* TRIP SELECTION SECTION */}
      <div className="mt-10 md:mt-20 px-5 lg:px-2">
        <div className="mt-5 md:mt-24  px-5 lg:px-2">
          <h1 className="text-xl md:text-[40px] text-[#242424] font-bold leading-7">
            Select your trip
          </h1>
          <h1 className="text-lg md:text-2xl text-[#242424] font-bold py-6">
            {location ? location : ""}
            {" / "}
            {date && !isNaN(new Date(date).getTime())
              ? new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : ""}{" "}
            / {guests} people
          </h1>

          <div className="w-full">
            {boatInfo.trips.map((trip: any) => (
              <PricingCard
                key={trip.id}
                tripInfo={trip}
                boatId={id}
                image={boatInfo?.photos?.[0]?.url}
                // REMOVED boatInfo prop to fix TypeScript error
              />
            ))}
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Trip Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputStyles} appearance-none block w-full`}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative" ref={guestDropdownRef}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Group Size
            </label>
            <button
              type="button"
              onClick={() => setIsGuestOpen(!isGuestOpen)}
              className={inputStyles}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {guests} {guests === 1 ? "Guest" : "Guests"}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isGuestOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isGuestOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                  <div
                    key={num}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-gray-700 transition-colors border-b last:border-none"
                    onClick={() => {
                      setGuests(num);
                      setIsGuestOpen(false);
                    }}
                  >
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

        {/* <div className="w-full space-y-4">
          {boatInfo?.trips?.map((card: any) => (
            <PricingCardCaptain
              key={card.id}
              tripInfo={card}
              boatId={id}
              image={boatInfo?.photos?.[0]?.url}
            />
          ))}
        </div> */}
      </div>
    </Container>
  );
}
