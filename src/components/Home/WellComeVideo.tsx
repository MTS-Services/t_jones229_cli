import React from "react";
import bgImage from "@/assets/videoImage.png";
import Container from "../common/Container";
import banner from "@/assets/banner.png";


export default function WellComeVideo() {
  return (
    <Container className="">
      <div
        style={{ 
          backgroundImage: `url(${banner.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
        className="relative px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row gap-8 justify-between items-center rounded-[20px] overflow-hidden min-h-[350px]"
      >
        <div className="absolute inset-0 bg-black/50 z-0" />

        <div className="relative z-10 text-left">
          <h1 className="text-3xl md:text-[48px] font-bold leading-tight text-white">
            Welcome to FishingTripper!
          </h1>
          <p className="max-w-2xl text-white/90 text-lg md:text-xl font-light mt-4 leading-relaxed">
            This video explains a bit more about what we offer and how to book a
            private or shared charter through our site.
          </p>
        </div>
      </div>
    </Container>
  );
}