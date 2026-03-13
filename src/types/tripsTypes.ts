export type TripsBookProps = {
  tripDate: string;
  bookingType: string;
  member: number;
  status?: string;
  trip: {
    tripName: string;
    id: any;
    duration?: string;
    departureTime?: string;
    price?: number;
    tripDays?: string[];
  };
  boat: {
    photos: { url: string }[];
    captain: any;
    name?: string;
    boatType?: string;
    capacity?: number;
    meetingPoint?: { city?: string; state?: string }[];
  };
  id: string;
  userId?: string;
  groupSize?: number;
  payFirst?: number;
  payDue?: number;
};
