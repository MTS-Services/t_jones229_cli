export interface BoatInfo {
  id: string | number;

  photos?: {
    url: string;
  }[];

  meetingPoint?: {
    city?: string;
  }[];

  guests?: number;

  boatLength?: number;

  fishing?: {
    species?: string[];
  }[];

  descriptions?: {
    listingTypeTitle?: string;
    listingTypeDescription?: string;
  }[];
}
