import { LucideIcon } from "lucide-react";

export type TabKey = "today" | "upcoming" | "past";

export interface BookingUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Booking {
  id: string;
  trip: Trip;
  boat: Boat;
  status: BookingStatus;
  tripDate: string;
  bookingType: "PRIVATE" | "SHARED";
  groupSize: number;
  payFirst: number;
  payDue: number;
  totalPrice: number | null;
  depositAmount: number | null;
  remainingAmount: number | null;
  userId: string;
  user?: BookingUser;
}

export interface Trip {
  tripName: string;
  departureTime: string;
  duration: number;
  price: number;
}

export interface Boat {
  boatType: string;
  captain?: Captain;
  photos?: Photo[];
  meetingPoint?: MeetingPoint[];
}

export interface Captain {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Photo {
  url: string;
}

export interface MeetingPoint {
  city: string;
}

export type BookingStatus =
  | "CONFIRMED"
  | "UPCOMING"
  | "PENDING"
  | "CANCEL"
  | "COMPLETE";

export interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  label: string;
}

export interface Tab {
  key: TabKey;
  label: string;
  icon: LucideIcon;
}

export interface StatCard {
  label: string;
  value: number;
  bg: string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
}

export interface BookingData {
  todayTrips: Booking[];
  upcomingTrips: Booking[];
  pastTrips: Booking[];
}
