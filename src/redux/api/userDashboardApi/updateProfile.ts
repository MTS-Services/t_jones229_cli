// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";

const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get single boat
    updateProfile: build.mutation({
      query: (updateInfo) => ({
        url: `/users/update-profile`,
        method: "PUT",
        body: updateInfo,
      }),
      invalidatesTags: ["userBooking"],
    }),
    //  cancle membership
    cancleMemberShip: build.mutation({
      query: () => ({
        url: `/users/cancel-subscriptions`,
        method: "POST",
      }),
      invalidatesTags: ["userBooking", "user", "auth"],
    }),
  }),
});
export const { useUpdateProfileMutation, useCancleMemberShipMutation } =
  updateProfileApi;
export default updateProfileApi;
