"use client";

import React from "react";
import Button from "../ReUsible/Button";
import Image from "next/image";

interface BannerProps {
  title: string;
  description: string;
  button?: boolean;
  buttonTitle?: string;
  boardImage?: string;
  backgroundImage?: string;
}

const ReUseAbleBanner: React.FC<BannerProps> = ({
  title,
  description,
  backgroundImage,
  button,
  boardImage,
  buttonTitle,
}) => {
  return (
    <section
      // Added "flex items-center justify-center" to the parent section
      className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-[500px] w-full"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: "#000",
      }}
    >
      {/* Overlay for better text readability (optional but recommended) */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto flex flex-col gap-6 items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-3xl md:text-4xl lg:text-[50px] font-bold leading-[28px] md:leading-[34px] lg:leading-[50px]">
          {title}
        </h1>
        <p className="max-w-2xl text-base md:text-xl font-normal tracking-tight">
          {description}
        </p>
        {button && (
          <Button
            link="/boat-list-form/Information"
            variant="primary"
            className="flex items-center font-satoshi rounded-[14px] text-base font-bold md:mt-3 mt-2 gap-2"
          >
            {boardImage && (
              <Image
                className="h-3 md:h-6 w-3 md:w-6"
                src={boardImage}
                alt="icon"
                width={24}
                height={24}
              />
            )}
            {buttonTitle}
          </Button>
        )}
      </div>
    </section>
  );
};

export default ReUseAbleBanner;
