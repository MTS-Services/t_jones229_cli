// components/Private-charterTab/TabContent.tsx
import Recommended from "./Recommended";
import PriceHighest from "./PriceHighest";
import PriceLowest from "./PriceLowest";

interface TabContentProps {
  activeKey: string;
  currentItems: any[];
  isLoading: boolean;
}

const TabContent: React.FC<TabContentProps> = ({
  activeKey,
  currentItems,
  isLoading,
}) => {
  // We wrap the output in a div to ensure the layout remains stable
  return (
    <div className="flex flex-col gap-6 w-full">
      {(() => {
        switch (activeKey) {
          case "1":
            return (
              <Recommended currentItems={currentItems} isLoading={isLoading} />
            );
          case "2":
            return (
              <PriceHighest currentItems={currentItems} isLoading={isLoading} />
            );
          case "3":
            return (
              <PriceLowest currentItems={currentItems} isLoading={isLoading} />
            );
          default:
            return (
              <Recommended currentItems={currentItems} isLoading={isLoading} />
            );
        }
      })()}
    </div>
  );
};

export default TabContent;
