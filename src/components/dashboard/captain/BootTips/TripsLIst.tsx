// app/trips/page.tsx (or pages/trips.tsx if using pages dir)
"use client";

import { useGetMyBoatQuery } from "@/redux/api/boatApi";
import TripCard from "./TripsCard";

export default function TripsList() {
  const { data, isLoading } = useGetMyBoatQuery({});
  const boat = data?.data[0];

  return (
    <section className="w-full mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Trips</h1>
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-white md:h-[260px] h-[460px] rounded-xl border p-4 gap-4 animate-pulse"
            >
              <div className="w-full h-[239px] bg-gray-200 rounded-lg"></div>
              <div className="w-full flex flex-col justify-center space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          ))
        ) : boat?.trips?.length ? (
          boat?.trips?.map((trip: any) => (
            <TripCard
              key={trip.id}
              trip={trip}
              image={boat?.photos?.[0]?.url}
              guest={boat.guests}
              location={boat?.meetingPoint?.[0]?.city}
            />
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
    </section>
  );
}
