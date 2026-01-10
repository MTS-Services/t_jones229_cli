import Image from "next/image";

interface CardInfo {
  icon: string;
  title: string;
  description: string;
}

export default function ExperienceCard({ cardInfo }: { cardInfo: CardInfo }) {
  return (
    <div className="bg-white rounded-[16px] p-6 flex flex-col">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-full text-white">
        <Image
          src={cardInfo?.icon}
          alt="icon"
          height={100}
          width={100}
          className="h-6 w-6"
        />
      </div>
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold leading-8 text-[#242424] md:mt-4 mt-2">
        {cardInfo.title}
      </h2>
      {/* Description */}
      <p className="text-[#242424] text-base md:text-lg font-normal">
        {cardInfo.description}
      </p>
    </div>
  );
}
