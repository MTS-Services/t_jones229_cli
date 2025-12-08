export type TripsBookProps = {
  tripDate: string;
  bookingType: string;
  member: number;
  status?: string;
  trip: {
    tripName: string;
    id: any;
  };
  boat: {
    photos: { url: string }[];
    captain: any;
  };
  id: string;
  userId?: string;
};
