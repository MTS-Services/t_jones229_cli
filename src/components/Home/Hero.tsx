"use client";

import { useEffect, useState } from "react";
import Button from "../ReUsible/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import board from "@/assets/boart.svg";

const content = [
  {
    line1: "Plan Your Perfect Day on the Water",

    desc: "Find the best fishing charters, expert captains, and unforgettable adventures—tailored to you. Join a group fishing charter or hire a private boat.",
    colorClass: "from-blue-300 to-cyan-500",
  },
  {
    line1:
      "Sign up today - First 6 months of membership free then $65 per month. Free cancellation anytime.",

    desc: "Join thousands of charter captains and guides connecting with anglers worldwide.",
    btn: "Click here to get started!",
    icon: board,
    colorClass: "from-orange-200 to-yellow-400",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % content.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const item = content[index];

  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-black">
      {/* Background Video */}
      <video
        src="/intro/introVideo.mp4"
        poster="/intro/introPoster.jpg"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Animated Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20 animate-float transition-all duration-700 text-white">
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-xl leading-tight max-w-3xl mx-auto break-words text-shadow-2xs text-shadow-sky-300 ${item.colorClass}`}>
          {item.line1}
          <br />
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-b  `}
          ></span>
        </h1>

        <p className="max-w-xl text-slate-200 text-lg md:text-xl mb-10 font-light leading-relaxed">
          {item.desc}
        </p>

        {item.btn && (
          <Button
            onClick={handleNavigation} // Use onClick instead of 'link' prop
            variant="primary"
            className="flex items-center font-satoshi rounded-[14px] text-base font-bold md:mt-3 mt-2 gap-2"
          >
            {item.icon && (
              <Image
                className="h-3 md:h-6 w-3 md:w-6"
                src={item.icon}
                alt="icon"
                width={24}
                height={24}
              />
            )}
            {item.btn}
          </Button>
        )}
      </div>
    </div>
  );
}
