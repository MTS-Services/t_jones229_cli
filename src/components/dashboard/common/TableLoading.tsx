import React from "react";
import { Loader2 } from "lucide-react";

interface TableLoadingProps {
  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;
  /**
   * Number of columns in the table
   * @default 6
   */
  columns?: number;
  /**
   * Message to display below the spinner
   * @default "Loading data..."
   */
  message?: string;
  /**
   * Loading style: 'skeleton' for skeleton rows, 'spinner' for centered spinner
   * @default 'spinner'
   */
  variant?: "skeleton" | "spinner";
}

/**
 * Reusable table loading component
 * Can be used as either a spinner or as skeleton rows
 */
export default function TableLoading({
  rows = 5,
  columns = 6,
  message = "Loading data...",
  variant = "spinner",
}: TableLoadingProps) {
  if (variant === "spinner") {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  // Skeleton variant - renders placeholder rows
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 px-6 py-4 animate-pulse"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div
                className="h-4 bg-gray-200 rounded"
                style={{
                  width: `${60 + Math.random() * 40}%`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Compact skeleton loader for inline use
 */
export function TableSkeletonRow({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="flex-1">
          <div
            className="h-4 bg-gray-200 rounded"
            style={{
              width: `${60 + Math.random() * 40}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
