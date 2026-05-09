import React from "react";
import { Ship } from "lucide-react";

interface EmptyStateProps {
  message: string;
  sub: string;
}

export default function EmptyState({ message, sub }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Ship className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
