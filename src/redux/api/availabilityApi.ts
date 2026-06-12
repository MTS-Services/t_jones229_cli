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

export interface CaptainScheduledTime {
  scheduleId: string;
  tripId: string;
  tripName: string;
  boatId: string;
  startTime: string;
  endTime: string;
  booked: boolean;
  blocked: boolean;
  blockedBy?: "captain" | "admin";
  available: boolean;
}

export interface CaptainScheduleDaySummary {
  date: string;
  totalSlots: number;
  availableSlots: number;
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
      { captainId?: string; date: string }
    >({
      query: ({ captainId, date }) => {
        const params = new URLSearchParams({ date });
        if (captainId) params.set("captainId", captainId);
        return {
          url: `/availability/captain-times?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: CaptainScheduledTime[] }) =>
        response.data,
      providesTags: ["availability"],
    }),

    getCaptainScheduleMonth: build.query<
      CaptainScheduleDaySummary[],
      { captainId?: string; month: number; year: number }
    >({
      query: ({ captainId, month, year }) => {
        const params = new URLSearchParams({
          month: String(month),
          year: String(year),
        });
        if (captainId) params.set("captainId", captainId);
        return {
          url: `/availability/captain-schedule-month?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: CaptainScheduleDaySummary[] }) =>
        response.data,
      providesTags: ["availability"],
    }),

    getCaptainScheduleOverview: build.query<
      CaptainScheduleDaySummary[],
      { captainId: string }
    >({
      query: ({ captainId }) => ({
        url: `/availability/captain-schedule-overview?captainId=${captainId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: CaptainScheduleDaySummary[] }) =>
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

    createTripScheduleSlot: build.mutation<
      unknown,
      {
        tripId: string;
        date: string;
        startTime: string;
        endTime: string;
      }
    >({
      query: (body) => ({
        url: "/availability/trip-schedules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["availability", "calendar", "boat"],
    }),

    updateTripScheduleSlot: build.mutation<
      unknown,
      { scheduleId: string; startTime: string; endTime: string }
    >({
      query: ({ scheduleId, ...body }) => ({
        url: `/availability/trip-schedules/${scheduleId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["availability", "calendar", "boat"],
    }),

    deleteTripScheduleSlot: build.mutation<
      unknown,
      string
    >({
      query: (scheduleId) => ({
        url: `/availability/trip-schedules/${scheduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["availability", "calendar", "boat"],
    }),
  }),
});

export const {
  useGetCaptainScheduledTimesQuery,
  useGetCaptainScheduleMonthQuery,
  useGetCaptainScheduleOverviewQuery,
  useGetTimeSlotsQuery,
  useLazyGetTimeSlotsQuery,
  useCheckTripAvailabilityQuery,
  useLazyCheckTripAvailabilityQuery,
  useGetAvailabilityBlocksQuery,
  useCreateCaptainBlockMutation,
  useCreateAdminBlockMutation,
  useDeleteAvailabilityBlockMutation,
  useCreateTripScheduleSlotMutation,
  useUpdateTripScheduleSlotMutation,
  useDeleteTripScheduleSlotMutation,
} = availabilityApi;

export default availabilityApi;
