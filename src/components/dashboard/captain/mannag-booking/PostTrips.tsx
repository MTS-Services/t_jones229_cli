"use client";

import PostBokingCard from "./PostBokingCard";

export default function PostTrips({ postTrips }: any) {
  const hasTrips = postTrips && postTrips.length > 0;

  return (
    <section className="mx-auto px-[24px] py-10">
      <h1 className="text-2xl font-bold text-[#242424] pb-4">Past Trips</h1>
      <div className="h-[1px]  border-[#D9D9D9]"></div>

      {hasTrips ? (
        <div className="space-y-6 pt-4">
          {postTrips.map((trip: any) => (
            <PostBokingCard key={trip.id} {...trip} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No past trips found.</p>
      )}
    </section>
  );
}
