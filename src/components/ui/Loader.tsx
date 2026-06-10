import React from "react";

type LoaderProps = {
  compact?: boolean;
  message?: string;
};

export default function Loader({ compact = false, message }: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        compact ? "py-16" : "min-h-screen"
      }`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#105d9e]" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}

export function SearchButtonSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-white/30 border-t-white ${className}`}
      aria-hidden
    />
  );
}

export function CenteredSearchLoader({ message = "Searching charters..." }: { message?: string }) {
  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-center gap-4 py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#105d9e]" />
      <p className="text-base font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-400">Please wait while we find available trips</p>
    </div>
  );
}
