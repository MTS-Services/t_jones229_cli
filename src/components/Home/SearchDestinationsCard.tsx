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

export default function SearchDestinationsCard({
  cardInfo,
}: {
  cardInfo: CardInfo;
}) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("location", cardInfo.title);
    router.push("/search-charter");
  };

  return (
    // Removed max-w-[320px] to let the grid control the width
    <div className="w-full cursor-pointer group" onClick={handleClick}>
      {/* 1. Added 'relative' so the 'fill' image knows what to attach to.
          2. Ensure height is defined (h-[320px]).
      */}
      <div className="relative overflow-hidden rounded-[16px] w-full h-[380px]">
        <Image
          src={cardInfo.image || placeholder}
          alt={cardInfo.title}
          fill // This makes the image fill the parent div
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="mt-3 px-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[16px] font-bold text-[#171717] truncate leading-tight">
            {cardInfo.title}
          </h3>
          <div className="flex items-center gap-1 min-w-fit">
            <Image
              src={cardInfo.flag}
              alt="flag"
              height={24} // Smaller fixed size for flags is better
              width={24}
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>

        <p className="text-[15px] text-[#474747] font-normal leading-tight mt-1">
          {cardInfo.subTitle}
        </p>

        <p className="text-[15px] text-[#171717] mt-1 font-semibold">
          {cardInfo.description}
        </p>
      </div>
    </div>
  );
}
