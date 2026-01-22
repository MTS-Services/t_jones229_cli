import banner from "@/assets/fishing-rods.avif";
import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function BoatListHero() {
  return (
    <div className="!max-w-7xl mx-auto !rounded-2xl my-16">
      <ReUseAbleBanner
        title="List your business on FishingTripper – Connect with anglers from around the world."
        description="Join thousands of charter captains and guides connecting with anglers worldwide."
        backgroundImage={banner.src}
        backgroundImageClassName="!rounded-2xl"
        className={"!bg-black/50"}
        boardImage={board.src}
        button={true}
        buttonTitle="Click here to get started!"
      />
    </div>
  );
}
