import { Tab, StepHeading, BoatFinalData, TripFormItem } from "../types/types";

export const TABS: Tab[] = [
  { id: 0, title: "Information" },
  { id: 1, title: "Photos" },
  { id: 2, title: "Fishing Details" },
  { id: 3, title: "Meeting Point" },
  { id: 4, title: "Direction" },
  { id: 5, title: "Description" },
  { id: 6, title: "Trips" },
  { id: 7, title: "Terms" },
];

export const HEADINGS: Record<number, StepHeading> = {
  0: {
    title: "Information",
    description: "Complete the account set up below before you list your boat.",
  },
  1: {
    title: "Upload Photos & Videos",
    description: "High quality photos and videos.",
  },
  2: {
    title: "Fishing Details",
    description: "Specify your fishing techniques and gear.",
  },
  3: {
    title: "Meeting Point",
    description: "Set the location where customers will meet you.",
  },
  4: {
    title: "Direction",
    description: "Provide directions to help guests find you.",
  },
  5: {
    title: "Listing Details",
    description: "Add a detailed description of your services.",
  },
  6: {
    title: "Trip Packages",
    description:
      "Create different trip options for your guests. You can add multiple trips with varying durations, prices, and target species.",
  },
  7: {
    title: "Terms & Pricing",
    description: "Before listing your boat, review our terms.",
  },
};

/**
 * Builds the final payload for creating or updating a boat
 */
export const buildFinalData = (
  formData: Record<string, any> | null,
  data: Record<string, any>,
  boatId: string | null,
): BoatFinalData => {
  const get = (key: string) => formData?.[key] ?? data?.[key];

  return {
    boatInfo: {
      guests: Number(get("guests")) || 1,
      description: get("description") || "",
      manufacturer: get("manufacturer") || "",
      boatLength: Number(get("boatLength")) || 0,
      modelYear: Number(get("modelYear")) || 2020,
      facilities: get("facilities") || [],
      gearAndCrew: get("gearAndCrew") || [],
      licenceImages: get("licenceImages") || [],
      acceptSharedCharters: Boolean(get("acceptSharedCharters")) || false,
      sharedBooking: Boolean(get("sharedBooking")) || false,
      listingType: get("listingType") || "Charter",
      boatType: get("boatType") || "Fishing Boat",
      isDeleted: false,
    },
    fishing: {
      species: get("fishingSpecies") || [],
      fishingLocation: get("fishingLocation") || [],
      fishingTechnique: get("fishingTechnique") || [],
      policies: get("policies") || [],
      includedPrice: get("includedPrice") || [],
    },
    photos: get("photos") || [],
    videos: [],
    meetingPoint: {
      street: get("street") || "",
      city: get("city") || "",
      postCode: get("postCode") || "",
      country: get("country") || "",
      direction: get("direction") || "",
      location: get("location") || { latitude: 0, longitude: 0 },
    },
    description: {
      listingTypeTitle: get("listingTypeTitle") || "",
      listingTypeDescription: get("listingTypeDescription") || "",
    },
    trips: (get("trips") || []).map((trip: TripFormItem) => ({
      tripName: trip.tripName || "",
      description: trip.tripsdescription || "",
      duration: 0,
      tripDays: [],
      departureTime: "",
      schedules: trip.schedules || [],
      bookingType: (trip as TripFormItem & { bookingType?: string | string[] })
        .bookingType,
      price: Number(trip.tripsprice) || 0,
      species: trip.tripsSpecies || [],
      fishingLocation: trip.fishingLocation || [],
      fishingTechnique: trip.fishingTechnique || [],
    })),
    terms: {
      accepted: get("termsAccepted") || false,
    },
  };
};

/**
 * Builds the profile update payload after boat creation
 */
export const buildPaymentInfo = (
  data: Record<string, any>,
  formData: Record<string, any> | null,
) => {
  const get = (key: string) => data?.[key] ?? formData?.[key];
  return {
    paymentMethod: {
      paymentMethod: "card",
    },
    user: {
      firstName: get("firstName") || "",
      lastName: get("lastName") || "",
      phoneNumber: get("mobile") || "",
    },
  };
};
