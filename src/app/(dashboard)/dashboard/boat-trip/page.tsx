import BootTips from "@/components/dashboard/captain/BootTips/BootTips";
import TripsList from "@/components/dashboard/captain/BootTips/TripsLIst";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function page() {
  return (
    <div>
      <TitleSection />
      <BootTips />
      <TripsList />
    </div>
  );
}
