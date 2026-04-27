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
    updateBookingStatus: build.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/booking/status/${id}`,
        method: "PATCH",
        body: { status },
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

    /* ===== Deposit-based booking flow (new) ===== */

    // POST /api/v1/booking/deposit — creates booking + holds 20% deposit
    createBookingDeposit: build.mutation({
      query: (data: {
        boatId: string;
        tripId: string;
        tripDate: string; // ISO date
        groupSize: number;
        paymentMethodId: string;
        bookingType?: boolean; // true = PRIVATE, false = GROUP
      }) => ({
        url: `/booking/deposit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking", "userBooking"],
    }),

    // PATCH /api/v1/booking/:id/complete — captain captures deposit + transfer
    completeTrip: build.mutation({
      query: (id: string) => ({
        url: `/booking/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["booking", "userBooking"],
    }),

    // DELETE /api/v1/booking/:id/cancel — sliding-scale refund/payout
    cancelBookingWithRefund: build.mutation({
      query: ({
        id,
        reason,
        actor,
      }: {
        id: string;
        reason?: string;
        actor?: "CUSTOMER" | "CAPTAIN" | "WEATHER" | "ADMIN";
      }) => ({
        url: `/booking/${id}/cancel`,
        method: "DELETE",
        body: { reason, actor },
      }),
      invalidatesTags: ["booking", "userBooking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingQuery,
  useGetMyBookingQuery,
  useGetChargeEnableQuery,
  useCancelBookingMutation,
  useUpdateBookingStatusMutation,
  useCreateBookingDepositMutation,
  useCompleteTripMutation,
  useCancelBookingWithRefundMutation,
} = BookingApi;
export default BookingApi;
