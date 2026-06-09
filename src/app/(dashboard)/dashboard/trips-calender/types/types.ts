export interface CalendarResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CalendarData;
}

export interface CalendarData {
  filter: {
    month: number;
    year: number;
    monthName: string;
  };
  dailyServiceCounts: DailyServiceCount[];
  timeline: Timeline;
  availabilityBlocks?: AvailabilityBlock[];
}

export interface AvailabilityBlock {
  id: string;
  captainId: string;
  startDateTime: string;
  endDateTime: string;
  isFullDay: boolean;
  reason?: string;
  blockType: "MANUAL_CAPTAIN" | "MANUAL_ADMIN";
}

export interface DailyServiceCount {
  date: string;
  count: number;
  bookings: Booking[];
  blocks?: AvailabilityBlock[];
}

export interface Timeline {
  today: Booking[];
  tomorrow: Booking[];
  thisWeek: Booking[];
  thisMonth: Booking[];
}

export interface Booking {
  id: string;
  tripDate: string;
  boat: {
    captain: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
    trips: {
      departureTime: string;
      tripName: string;
      duration: number;
    }[];
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  bookingType: "PRIVATE" | "SHARED" | string;
  payDue: number;
  payFirst: number;
  totalPrice: number | null;
  depositAmount: number | null;
  remainingAmount: number | null;
}
