export const userRole = {
  fishingTripper: "SUPERADMIN",
  user: "USER",
  captain: "CAPTAIN",
} as const;
export type UserRole = (typeof userRole)[keyof typeof userRole];
