import { baseApi } from "./baseApi";

const payoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Captain: get earnings summary (available balance)
    getEarningsSummary: build.query({
      query: () => ({
        url: "/payout/earnings",
        method: "GET",
      }),
      providesTags: ["payout"],
    }),

    // Captain: save bank details
    saveBankDetails: build.mutation({
      query: (data: {
        bankName: string;
        bankAccountName: string;
        bankRoutingNumber: string;
        bankAccountNumber: string;
        bankAccountType: string;
        bankCountry: string;
        bankCity?: string;
      }) => ({
        url: "/payout/bank-details",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payout"],
    }),

    // Captain: get own bank details
    getBankDetails: build.query({
      query: () => ({
        url: "/payout/bank-details",
        method: "GET",
      }),
      providesTags: ["payout"],
    }),

    // Captain: create payout request
    createPayoutRequest: build.mutation({
      query: (data: { amount: number; note?: string }) => ({
        url: "/payout/request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payout"],
    }),

    // Captain: get own payout requests
    getCaptainPayoutRequests: build.query({
      query: () => ({
        url: "/payout/requests",
        method: "GET",
      }),
      providesTags: ["payout"],
    }),

    // Admin: get all payout requests
    getAllPayoutRequests: build.query({
      query: () => ({
        url: "/payout/admin/requests",
        method: "GET",
      }),
      providesTags: ["payout"],
    }),

    // Admin: approve or reject payout request
    updatePayoutRequestStatus: build.mutation({
      query: ({
        id,
        status,
        adminNote,
      }: {
        id: string;
        status: "APPROVED" | "REJECTED";
        adminNote?: string;
      }) => ({
        url: `/payout/admin/requests/${id}`,
        method: "PATCH",
        body: { status, adminNote },
      }),
      invalidatesTags: ["payout"],
    }),
  }),
});

export const {
  useGetEarningsSummaryQuery,
  useSaveBankDetailsMutation,
  useGetBankDetailsQuery,
  useCreatePayoutRequestMutation,
  useGetCaptainPayoutRequestsQuery,
  useGetAllPayoutRequestsQuery,
  useUpdatePayoutRequestStatusMutation,
} = payoutApi;
