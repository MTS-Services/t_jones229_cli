export interface tripCardProps {
  boatId: any;
  image: string | any[];
  viewMode?: "grid" | "list";
  imageIndex?: number;
  tripInfo: {
    id: number;
    tripName: string;
    price: number | string;
    description: string;
    duration: number | string;
    // add any other properties used in PricingCard
  };
}

export interface KeyFeatureProps {
  boatInfo: {
    trips?: {
      price?: number;
      duration?: number;
    }[];
    guests?: number;
    boatLength?: number;
    modelYear?: number;
  };
}

export interface CardProps {
  boatInfo: {
    id: number;
    boatLength: number;
    photos?: {
      url: string;
    }[];
    descriptions?: {
      listingTypeTitle?: string;
      listingTypeDescription?: string;
    }[];
    meetingPoint?: {
      street?: string;
      city: string;
    }[];
    trips?: {
      price?: string;
      duration?: string;
      departureTime: string;
    }[];
    fishing?: {
      species?: string[];
    }[];
    guests?: string | number;
  };
}
