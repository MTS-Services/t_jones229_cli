import TopChartersCard from "../Home/TopChartersCard";
import Loader from "../ui/Loader";

interface PriceLowestProps {
  currentItems: any[];
  isLoading: boolean;
}

export default function PriceLowest({
  currentItems,
  isLoading,
}: PriceLowestProps) {
  if (isLoading) {
    return <Loader compact message="Loading charters..." />;
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
