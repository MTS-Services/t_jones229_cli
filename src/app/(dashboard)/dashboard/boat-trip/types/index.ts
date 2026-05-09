export interface BoatPhoto {
  id: string;
  url: string;
}

export interface MeetingPoint {
  id: string;
  street: string;
  city: string;
  country: string;
  postCode: string;
  direction: string;
}

export interface TripPhoto {
  id: string;
  url: string;
}

export interface Trip {
  id: string;
  tripName: string;
  description: string;
  duration: number;
  tripDays: string[];
  departureTime: string;
  price: number;
  species: string[];
  fishingLocation: string[];
  fishingTechnique: string[];
  tripType: string;
  tripStatus: string;
  coverImage?: string;
  photos?: TripPhoto[];
}

export interface Captain {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface Boat {
  id: string;
  listingType: string;
  guests: number;
  boatType: string;
  manufacturer: string;
  licenceImages: string[];
  boatLength: number;
  modelYear: number;
  description: string;
  approvalStatus: string;
  facilities: string[];
  gearAndCrew: string[];
  charterTypes: string[];
  photos: BoatPhoto[];
  meetingPoint: MeetingPoint[];
  trips: Trip[];
  captain: Captain;
}

export interface StatusConfig {
  color: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface BoatDetailModalProps {
  boat: Boat;
  isOpen: boolean;
  onClose: () => void;
}
