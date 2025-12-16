"use client";

import image1 from "@/assets/Carousel.png";
import Button from "@/components/ReUsible/Button";
import { RootState } from "@/redux/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const [tripDate, setTripDate] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTripDate(localStorage.getItem("date"));
      setNumberOfGuests(localStorage.getItem("Guests"));
      setBookingType(localStorage.getItem("bookingType"));
      setLocation(localStorage.getItem("location"));
    }
  }, []);

  return (
    <div>
      <div className="bg-[#F5F5F5] ">
        <div className="container mx-auto pt-10 pb-6 px-5 lg:px-2">
          <h1 className="text-xl md:text-2xl text-[#242424] font-bold leading-9">
            Your Fishing Trip is Confirmed!
          </h1>
          <h1 className="text-base md:text-2xl text-[#474747] font-normal font-satoshi mt-2">
            Thanks for booking with us! We’ve sent the full details to your
            email at <span className="text-[#0037FF]">{user?.email}</span>. If
            you don’t see it, check your spam folder or contact us.
          </h1>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-14 ml-auto items-center justify-between">
        <div className="container flex flex-col items-start justify-start lg:justify-center lg:items-center px-5">
          <div>
            <h1 className="text-xl md:text-3xl text-[#242424] font-bold leading-normal text-left">
              Key booking details
            </h1>

            <div className="mt-6">
              <p className="text-base font-normal text-[#242424]">
                Trip Name :{" "}
                <span className="text-[#878787]">
                  Trolling and Dolphin Trip.
                </span>
              </p>
              <p className="text-base font-normal text-[#242424]">
                Date & Time : <span className="text-[#878787]">{tripDate}</span>
              </p>
              <p className="text-base font-normal text-[#242424]">
                Number Of Guests :{" "}
                <span className="text-[#878787]">{numberOfGuests}</span>
              </p>
              <p className="text-base font-normal text-[#242424]">
                Location:{" "}
                <span className="text-[#878787]">
                  {location ? location : "N/A"}
                </span>
              </p>
            </div>

            <div className="my-10">
              <h1 className="text-xl md:text-3xl text-[#242424] font-bold leading-normal">
                What next?
              </h1>
              <p className="text-base font-normal text-[#878787]">
                Arrive 15 minutes early at Marina Bay, Florida. <br /> Bring
                sunscreen, snacks, and any fishing gear you prefer.
              </p>
            </div>

            <div className="my-10">
              <h1 className="text-xl md:text-3xl text-[#242424] font-bold leading-normal">
                Any questions?
              </h1>
              <p className="text-base font-normal text-[#878787]">
                Contact us at{" "}
                <span className="text-[#0037FF]">tom@fishingtripper.com</span>
              </p>
            </div>
            <Button link={"/"}>Explore more trips</Button>
          </div>
        </div>

        <div>
          <Image
            src={image1}
            alt="image"
            height={200}
            width={200}
            className="w-full h-auto max-w-[700px] max-h-[500px] sm:w-[500px] sm:h-[200px] md:w-[500px] md:h-[400px] lg:w-[700px] lg:h-[500px]"
          />
        </div>
      </div>
    </div>
  );
}
