import { SearchData, TripDetails } from "../types";

export const formatDisplayDate = (dateString: string): string => {
  if (!dateString || isNaN(new Date(dateString).getTime())) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const loadSearchDataFromStorage = (): TripDetails => {
  try {
    const searchDataStr = localStorage.getItem("searchData");

    if (searchDataStr) {
      const searchData: SearchData = JSON.parse(searchDataStr);
      return {
        location: searchData.location || null,
        date: searchData.date || searchData.startDate || "",
        guests: searchData.guests ? Number(searchData.guests) : 1,
      };
    } else {
      // Fallback to legacy storage
      return {
        location: localStorage.getItem("location"),
        date: localStorage.getItem("StartDate") || "",
        guests: Number(localStorage.getItem("Guests")) || 1,
      };
    }
  } catch (error) {
    console.error("Error loading search data:", error);
    return {
      location: null,
      date: "",
      guests: 1,
    };
  }
};

export const buildTripSummary = (
  tripDetails: TripDetails,
  formatDate: (date: string) => string,
): string => {
  const { location, date, guests } = tripDetails;
  const formattedDate = formatDate(date);

  return [location, formattedDate, `${guests} people`]
    .filter(Boolean)
    .join(" / ");
};
