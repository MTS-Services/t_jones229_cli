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
      // Added "flex items-center justify-center" to the parent section
      className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-[600px] w-full"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: "#000",
      }}
    >
      {/* Overlay for better text readability (optional but recommended) */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto flex flex-col items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-2xl md:text-[40px] font-bold drop-shadow-lg">
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
