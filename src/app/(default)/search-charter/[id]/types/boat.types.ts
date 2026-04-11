export interface SearchData {
  location?: string;
  date?: string;
  startDate?: string;
  guests?: number;
  timestamp?: string;
}

export interface TripDetails {
  location: string | null;
  date: string;
  guests: number;
}

export interface BoatTrip {
  id: string;
  tripName: string;
  price: number;
  description: string;
  duration: number;
  [key: string]: any;
}

export interface BoatPhoto {
  url: string;
  id?: string;
  [key: string]: any;
}

export interface MeetingPoint {
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

export interface Captain {
  firstName?: string;
  lastName?: string;
  id?: string;
  [key: string]: any;
}

export interface BoatDescription {
  listingTypeTitle?: string;
  listingTypeDescription?: string;
  [key: string]: any;
}

export interface BoatInfo {
  id: string;
  photos?: BoatPhoto[];
  descriptions?: BoatDescription[];
  captain?: Captain;
  meetingPoint?: MeetingPoint[];
  trips?: BoatTrip[];
  [key: string]: any;
}
