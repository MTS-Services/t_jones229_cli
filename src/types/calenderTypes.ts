export interface CalendarResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    filter: {
      month: number;
      year: number;
      monthName: string;
    };
    dailyServiceCounts: {
      date: string;
      count: number;
      bookings: Booking[];
    }[];
    timeline: {
      today: Booking[];
      tomorrow: Booking[];
      thisWeek: Booking[];
      thisMonth: Booking[];
    };
  };
}

export interface Booking {
  id: string;
  tripDate: string; // ISO date string
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
};
