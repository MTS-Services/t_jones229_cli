"use client";

import { usePathname } from "next/navigation";
import { titleSectionData } from "./titleSectionData";

interface SectionConfig {
  path: string;
  title: string;
  description: string;
}

export default function TitleSection() {
  const pathname = usePathname();

  const content = titleSectionData.find((item: SectionConfig) =>
    pathname.startsWith(item.path)
  );

  if (!content) return null;

  return (
    <div className="bg-[#F5F5F5] border-b border-gray-300 py-6 pl-[24px] pt-20 lg:pt-0">
      <h2 className="text-[32px] font-bold text-[#242424]">{content.title}</h2>
      <p className="font-[500] text-[#242424] mt-1">{content.description}</p>
    </div>
  );
}
