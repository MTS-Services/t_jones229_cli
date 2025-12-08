import BoatListHero from "@/components/Boat-list/BoatListHero";
import FeaturesCard from "@/components/Boat-list/FeaturesCard";
import StepsSection from "@/components/Boat-list/StepsSection";
import React from "react";
import BoatLintFaq from "@/components/Boat-list/BoatLintFaq";

export default function page() {
  return (
    <div>
      <BoatListHero />
      <FeaturesCard />
      <StepsSection />
      <BoatLintFaq />
    </div>
  );
}
