"use client";

import banner from "@/assets/banner.png";
import Image from "next/image";
import board from "@/assets/boart.svg";
import Button from "../ReUsible/Button";
import { useGetMeQuery } from "@/redux/api/authApi";

export default function Hero() {
  const { data } = useGetMeQuery(
    {},
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  return (
    <main
      className="bg-cover bg-center bg-no-repeat pt-[150px] pb-[120px]"
      style={{
        backgroundImage: `url(${banner.src})`,
      }}
    >
      <div className="container flex flex-col items-center md:items-start text-center  lg:text-start text-white px-5   lg:px-[135px]">
        <h1 className="text-2xl md:text-[40px] font-bold shadow-lg">
          Plan Your Perfect Day on the Water
        </h1>
        <p className="max-w-2xl text-base md:text-xl font-normal tracking-[-0.43px] mt-3">
          Discover top-rated fishing charters, expert captains, and
          unforgettable adventures—customized just for you. Choose a private
          boat for a personalized experience or join fellow anglers on a shared
          charter.
        </p>

        {/* {data?.data && data?.data?.role !== "CAPTAIN" && (
          <Button
            link={"/boat-list"}
            // variant="primary"
            className="flex items-center justify-center gap-3 font-satoshi text-base font-bold w-44 mt-5 rounded-lg"
          >
            <Image
              className=" h-6 w-6 "
              src={board}
              alt="board icon"
              height={100}
              width={100}
            />
            List your boat
          </Button>
        )} */}
      </div>
    </main>
  );
}
