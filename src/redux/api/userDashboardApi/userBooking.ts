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
        sortBy?: string;
        sortOrder?: string;
      }) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.date && params.date.trim())
          queryParams.append("date", params.date);
        if (params.city && params.city.trim())
          queryParams.append("city", params.city);
        if (params.status && params.status.trim())
          queryParams.append("status", params.status);
        if (params.searchTerm && params.searchTerm.trim())
          queryParams.append("searchTerm", params.searchTerm);
        if (params.sortBy && params.sortBy.trim())
          queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder && params.sortOrder.trim())
          queryParams.append("sortOrder", params.sortOrder);

        return {
          url: `/booking?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["userBooking"],
      keepUnusedDataFor: 0,
    }),

  }),
});

export const {
  useGetAllUserBookingQuery,
  useAllBookingQuery,
} = userBooking;
export default userBooking;
