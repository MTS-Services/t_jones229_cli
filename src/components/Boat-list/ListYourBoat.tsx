import banner from "@/assets/banner.png";
import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function ListYourBoat() {
  return (
    <div className="">
      <ReUseAbleBanner
        title="Join FishingTripper’s global network of Charter Captains and Guides"
        backgroundImage={banner.src}
        boardImage={board.src}
        button={true}
        buttonTitle="List your Boat"
      />
    </div>
  );
}
