import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function BoatListHero() {
  return (
    <div className="!container mx-auto xl:px-6 lg:px-5 md:px-4 px-3 lg:my-24 md:my-20 my-16 !rounded-2xl">
      <ReUseAbleBanner
        title="List your business on FishingTripper – Connect with anglers from around the world."
        description="Join thousands of charter captains and guides connecting with anglers worldwide."
        backgroundImage={'/bannerImg.jpg'}
        backgroundImageClassName="!rounded-2xl"
        className={"!bg-black/20"}
        boardImage={board.src}
        button={true}
        buttonTitle="Click here to get started!"
      />
    </div>
  );
}
