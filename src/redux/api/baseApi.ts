// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

const baseApiHandler = () => {
  // const apiUrl =
  //   process.env.NODE_ENV === "production"
  //     ? "https://api-fishing-tripper.getaccomplished.co/api/v1"
  //     : "http://10.0.30.129:5135/api/v1";

  const apiUrl = "https://api.fishingtripper.com/api/v1";
  // const apiUrl = "http://10.0.30.129:5135/api/v1";
  return apiUrl;
};

// Define the base API using RTK Query
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiHandler(),
    prepareHeaders: (headers, { getState }) => {
      // Access the token from the Redux state
      const token = (getState() as RootState).auth.token;

      if (token) {
        // If token exists, add it to the Authorization header
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({
    // Also can add builder here like endpoints: (builder) => ({}),
    // Add other API endpoints as needed
  }),
  tagTypes: [
    "auth",
    "boat",
    "Calender",
    "file",
    "support",
    "userBooking",
    "user",
    "Dashboard",
    "booking",
  ],
});
