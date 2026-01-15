import TopChartersCard from "../Home/TopChartersCard";
import Loader from "../ui/Loader";

interface RecommendedProps {
  currentItems: any[];
  isLoading: boolean;
}

export default function Recommended({
  currentItems,
  isLoading,
}: RecommendedProps) {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems && currentItems?.length > 0
          ? currentItems?.map((card: any) => (
              <TopChartersCard key={card.id} boatInfo={card} />
            ))
          : "No data available"}
      </div>
    </div>
  );
}
