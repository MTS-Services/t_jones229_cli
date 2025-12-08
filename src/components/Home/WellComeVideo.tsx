import React from "react";
import bgImage from "@/assets/videoImage.png";

export default function WellComeVideo() {
  return (
    <div className="container mx-auto mt-28 px-5 xl:px-0">
      <div
        style={{ backgroundImage: `url(${bgImage.src})` }}
        className="relative z-[-1] px-5 md:pl-10 py-5 flex flex-col md:flex-row gap-5 justify-between rounded-[16] bg-cover bg-center"
      >
        <div>
          <h1 className="text-xl md:text-[40px] font-normal leading-10 text-white">
            Welcome to FishingTripper!
          </h1>
          <p className="max-w-2xl text-white text-base md:text-2xl font-light tracking-[-0.43px] mt-4">
            This video explains a bit more about what we offer and how to book a
            private or shared charter through our site.
          </p>
        </div>

        <div className="z-0">
          <video
            src={"/intro/introVideo.mp4"}
            height={200}
            width={500}
            autoPlay
            muted
            loop
            playsInline
            className="rounded-xl"
          ></video>
        </div>
      </div>
    </div>
  );
}
