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
      className={`cursor-pointer ${
        isLast
          ? "w-full md:max-w-[352px] md:mx-auto md:col-span-2 lg:col-span-1 lg:max-w-full"
          : "w-full"
      }`}
      onClick={handleClick}
    >
      {/* Container for Image and Overlays */}
      <div className="relative overflow-hidden rounded-sm md:rounded-2xl w-full h-[380px]">
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
        <div className="absolute top-4 left-4 z-20 bg-white/50 rounded-full p-0.5 shadow-md">
          <Image
            src={cardInfo.flag}
            alt="flag"
            height={32}
            width={32}
            className="  object-cover rounded-full"
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
