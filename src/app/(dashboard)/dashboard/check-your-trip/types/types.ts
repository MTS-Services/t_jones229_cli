export interface Tab {
  id: number;
  title: string;
}

export interface StepHeading {
  title: string;
  description: string;
}

export type StepStatus = "current" | "completed" | "visited" | "upcoming";

export interface TripFormItem {
  tripName: string;
  tripsdescription: string;
  tripsduration: string | number;
  tripDays: string[];
  departureTime: string;
  tripsprice: string | number;
  tripsSpecies: string[];
  fishingLocation: string[];
  fishingTechnique: string[];
}

export interface MeetingPointData {
  street: string;
  city: string;
  postCode: string;
  country: string;
  direction: string;
  location: { latitude: number; longitude: number };
}

export interface BoatFinalData {
  boatInfo: {
    guests: number;
    description: string;
    manufacturer: string;
    boatLength: number;
    modelYear: number;
    facilities: string[];
    gearAndCrew: string[];
    licenceImages: string[];
    acceptSharedCharters: boolean;
    sharedBooking: boolean;
    listingType: string;
    boatType: string;
    isDeleted: boolean;
  };
  fishing: {
    species: string[];
    fishingLocation: string[];
    fishingTechnique: string[];
    policies: string[];
    includedPrice: string[];
  };
  photos: string[];
  videos: string[];
  meetingPoint: MeetingPointData;
  description: {
    listingTypeTitle: string;
    listingTypeDescription: string;
  };
  trips: {
    tripName: string;
    description: string;
    duration: number;
    tripDays: string[];
    departureTime: string;
    price: number;
    species: string[];
    fishingLocation: string[];
    fishingTechnique: string[];
  }[];
  terms?: {
    paymentMethodId: string;
  };
}
