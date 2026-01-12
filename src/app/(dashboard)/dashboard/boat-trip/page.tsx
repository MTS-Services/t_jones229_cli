import BootTips from "@/components/dashboard/captain/BootTips/BootTips";
import TripsList from "@/components/dashboard/captain/BootTips/TripsList";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <TitleSection />
      <div className="flex-1 lg:px-10 md:px-8 px-6 py-6">
        <BootTips />
        <TripsList />
      </div>
    </div>
  );
}
