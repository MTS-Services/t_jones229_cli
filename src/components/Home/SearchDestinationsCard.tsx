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
    <div className="bg-white rounded-[10px] custom-shadow">
      <div className="overflow-hidden rounded-t-[10px]">
        <Image
          src={cardInfo.image || placeholder}
          alt={cardInfo.title}
          height={200}
          width={200}
          className="w-full h-56 object-cover hover:scale-110  transition-transform duration-300 rounded-t-[10px] overflow-hidden"
        />
      </div>

      <div className="p-6">
        <div
          // href={"/search-charter"}
          onClick={handleClick}
          className="text-xl md:text-2xl text-[#171717] hover:text-[#fd9400] hover:underline transition-colors duration-300 ease-in-out font-bold mb-6 flex items-center leading-9 cursor-pointer"
        >
          {cardInfo.title}
          <span className="ml-2">
            <Image
              src={cardInfo.flag}
              alt="flag"
              height={100}
              width={100}
              className="w-6 h-6"
            />
          </span>
        </div>

        <p className="text-[#474747] text-base md:text-2xl font-normal leading-7">
          {cardInfo.subTitle}
        </p>
        <p className="text-[#9E9E9E] mt-2 text-base font-normal">
          {cardInfo.description}
        </p>
      </div>
    </div>
  );
}
