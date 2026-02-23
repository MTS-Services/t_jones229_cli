"use client";

import UpcomingBokingCard from "./UpcomingBokingCard";

export default function UpcomingTrips({ upcomingTrips }: any) {
  const hasTrips = upcomingTrips && upcomingTrips.length > 0;
  return (
    <section className="">
      <h1 className="text-[24px] font-bold border-b-2 text-[#242424]   pb-4">
        Upcoming Trips
      </h1>
      <div className="h-[1px]  border-[#D9D9D9]"></div>
      {hasTrips ? (
        <div className="space-y-6 pt-4">
          {upcomingTrips.map((trip: any) => (
            <UpcomingBokingCard key={trip.id} {...trip} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No upcoming trips found.</p>
      )}
    </section>
  );
}
