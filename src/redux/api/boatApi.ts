// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

const BoatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all boat
    getAllBoat: build.query({
      query: (params = {}) => {
        const query = new URLSearchParams();

        if (params.limit) query.append("limit", params.limit);
        if (params.page) query.append("page", params.page);
        if (params.guests) query.append("guests", params.guests);
        if (params.startDate) query.append("startDate", params.startDate);
        if (params.endDate) query.append("endDate", params.endDate);
        if (params.sharedBooking)
          query.append("sharedBooking", params.sharedBooking);
        if (params.city) query.append("city", params.city);
        if (params.h_t_l) query.append("h_t_l", params.h_t_l);
        if (params.l_t_h) query.append("l_t_h", params.l_t_h);

        return {
          url: `/boat${query.toString() ? `?${query.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["boat"],
    }),

    //  get single boat
    getSingleBoat: build.query({
      query: (id) => ({
        url: `/boat/${id}`,
        method: "GET",
      }),
      providesTags: ["boat"],
    }),

    getMyBoat: build.query({
      query: () => ({
        url: `/boat/my-boat`,
        method: "GET",
      }),
      providesTags: ["boat"],
    }),

    createBoat: build.mutation({
      query: (data) => ({
        url: `/boat`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["boat"],
    }),

    //  get single boat
    getBoatListByLocation: build.query({
      query: () => ({
        url: `/boat/get-boat-for-every-city`,
        method: "GET",
      }),
      providesTags: ["boat"],
    }),
    //  update boat
    updateBoat: build.mutation({
      query: ({ id, boatInfo }) => ({
        url: `/boat/${id}`,
        method: "PUT",
        body: { ...boatInfo },
      }),
      invalidatesTags: ["boat"],
    }),

    //delete boat
    deleteBoat: build.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/boat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boat"],
    }),

    //delete trip
    deleteTrip: build.mutation({
      query: (id) => ({
        url: `/boat/trip/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boat"],
    }),

    //get single trip by id
    getTrip: build.query({
      query: (tripId) => ({
        url: `/boat/trip/${tripId}`,
        method: "GET",
      }),
      providesTags: ["boat"],
    }),

    //update single trip by id
    updateTrip: build.mutation({
      query: ({ tripId, data }) => ({
        url: `/boat/trip/${tripId}`,
        method: "PATCH",
        body: { ...data },
      }),
      invalidatesTags: ["boat"],
    }),

    // status update for boat
    updateBoatStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `boat/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["boat"],
    }),
  }),
});

export const {
  useGetAllBoatQuery,
  useGetSingleBoatQuery,
  useCreateBoatMutation,
  useGetBoatListByLocationQuery,
  useGetMyBoatQuery,
  useUpdateBoatMutation,
  useDeleteBoatMutation,
  useDeleteTripMutation,
  useGetTripQuery,
  useUpdateTripMutation,
  useUpdateBoatStatusMutation,
} = BoatApi;
export default BoatApi;
