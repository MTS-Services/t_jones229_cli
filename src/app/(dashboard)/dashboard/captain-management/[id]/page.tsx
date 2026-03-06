"use client";

import React from "react";
import { useParams } from "next/navigation";
import CaptainDetails from "@/components/dashboard/admin/userManagment/CaptainDetails";
import { useSingleUserQuery } from "@/redux/api/authApi";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CaptainDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useSingleUserQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading captain details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Captain Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The captain you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/captain-management"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Captains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/captain-management"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Captain Management
        </Link>
      </div>
      <CaptainDetails userData={data?.data} />
    </div>
  );
}
