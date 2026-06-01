import React from "react";
import Container from "../common/Container";
import banner from "@/assets/banner.png";

export default function WellComeVideo() {
  return (
    <Container>
      <div
        style={{
          backgroundImage: `url(${banner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24 
                   flex flex-col md:flex-row 
                   gap-6 md:gap-8 
                   justify-between items-center 
                   lg:rounded-2xl rounded-sm overflow-hidden 
                   min-h-[300px] sm:min-h-[350px]"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* Content */}
        <div className="relative z-10 text-center md:text-left">
          <h1
            className="text-2xl sm:text-3xl md:text-5xl 
                         mb-3 font-bold leading-tight text-white"
          >
            Welcome to <span>The Fishing Hub!</span>
          </h1>

          <p
            className="max-w-full sm:max-w-lg md:max-w-2xl 
                        text-white text-sm sm:text-base md:text-lg 
                        font-light leading-relaxed"
          >
            This video explains a bit more about what we offer and how to book a
            private or shared charter through our site.
          </p>
        </div>
      </div>
    </Container>
  );
}
