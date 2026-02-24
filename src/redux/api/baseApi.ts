// src/redux/api/baseApi.ts
import {
  createApi,
  fetchBaseQuery,
  retry,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

// --------------------------------------------------
// 1. Base URL Handler
// --------------------------------------------------
const getBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.fishingtripper.com";

  return `${baseUrl}/api/v1`;
};

// --------------------------------------------------
// 2. Raw Base Query (Created Once)
// --------------------------------------------------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  timeout: 30000, // 30 seconds timeout for all requests

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token;

    if (token) {
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      headers.set("Authorization", formattedToken);
    }

    return headers;
  },
});

// --------------------------------------------------
// 3. Base Query With Global Error Handling
// --------------------------------------------------
const baseQueryWithHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const endpoint =
      typeof args === "string" ? args : args.url;

    // ----------------------------------------
    // Handle 401 Unauthorized (Global Logout)
    // ----------------------------------------
    if (status === 401) {
      if (process.env.NODE_ENV === "development") {
        console.warn("🔐 Unauthorized - Token expired or invalid.");
      }

      // Optional:
      // api.dispatch(logout());
    }

    // ----------------------------------------
    // Handle Empty 500 Server Crash
    // ----------------------------------------
    const isServerCrash =
      status === 500 &&
      (!result.error.data ||
        (typeof result.error.data === "object" &&
          Object.keys(result.error.data).length === 0));

    if (isServerCrash && process.env.NODE_ENV === "development") {
      console.error(`🔥 Backend crashed at: ${endpoint}`);
      console.error("Check backend terminal logs.");
    }

    // ----------------------------------------
    // Network / CORS Error
    // ----------------------------------------
    if (status === "FETCH_ERROR" && process.env.NODE_ENV === "development") {
      console.error("🌐 Network Error:", {
        endpoint,
        baseUrl: getBaseUrl(),
        message: result.error.error,
      });
      console.error("\n💡 SOLUTION:");
      console.error("   1. Check if backend API is running: cd api && npm run dev");
      console.error("   2. Verify NEXT_PUBLIC_API_URL in .env.local");
      console.error("   3. Check CORS settings in api/src/app.ts\n");
    }

    // ----------------------------------------
    // Timeout Error (Request took too long)
    // ----------------------------------------
    if (status === "TIMEOUT_ERROR" && process.env.NODE_ENV === "development") {
      console.error("⏱️ Request Timed Out:", {
        endpoint,
        baseUrl: getBaseUrl(),
        timeout: "30 seconds",
      });
      console.error("💡 SOLUTION:");
      console.error("   1. Check if backend API is running: cd api && npm run dev");
      console.error("   2. Verify NEXT_PUBLIC_API_URL in .env.local");
      console.error("   3. Check backend logs for performance issues\n");
    }
  }

  return result;
};

// --------------------------------------------------
// 4. Add Retry Logic (Best Practice)
// --------------------------------------------------
const baseQueryWithRetry = retry(baseQueryWithHandling, {
  maxRetries: 2,
});

// --------------------------------------------------
// 5. Create API
// --------------------------------------------------
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,

  tagTypes: [
    "auth",
    "boat",
    "calendar",
    "file",
    "support",
    "userBooking",
    "user",
    "dashboard",
    "booking",
  ],

  endpoints: () => ({}),
});