import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="mt-36 h-[85vh] xl:px-6 lg:px-5 md:px-4 px-3">
      <div className="container mx-auto px-7 pt-8 pb-24 bg-[#f0f6ff] rounded-lg">
        <h1 className="font-sk-modernist text-black text-xl md:text-[40px] font-extrabold leading-normal md:leading-[60px] tracking-tight mb-6 ">
          You have been added to the waitlist and we&apos;ll <br /> be in touch
          soon.
        </h1>

        <div className="space-y-4">
          <p className="font-inter text-[#242424] text-base md:text-lg font-normal leading-7">
            The captain can choose to get in touch with you if he has other
            potential customers on the same date and location who are interested
            in a group booking.
          </p>

          <p className="font-inter text-[#242424] text-base md:text-[18px] font-normal leading-7">
            <span className="text-base md:text-xl font-bold">
              {" "}
              Want to guarantee your trip?{" "}
            </span>
            <Link href="/" className="text-blue-600 underline">
              Search for a private hire
            </Link>{" "}
            instead.
          </p>
        </div>
      </div>
    </div>
  );
}
