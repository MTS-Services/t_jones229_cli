"use client";

import React from "react";

interface BannerProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

const ReUseAbleBanner: React.FC<BannerProps> = ({
  title,
  description,
  backgroundImage,
}) => {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat pt-[150px] pb-[120px] h-[600px]"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: "#000",
      }}
    >
      {/* Added mx-auto for horizontal centering and kept your flex-col items-center */}
      <div className="container mx-auto flex flex-col items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-2xl md:text-[40px] font-bold drop-shadow-md">
          {title}
        </h1>
        <p className="max-w-2xl text-base md:text-xl font-normal tracking-tight mt-3">
          {description}
        </p>
      </div>
    </section>
  );
};

export default ReUseAbleBanner;
