import Adashboard from "@/components/dashboard/admin/Adasboard";
import TitleSection from "@/components/dashboard/captain/TiltleSection";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Complete the account set up below before you list your boat, we will
          then review and verify your listing.
        </p>
      </div>
      <Adashboard />
    </div>
  );
}
