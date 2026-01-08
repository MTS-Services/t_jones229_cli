"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function Hero() {
  return (
    <div className="relative w-full h-[700px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video - Full Width and Full Height */}
      <video
        src="/intro/introVideo.mp4"
        poster="/intro/introPoster.jpg"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-contain md:object-cover" 
      ></video>

      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto flex flex-col gap-6 items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-3xl md:text-4xl lg:text-[50px] font-bold">
          Plan Your Perfect Day on the Water
        </h1>
        <p className="max-w-2xl text-base md:text-xl font-normal tracking-tight">
         Find the best fishing charters, expert captains, and unforgettable adventures—tailored to you. Join a group fishing charter or hire a private boat.
        </p>
      </div>
    </div>
  );
}