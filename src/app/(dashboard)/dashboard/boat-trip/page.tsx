import BootTips from "@/components/dashboard/captain/BootTips/BootTips";
import TripsList from "@/components/dashboard/captain/BootTips/TripsLIst";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function Page() {
  return (
    <div className="">
      {/* <TitleSection /> */}
      <div className="mb-6">
        <h1 className=" text-2xl font-bold">Boat & Trips</h1>
        <p className="text-gray-600 mt-2">
          Complete the account set up below before you list your boat, we will
          then review and verify your listing.
        </p>
      </div>
      <div className="flex-1">
        <BootTips />
        <TripsList />
      </div>
    </div>
  );
}
