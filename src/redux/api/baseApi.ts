// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

const baseApiHandler = () => {
  // Use environment variable for API URL, fallback to production URL
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.fishingtripper.com';
  return `${baseUrl}/api/v1`;
};

// Define the base API using RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiHandler(),
    prepareHeaders: (headers, { getState }) => {
      // Access the token from the Redux state
      const token = (getState() as RootState).auth.token;

      if (token) {
        // If token exists, add it to the Authorization header
        headers.set('Authorization', `${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({
    // Also can add builder here like endpoints: (builder) => ({}),
    // Add other API endpoints as needed
  }),
  tagTypes: [
    'auth',
    'boat',
    'Calender',
    'file',
    'support',
    'userBooking',
    'user',
    'Dashboard',
    'booking',
  ],
});
