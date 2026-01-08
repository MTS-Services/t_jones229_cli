"use client";

import banner from "@/assets/banner.png";
import { useGetMeQuery } from "@/redux/api/authApi";
import ReUseAbleBanner from "../common/ReUseAbleBanner";

export default function Hero() {
  const { data } = useGetMeQuery(
    {},
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  return (
    <div className="">
      <ReUseAbleBanner
        description=" Discover top-rated fishing charters, expert captains, and
            unforgettable adventures—customized just for you. Choose a private
            boat for a personalized experience or join fellow anglers on a
            shared charter."
        title="Plan Your Perfect Day on the Water"
        backgroundImage={`${banner.src}`}
      />
    </div>
  );
}
