"use client";

import banner from "@/assets/banner.png";
import board from "@/assets/boart.svg";
import ReUseAbleBanner from "../common/ReUseAbleBanner";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function ListYourBoat() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!user;

  // Determine path based on user role
  const getPathLink = () => {
    if (!isLoggedIn) return "/login";

    const role = user?.role || Cookies.get("currentUserRole");

    if (role === "CAPTAIN") {
      return "/dashboard/check-your-trip";
    } else if (role === "USER") {
      return "/list-your-boat";
    }

    return "/login";
  };

  return (
    <ReUseAbleBanner
      title="Join The Fishing Hub’s global network of Charter Captains and Guides"
      backgroundImage={banner.src}
      boardImage={board.src}
      button={true}
      pathLink={getPathLink()}
      buttonTitle="List your Boat"
      // backgroundImageClassName="m-4"
    />
  );
}
