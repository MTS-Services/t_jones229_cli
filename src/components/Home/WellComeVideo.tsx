import React from "react";
import Container from "../common/Container";
import banner from "@/assets/banner.png";

export default function WellComeVideo() {
  return (
    <Container className="">
      <div
        style={{
          backgroundImage: `url(${banner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row gap-8 justify-between items-center rounded-[20px] overflow-hidden min-h-[350px]"
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10">
          <h1 className="text-3xl md:text-[48px] mb-2 font-bold leading-tight text-white">
            Welcome to <span className="">FishingTripper!</span>
          </h1>
          <p className="max-w-md md:max-w-2xl text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
            This video explains a bit more about what we offer and how to book a
            private or shared charter through our site.
          </p>
          {/* <button className="mt-4 px-6 py-2 bg-[#0f5d9e] text-white rounded-lg hover:bg-[#0d4a7a] transition-colors duration-300">
            Get Started
          </button> */}
        </div>
      </div>
    </Container>
  );
}
