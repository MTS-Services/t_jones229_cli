import { baseApi } from "./baseApi";

export interface AvailabilityBlock {
  id: string;
  captainId: string;
  startDateTime: string;
  endDateTime: string;
  isFullDay: boolean;
  reason?: string;
  blockType: "MANUAL_CAPTAIN" | "MANUAL_ADMIN";
  createdBy?: {
    id: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export interface BoatTimeSlot {
  scheduleId?: string;
  tripId: string;
  tripName: string;
  departureTime: string;
  endTime: string;
  duration: number;
  price: number;
  tripType: string;
  available: boolean;
  reason?: string;
}

export interface CreateBlockPayload {
  captainId?: string;
  date: string;
  endDate?: string;
  isFullDay?: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

const availabilityApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCaptainScheduledTimes: build.query<
      CaptainScheduledTime[],
      { captainId: string; date: string }
    >({
      query: ({ captainId, date }) => ({
        url: `/availability/captain-times?captainId=${captainId}&date=${date}`,
        method: "GET",
      }),
      transformResponse: (response: { data: CaptainScheduledTime[] }) =>
        response.data,
      providesTags: ["availability"],
    }),

    getTimeSlots: build.query<BoatTimeSlot[], { boatId: string; tripDate: string }>({
      query: ({ boatId, tripDate }) => ({
        url: `/availability/slots?boatId=${boatId}&tripDate=${tripDate}`,
        method: "GET",
      }),
      transformResponse: (response: { data: BoatTimeSlot[] }) => response.data,
    }),

    checkTripAvailability: build.query<
      { available: boolean; reason?: string },
      { tripId: string; tripDate: string }
    >({
      query: ({ tripId, tripDate }) => ({
        url: `/availability/check?tripId=${tripId}&tripDate=${tripDate}`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: { available: boolean; reason?: string };
      }) => response.data,
    }),

    getAvailabilityBlocks: build.query<
      AvailabilityBlock[],
      { month?: number; year?: number; captainId?: string }
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params.month) search.set("month", String(params.month));
        if (params.year) search.set("year", String(params.year));
        if (params.captainId) search.set("captainId", params.captainId);
        const qs = search.toString();
        return {
          url: `/availability/blocks${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: AvailabilityBlock[] }) =>
        response.data,
      providesTags: ["availability"],
    }),

    createCaptainBlock: build.mutation<AvailabilityBlock, CreateBlockPayload>({
      query: (body) => ({
        url: "/availability/blocks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["availability", "calendar"],
    }),

    createAdminBlock: build.mutation<AvailabilityBlock, CreateBlockPayload>({
      query: (body) => ({
        url: "/availability/blocks/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["availability", "calendar"],
    }),

    deleteAvailabilityBlock: build.mutation<void, string>({
      query: (blockId) => ({
        url: `/availability/blocks/${blockId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["availability", "calendar"],
    }),
  }),
});

export const {
  useGetCaptainScheduledTimesQuery,
  useGetTimeSlotsQuery,
  useLazyGetTimeSlotsQuery,
  useCheckTripAvailabilityQuery,
  useLazyCheckTripAvailabilityQuery,
  useGetAvailabilityBlocksQuery,
  useCreateCaptainBlockMutation,
  useCreateAdminBlockMutation,
  useDeleteAvailabilityBlockMutation,
} = availabilityApi;

export default availabilityApi;
