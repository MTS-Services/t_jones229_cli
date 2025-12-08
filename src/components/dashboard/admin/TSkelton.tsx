export const TSkeleton = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 animate-pulse">
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
      </div>
      <div className="flex-1 min-w-0 px-4">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
      </div>
      <div className="flex-1 min-w-0 px-4">
        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-6 mb-2"></div>
      </div>
    </div>
  );
};
