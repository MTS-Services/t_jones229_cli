import React from "react";
import bgImage from "@/assets/videoImage.png";
import Container from "../common/Container";

export default function WellComeVideo() {
  return (
    <Container className="">
      <div
        // Changed z-[-1] to relative, and fixed rounded-[16px]
        style={{ backgroundImage: `url(${bgImage.src})` }}
        className="relative px-5 md:pl-10 py-10 flex flex-col md:flex-row gap-8 justify-between items-center rounded-[16px] bg-cover bg-center overflow-hidden"
      >
        {/* Optional: Dark Overlay to make text readable against the background image */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        <div className="relative z-10">
          <h1 className="text-xl md:text-[40px] font-normal leading-tight text-white">
            Welcome to FishingTripper!
          </h1>
          <p className="max-w-2xl text-white text-base md:text-2xl font-light tracking-[-0.43px] mt-4">
            This video explains a bit more about what we offer and how to book a
            private or shared charter through our site.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <video
            src="/intro/introVideo.mp4"
            poster="/intro/introPoster.jpg"
            muted
            loop
            playsInline
            preload="none"
            className="rounded-xl w-full md:max-w-[500px] shadow-2xl"
            controls
          ></video>
        </div>
      </div>
    </Container>
  );
}