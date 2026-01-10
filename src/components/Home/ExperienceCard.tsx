import Image from "next/image";

interface CardInfo {
  icon: string;
  title: string;
  description: string;
}

interface ExperienceCardProps {
  cardInfo: CardInfo;
  isLast?: boolean;
}

export default function ExperienceCard({
  cardInfo,
  isLast,
}: ExperienceCardProps) {
  return (
    <div
      className={`bg-white rounded-[16px] p-6 flex flex-col shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md
      ${
        isLast
          ? "md:col-span-2 lg:col-span-1 md:w-[360px] md:mx-auto lg:max-w-full"
          : ""
      }`}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-full text-white mb-4">
        <Image
          src={cardInfo?.icon}
          alt="icon"
          height={100}
          width={100}
          className="h-6 w-6 object-contain"
        />
      </div>

      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold leading-8 text-[#242424] mb-2">
        {cardInfo.title}
      </h2>

      {/* Description */}
      <p className="text-[#242424]/80 text-base md:text-lg font-normal leading-relaxed">
        {cardInfo.description}
      </p>
    </div>
  );
}
