"use client";

import React from "react";
import Button from "../ReUsible/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BannerProps {
  title?: string;
  description?: string;
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
  const router = useRouter();

  // Replace this with your actual auth logic (e.g., const { user } = useAuth())
  const isLoggedIn = false;

  const handleNavigation = () => {
    const targetPath = "/dashboard/check-your-trip";

    if (isLoggedIn) {
      router.push(targetPath);
    } else {
      // We pass the targetPath as a 'callback' or 'redirect' query parameter
      // so the login page knows where to send the user after they log in.
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  return (
    <section
      className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-[500px] w-full"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: "#000",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 container mx-auto flex flex-col gap-6 items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-3xl md:text-4xl lg:text-[50px] font-bold leading-tight">
          {title ? title : ""}
        </h1>
        <p className="max-w-2xl text-base md:text-xl font-normal tracking-tight">
          {description ? description : ""}
        </p>

        {button && (
          <Button
            onClick={handleNavigation} // Use onClick instead of 'link' prop
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
