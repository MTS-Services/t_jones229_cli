import banner from "@/assets/banner.png";
import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function BoatListHero() {
  return (
    <div className="">
      <ReUseAbleBanner
        title="Sign up today - First 6 months of membership free then $65 per month. Free cancellation anytime."
        description="Join thousands of charter captains and guides connecting with anglers worldwide."
        backgroundImage={banner.src}
        boardImage={board.src}
        button={true}
        buttonTitle="Click here to get started!"
      />
    </div>
  );
}
