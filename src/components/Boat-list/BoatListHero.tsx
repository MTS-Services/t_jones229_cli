import banner from "@/assets/banner.png";
import board from "@/assets/boart.svg";
import Button from "../ReUsible/Button";
import Image from "next/image";

export default function BoatListHero() {
  return (
    <main
      className="relative bg-cover bg-center bg-no-repeat pt-[150px] pb-[120px]"
      style={{ backgroundImage: `url(${banner.src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      {/* bg-black/50 = black with 50% opacity. You can adjust to bg-black/30, bg-black/70 etc */}

      <div className="relative container mx-auto flex flex-col justify-center items-center text-center text-white px-5 lg:px-[135px]">
        <h1 className="text-2xl md:text-[40px] font-bold shadow-lg leading-normal">
          Sign up today - First 6 months of membership free then $65 per month.
          Free cancellation anytime.
        </h1>
        <p className="max-w-2xl text-base md:text-2xl font-normal tracking-[-0.43px] mt-3">
          Join thousands of charter captains and guides connecting with anglers
          worldwide.
        </p>
        <div className="flex items-center justify-center mt-7">
          <Button
            link={"/boat-list-form/Information"}
            variant="primary"
            className="flex items-center font-satoshi rounded-[14px] text-base font-bold mt-7 w-54 gap-2"
          >
            <Image
              className="h-3 md:h-6 w-3 md:w-6"
              src={board}
              alt=""
              height={100}
              width={100}
            />
            Click here to get started!
          </Button>
        </div>
      </div>
    </main>
  );
}
