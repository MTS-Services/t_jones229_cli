// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

const baseApiHandler = () => {
  // Use environment variable for API URL, fallback to production URL
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://fishing-server.mtscorporate.com';
  return `${baseUrl}/api/v1`;
};

// Enhanced base query with error handling and retry logic
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseApiHandler(),
    prepareHeaders: (headers, { getState }) => {
      try {
        // Access the token from the Redux state
        const token = (getState() as RootState).auth.token;

        if (token) {
          // If token exists, add it to the Authorization header
          headers.set('Authorization', `${token}`);
        }
      } catch (error) {
        console.error('Error preparing headers:', error);
      }
      return headers;
    },
    timeout: 30000, // 30 second timeout for iOS Safari
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // If we get an error, log it for debugging with more details
    if (result.error) {
      console.error('API Error:', {
        status: result.error.status,
        data: result.error.data,
        error: result.error.error,
        endpoint: typeof args === 'string' ? args : args.url,
      });
    }
    
    return result;
  } catch (error) {
    console.error('Base query exception:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        error: String(error),
      },
    };
  }
};

// Define the base API using RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
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
