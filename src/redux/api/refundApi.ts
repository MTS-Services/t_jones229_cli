import { baseApi } from "./baseApi";

export type RefundMode = "AUTO_STRIPE" | "MANUAL";

const refundApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRefundSettings: build.query({
      query: () => ({ url: "/refund/settings", method: "GET" }),
      providesTags: ["refund"],
    }),

    getPublicRefundPolicy: build.query({
      query: () => ({ url: "/refund/policy", method: "GET" }),
    }),

    updateRefundSettings: build.mutation({
      query: (body: { customerRefundMode?: RefundMode }) => ({
        url: "/refund/settings",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(
        { customerRefundMode },
        { dispatch, queryFulfilled },
      ) {
        if (!customerRefundMode) return;
        const patch = dispatch(
          refundApi.util.updateQueryData(
            "getRefundSettings",
            undefined,
            (draft: { data?: { settings?: { customerRefundMode?: RefundMode } } }) => {
              if (draft?.data?.settings) {
                draft.data.settings.customerRefundMode = customerRefundMode;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    createRefundRule: build.mutation({
      query: (body: {
        label: string;
        minDaysBeforeTrip: number;
        refundPercentOfDeposit: number;
        sortOrder?: number;
        isActive?: boolean;
      }) => ({
        url: "/refund/rules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["refund"],
    }),

    updateRefundRule: build.mutation({
      query: ({
        id,
        ...body
      }: {
        id: string;
        label?: string;
        minDaysBeforeTrip?: number;
        refundPercentOfDeposit?: number;
        sortOrder?: number;
        isActive?: boolean;
      }) => ({
        url: `/refund/rules/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["refund"],
    }),

    deleteRefundRule: build.mutation({
      query: (id: string) => ({
        url: `/refund/rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["refund"],
    }),

    getManualRefundRequests: build.query({
      query: (status?: string) => ({
        url: `/refund/admin/manual-requests${
          status && status !== "ALL" ? `?status=${status}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["refund"],
    }),

    completeManualRefund: build.mutation({
      query: ({
        id,
        adminNote,
      }: {
        id: string;
        adminNote?: string;
      }) => ({
        url: `/refund/admin/manual-requests/${id}/complete`,
        method: "PATCH",
        body: { adminNote },
      }),
      invalidatesTags: ["refund", "booking"],
    }),
  }),
});

export const {
  useGetRefundSettingsQuery,
  useGetPublicRefundPolicyQuery,
  useUpdateRefundSettingsMutation,
  useCreateRefundRuleMutation,
  useUpdateRefundRuleMutation,
  useDeleteRefundRuleMutation,
  useGetManualRefundRequestsQuery,
  useCompleteManualRefundMutation,
} = refundApi;

export default refundApi;
