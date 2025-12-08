// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // sign up user or client
    dashboard: build.query({
      query: () => ({
        url: `booking/dashboard`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),


   
  }),
});

export const {useDashboardQuery } = dashboardApi;
export default dashboardApi;
