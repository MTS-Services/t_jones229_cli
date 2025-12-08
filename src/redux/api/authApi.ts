// src/api/AuthApi.ts
import { baseApi } from "./baseApi";

const AuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Sign up user or client
    signup: build.mutation({
      query: (formData: any) => ({
        url: `/users/register`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["auth"],
    }),

    // Login user
    login: build.mutation({
      query: (data: any) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // Contact support
    support: build.mutation({
      query: (data: any) => ({
        url: `/users/support`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["support"],
    }),

    // Get all users with filters
    allUser: build.query({
      query: ({ email, limit, page, roles }) => {
        const params = new URLSearchParams();
        if (email) params.append("email", email);
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);
        roles?.forEach((role: any) => params.append("role", role));

        return {
          url: `/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),

    // Get single user by ID
    singleUser: build.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["user", "userBooking", "boat"],
    }),

    // Approve boat request (make sure GET is correct, usually PUT or POST is used to update)
    approveReq: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/boat/status/${id}`,
        method: "PATCH", // Consider if this should be PUT or POST
        body: data,
      }),
      invalidatesTags: ["user", "boat", "userBooking"],
    }),

    // Get current authenticated user
    getMe: build.query({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
      providesTags: ["auth"],
    }),

    //send mail to captain
    sentMessageCaptain: build.mutation({
      query: ({ data, id }) => ({
        url: `/booking/send-email-captain/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    DeleteUser: build.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      // Assuming this mutation is for deleting a user, it invalidates the auth tag
    }),
    // Contact support
    sendOtp: build.mutation({
      query: (data: any) => ({
        url: `/users/send-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    // Contact support
    changePassword: build.mutation({
      query: (data: any) => ({
        url: `/users/change-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // forgot password
    forgotPassword: build.mutation({
      query: (data: any) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    // forgot password
    resetPassword: build.mutation({
      query: (data: any) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useSupportMutation,
  useAllUserQuery,
  useSingleUserQuery,
  useApproveReqMutation,
  useGetMeQuery,
  useSentMessageCaptainMutation,
  useDeleteUserMutation,
  useSendOtpMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = AuthApi;
