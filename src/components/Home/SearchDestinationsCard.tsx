// "use client";

// import Image from "next/image";

// import placeholder from "@/assets/placeholder.webp";
// import { useRouter } from "next/navigation";

// interface CardInfo {
//   image: string;
//   title: string;
//   flag: string;
//   subTitle: string;
//   description: string;
// }

// export default function SearchDestinationsCard({
//   cardInfo,
// }: {
//   cardInfo: CardInfo;
// }) {
//   const router = useRouter();
//   const handleClick = () => {
//     localStorage.setItem("location", cardInfo.title);
//     router.push("/search-charter");
//   };
//   return (
//     <div className="bg-white rounded-[10px] custom-shadow">
//       <div className="overflow-hidden rounded-t-[10px]">
//         <Image
//           src={cardInfo.image || placeholder}
//           alt={cardInfo.title}
//           height={200}
//           width={200}
//           className="w-full h-56 object-cover hover:scale-110  transition-transform duration-300 rounded-t-[10px] overflow-hidden"
//         />
//       </div>

//       <div className="p-6">
//         <div
//           // href={"/search-charter"}
//           onClick={handleClick}
//           className="text-xl md:text-2xl text-[#171717] hover:text-[#fd9400] hover:underline transition-colors duration-300 ease-in-out font-bold mb-6 flex items-center leading-9 cursor-pointer"
//         >
//           {cardInfo.title}
//           <span className="ml-2">
//             <Image
//               src={cardInfo.flag}
//               alt="flag"
//               height={100}
//               width={100}
//               className="w-6 h-6"
//             />
//           </span>
//         </div>

//         <p className="text-[#474747] text-base md:text-2xl font-normal leading-7">
//           {cardInfo.subTitle}
//         </p>
//         <p className="text-[#9E9E9E] mt-2 text-base font-normal">
//           {cardInfo.description}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import placeholder from "@/assets/placeholder.webp";
import { useRouter } from "next/navigation";

interface CardInfo {
  image: string;
  title: string;
  flag: string;
  subTitle: string;
  description: string;
}

interface ExperienceCardProps {
  cardInfo: CardInfo;
  isLast?: boolean;
}

export default function SearchDestinationsCard({
  cardInfo,
  isLast,
}: ExperienceCardProps) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("location", cardInfo.title);
    router.push("/search-charter");
  };

  return (
    <div
      className={`group cursor-pointer ${
        isLast
          ? "w-full md:max-w-[352px] md:mx-auto md:col-span-2 lg:col-span-1 lg:max-w-full"
          : "w-full"
      }`}
      onClick={handleClick}
    >
      {/* Container for Image and Overlays */}
      <div className="relative overflow-hidden rounded-[16px] w-full h-[380px]">
        {/* Main Background Image */}
        <Image
          src={cardInfo.image || placeholder}
          alt={cardInfo.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
          className="object-cover"
          priority={false}
        />

        {/* 1. Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* 2. Flag Icon */}
        <div className="absolute top-4 left-4 z-20">
          <Image
            src={cardInfo.flag}
            alt="flag"
            height={32}
            width={32}
            className="w-8 h-8 object-contain rounded-full shadow-md"
          />
        </div>

        {/* 3. Text Content */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
          <div className="space-y-1.5 transform translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <p className="text-base text-gray-200 font-normal leading-tight mt-1">
              {cardInfo.subTitle}
            </p>

            <h3 className="text-xl font-semibold text-white truncate leading-tight">
              {cardInfo.title}
            </h3>

            <p className="text-lg text-white mt-1 font-medium">
              {cardInfo.description.length > 35
                ? cardInfo.description.substring(0, 35) + "..."
                : cardInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
