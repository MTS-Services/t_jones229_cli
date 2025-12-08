// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

const BookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //login user
    createBooking: build.mutation({
      query: (data: any) => ({
        url: `/booking`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),
    getBooking: build.query({
      query: (id) => ({
        url: `/booking/${id}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    getMyBooking: build.query({
      query: () => ({
        url: `booking/booking/my-booking`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    cancelBooking: build.mutation({
      query: (id) => ({
        url: `/booking/cancel-booking/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["booking", "userBooking"],
    }),
    getChargeEnable: build.query({
      query: () => ({
        url: `/users/active-stripe-account`,
        method: "POST",
      }),
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingQuery,
  useGetMyBookingQuery,
  useGetChargeEnableQuery,
  useCancelBookingMutation,
} = BookingApi;
export default BookingApi;
