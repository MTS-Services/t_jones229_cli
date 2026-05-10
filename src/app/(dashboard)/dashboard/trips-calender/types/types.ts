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
}

export interface DailyServiceCount {
  date: string;
  count: number;
  bookings: Booking[];
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
