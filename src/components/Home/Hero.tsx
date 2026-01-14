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
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const isLoggedIn = false;

  const handleNavigation = () => {
    const targetPath = "/dashboard/check-your-trip";

    if (isLoggedIn) {
      router.push(targetPath);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % content.length);
        setIsVisible(true);
      }, 500);
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
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Animated Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-20">
        {/* Heading with fade animation */}
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-xl leading-tight max-w-4xl mx-auto break-words text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span
            className={`bg-gradient-to-r ${item.colorClass} bg-clip-text text-transparent`}
          >
            {item.line1}
          </span>
        </h1>

        {/* Description with fade animation */}
        <p
          className={`max-w-xl text-slate-200 text-lg md:text-xl mb-10 font-light leading-relaxed transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {item.desc}
        </p>

        {/* Button with fade animation - only when btn exists */}
        {item.btn && (
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <Button
              onClick={handleNavigation}
              variant="primary"
              className="flex items-center font-satoshi rounded-[14px] text-base font-bold md:mt-3 mt-2 gap-2 hover:scale-105 active:scale-95 transition-transform duration-300"
            >
              {item.icon && (
                <Image
                  className="h-3 md:h-6 w-3 md:w-6 transition-transform duration-300 group-hover:rotate-12"
                  src={item.icon}
                  alt="icon"
                  width={24}
                  height={24}
                />
              )}
              {item.btn}
            </Button>
          </div>
        )}

        {/* Optional: Navigation dots (if you want to keep them) */}
        <div className="flex space-x-2 mt-8">
          {content.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setIndex(i);
                  setIsVisible(true);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
