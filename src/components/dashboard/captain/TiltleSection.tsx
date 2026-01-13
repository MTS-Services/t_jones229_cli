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
    <div className="sticky top-0 z-50 border-b border-gray-200">
      {/* Header */}
      <div className="bg-[#f7f7f7] lg:px-10 md:px-8 px-6 lg:py-5 md:py-4 py-3">
        <h1 className="md:text-3xl text-2xl font-bold text-gray-800 mb-2">
          {content.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          {content.description}
        </p>
      </div>
    </div>
  );
}
