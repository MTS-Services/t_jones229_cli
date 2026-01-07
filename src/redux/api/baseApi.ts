// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

// 1. Setup the Base URL
const baseApiHandler = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fishing-server.mtscorporate.com';
  console.log('🔧 API Base URL:', `${baseUrl}/api/v1`);
  return `${baseUrl}/api/v1`;
};

// 2. Custom Base Query with Fix for Empty 500 Errors
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseApiHandler(),
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = (getState() as RootState).auth.token;
        console.log('📤 Token from Redux state:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
        if (token) {
          // Ensure correct Bearer format
          const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          headers.set('Authorization', authHeader);
          console.log('📤 Authorization header set:', authHeader.substring(0, 35) + '...');
        } else {
          console.warn('⚠️ No token found in Redux state - user may not be logged in');
        }
      } catch (error) {
        console.error('Error preparing headers:', error);
        // Build headers silently
      }
      // Don't set Content-Type for FormData - let browser set it with boundary
      // fetchBaseQuery handles this automatically, but ensure we don't override it
      return headers;
    },
    timeout: 30000,
  });

  try {
    const result = await baseQuery(args, api, extraOptions);

    // --- FIX STARTS HERE ---
    if (result.error) {
      const status = result.error.status;
      const data = result.error.data;
      const endpoint = typeof args === 'string' ? args : args.url;

      // Check if the server sent empty data (common in 500 crashes)
      const isServerCrash = status === 500;
      const isEmptyResponse = !data || (typeof data === 'object' && Object.keys(data).length === 0);

      if (isServerCrash && isEmptyResponse) {
        // Instead of showing {}, we show a clear message
        console.warn(`⚠️ Backend Server Error (500) at ${endpoint}`);
        console.warn('The server crashed without sending an error message.');
        console.warn('Action: Check your backend terminal logs.');
      } else if (isEmptyResponse) {
        // Empty response but not 500 - likely network or CORS issue
        console.error('API Error - Empty Response:', {
          status: status,
          endpoint: endpoint,
          possibleCause: status === 'FETCH_ERROR' ? 'Network/CORS issue' : 'Server returned empty response'
        });
      } else {
        // Log normal errors with full details
        console.error('API Error:', {
          status: status,
          message: data,
          endpoint: endpoint
        });
      }
    }
    // --- FIX ENDS HERE ---

    return result;
  } catch (error) {
    console.error('API Request Exception:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        error: String(error),
      },
    };
  }
};

// 3. Define the API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  endpoints: () => ({}),
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