import { baseApi } from "../baseApi";

const userBooking = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get current user's bookings
    getAllUserBooking: build.query({
      query: () => ({
        url: `/booking/booking/my-booking`,
        method: "GET",
      }),
      providesTags: ["userBooking", "booking"],
    }),

    // Get all bookings with filters
    allBooking: build.query({
      query: (params: {
        limit?: number;
        page?: number;
        date?: string;
        city?: string;
        status?: string;
        searchTerm?: string;
      }) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.date) queryParams.append("date", params.date);
        if (params.city) queryParams.append("city", params.city);
        if (params.status) queryParams.append("status", params.status);
        if (params.searchTerm)
          queryParams.append("searchTerm", params.searchTerm);

        return {
          url: `/booking?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["userBooking"],
    }),

    updateChargeEnabled: build.mutation({
      query: (stripeAccount: string) => ({
        url: `/users/stripe/charge-enable?stripeAccount=${stripeAccount}`,
        method: "PATCH",
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useGetAllUserBookingQuery,
  useAllBookingQuery,
  useUpdateChargeEnabledMutation,
} = userBooking;
export default userBooking;
