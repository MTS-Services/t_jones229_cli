import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";
import Container from "../common/Container";

export default function BoatListHero() {
  return (
    <Container>
      <ReUseAbleBanner
        title="List your business on FishingTripper – Connect with anglers from around the world."
        backgroundImage={"/bannerImg.jpg"}
        backgroundImageClassName="!rounded-2xl"
        className={"!bg-black/20"}
        boardImage={board.src}
        pathLink="/boat-list"
        button={true}
        buttonTitle="Click here to get started!"
      />
    </Container>
  );
}
