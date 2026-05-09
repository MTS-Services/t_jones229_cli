// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

const calenderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // sign up user or client
    getCalender: build.query({
      query: ({ month, year }) => ({
        url: `/booking/calendar?month=${month}&year=${year}`,
        method: "GET",
      }),
      providesTags: ["calendar"],
    }),
  }),
});

export const { useGetCalenderQuery, useLazyGetCalenderQuery } = calenderApi;
export default calenderApi;
