"use client";

import board from "@/assets/boart.svg";
import { stepsData } from "@/constant/stepsData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Button from "../ReUsible/Button";

export default function StepsSection() {
  const router = useRouter();

  return (
    <section className="w-full bg-white pb-16 px-4 container mx-auto">
      <ToastContainer />
      <div className=" mx-auto flex flex-col items-center space-y-12">
        <div className="w-full flex flex-col md:flex-row gap-10 justify-between items-start relative">
          {/* horizontal line */}
          <div className="absolute top-10 left-10 md:w-[500px] lg:w-[700px] xl:w-[800px] h-[2px] bg-gray-300 z-0" />

          {stepsData?.map((step) => (
            <div
              key={step.id}
              className="flex flex-col justify-start z-10 border md:border-none py-5 w-full"
            >
              {/* Step dot */}

              <div className="w-24  flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#ff9500] mb-2" />
              </div>

              {/* Step text */}
              <div className="px-8 w-full">
                <div className=" text-base md:text-lg font-normal leding-[52px] text-black py-3">
                  STEP {step.id}
                </div>

                <div className="text-lg md:text-2xl font-bold leding-[52px] text-black  mt-1">
                  {step.title}
                </div>

                <p className="text-[#878787] text-sm md:text-lg font-normal leading-7  mt-1 w-full">
                  ({step.description})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        link={"/boat-list-form/Information"}
        // onClick={handleClicked}
        variant="primary"
        className="flex items-center gap-1 font-satoshi rounded-[14px] text-base font-bold w-64 mt-7"
      >
        <Image
          className="flex-1 h-3 md:h-6 w-3 md:w-6 "
          src={board}
          alt=""
          height={100}
          width={100}
        />
        Click here to get started!
      </Button>
    </section>
  );
}
