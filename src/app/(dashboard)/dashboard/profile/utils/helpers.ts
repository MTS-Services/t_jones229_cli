import { User, ProfileStats } from "../types/profile.types";

export const getProfileStats = (user: User): ProfileStats => {
  return {
    totalTrips: user.trip?.length || 0,
    activeBookings:
      user.booking?.filter((b: any) => b.status === "ACTIVE").length || 0,
    memberSince: user.createdAt,
  };
};

export const getUserInitials = (
  firstName?: string,
  lastName?: string,
): string => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return `${first}${last}`;
};

export const getUserFullName = (
  firstName?: string,
  lastName?: string,
): string => {
  return `${firstName || ""} ${lastName || ""}`.trim();
};
