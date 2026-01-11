import BootTips from "@/components/dashboard/captain/BootTips/BootTips";
import TripsList from "@/components/dashboard/captain/BootTips/TripsLIst";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function page() {
  return (
    <div className="">
      <TitleSection />
      <div className="flex-1 overflow-y-auto lg:px-10 md:px-8 px-6 py-6">
        <BootTips />
        <TripsList />
      </div>
    </div>
  );
}
