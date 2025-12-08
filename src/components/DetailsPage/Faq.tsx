"use client";

import React from "react";
import { Collapse, Space } from "antd";
import up from "@/assets/icon/up.svg";
import down from "@/assets/icon/down.svg";
import Image from "next/image";

type FaqItem = {
  key: React.Key;
  label: React.ReactNode;
  content: React.ReactNode;
};

interface FaqProps {
  items?: FaqItem[];
}

const Faq: React.FC<FaqProps> = ({ items }) => {
  // Custom expand/collapse icon
  const expandIcon = ({ isActive }: { isActive?: boolean }) =>
    isActive ? (
      <Image src={up} alt="up arrow" className="size-4" />
    ) : (
      <Image src={down} alt="down arrow" className="size-4" />
    );

  return (
    <Space direction="vertical" className="w-full mt-4">
      {items?.map(({ key, label, content }) => (
        <Collapse
          key={key}
          expandIcon={expandIcon}
          expandIconPosition="end"
          size="large"
          className="border border-[#C5C5C5] rounded-[4px] shadow-sm bg-white"
          items={[
            {
              key,
              label: (
                <div className="text-sm md:text-base text-[#6C757D] font-bold hover:text-black cursor-pointer transition-colors duration-200">
                  {label}
                </div>
              ),
              children: (
                <p className="text-sm md:text-base text-[#6C757D] leading-relaxed ">
                  {content}
                </p>
              ),
            },
          ]}
        />
      ))}
    </Space>
  );
};

export default Faq;
