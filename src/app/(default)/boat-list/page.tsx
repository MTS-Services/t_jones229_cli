import BoatListHero from "@/components/Boat-list/BoatListHero";
import FeaturesCard from "@/components/Boat-list/FeaturesCard";
import StepsSection from "@/components/Boat-list/StepsSection";
import React from "react";
import BoatLintFaq from "@/components/Boat-list/BoatLintFaq";
import ListYourBoat from "@/components/Boat-list/ListYourBoat";
// import CaptainsInfoPage from "@/components/Boat-list/CaptainsInfoPage";

export default function page() {
  return (
    <>
      <ListYourBoat />
      <FeaturesCard />
      <StepsSection />
      {/* <CaptainsInfoPage /> */}
      <BoatLintFaq />
    </>
  );
}
