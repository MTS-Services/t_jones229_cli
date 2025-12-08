import banner from "@/assets/banner.png";
// import Button from "@/components/ReUsible/Button";
// import Image from "next/image";
// import board from "@/assets/boart.svg";

export default function BoatListHero() {
  return (
    <main
      className="bg-cover bg-center bg-no-repeat pt-[150px] pb-[120px]"
      style={{
        backgroundImage: `url(${banner.src})`,
      }}
    >
      <div className="container flex flex-col   text-start text-white px-5   lg:px-[135px]">
        <h1 className="text-2xl md:text-[40px] font-bold shadow-lg leading-normal">
          Sign up today - First 6 months of membership free then $65 per month.
          Free cancellation anytime.
        </h1>
        <p className="max-w-2xl text-base md:text-2xl font-normal tracking-[-0.43px] mt-3">
          Join thousands of charter captains and guides connecting with anglers
          worldwide.
        </p>
        {/* 
        <Button
          link={"/boat-list-form/Information"}
          variant="primary"
          className="flex items-center gap-1 font-satoshi rounded-lg text-base font-bold w-44 mt-7"
        >
          <Image
            className="flex-1 h-3 md:h-6 w-3 md:w-6 "
            src={board}
            alt=""
            height={100}
            width={100}
          />
          Get started
        </Button> */}
        {/* <p className="max-w-3xl text-base md:text-xl font-normal tracking-[-0.43px] mt-3">
          6 months free trial then $65 a month | Cancel anytime | Unlimited trip
          listings
        </p> */}
      </div>
    </main>
  );
}
