"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Ban, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import AvailabilityBlocksList from "./AvailabilityBlocksList";
import {
  useCreateAdminBlockMutation,
  useGetAvailabilityBlocksQuery,
  useGetCaptainScheduleMonthQuery,
  useGetCaptainScheduledTimesQuery,
  type CaptainScheduledTime,
} from "@/redux/api/availabilityApi";

interface AdminCaptainAvailabilityProps {
  captainId: string;
  captainName?: string;
}

export default function AdminCaptainAvailability({
  captainId,
  captainName,
}: AdminCaptainAvailabilityProps) {
  const today = dayjs().startOf("day");
  const todayStr = today.format("YYYY-MM-DD");
  const [viewMonth, setViewMonth] = useState<Dayjs>(today);
  const [activeDate, setActiveDate] = useState(todayStr);
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(
    new Set(),
  );
  const [reason, setReason] = useState("");
  const [blockFullDay, setBlockFullDay] = useState(false);

  const calendarMonth = viewMonth.month() + 1;
  const calendarYear = viewMonth.year();

  const { data: blocks = [], refetch: refetchBlocks } =
    useGetAvailabilityBlocksQuery({
      captainId,
      month: calendarMonth,
      year: calendarYear,
    });

  const { data: monthDays = [], isFetching: loadingMonth } =
    useGetCaptainScheduleMonthQuery({
      captainId,
      month: calendarMonth,
      year: calendarYear,
    });

  const { data: scheduledTimes = [], isFetching: loadingTimes } =
    useGetCaptainScheduledTimesQuery(
      { captainId, date: activeDate },
      { skip: !activeDate },
    );

  const [createAdminBlock, { isLoading }] = useCreateAdminBlockMutation();

  const monthDayMap = useMemo(
    () => new Map(monthDays.map((d) => [d.date, d])),
    [monthDays],
  );

  const availableSlots = scheduledTimes.filter((slot) => slot.available);
  const activeDaySummary = monthDayMap.get(activeDate);

  useEffect(() => {
    setSelectedSlotIds(new Set());
    setBlockFullDay(false);
  }, [activeDate]);

  const selectCalendarDate = (date: Dayjs) => {
    if (date.isBefore(today, "day")) return;
    setActiveDate(date.format("YYYY-MM-DD"));
  };

  const toggleSlot = (scheduleId: string) => {
    setBlockFullDay(false);
    setSelectedSlotIds((prev) => {
      const next = new Set(prev);
      if (next.has(scheduleId)) next.delete(scheduleId);
      else next.add(scheduleId);
      return next;
    });
  };

  const blockOneSlot = async (slot: CaptainScheduledTime) => {
    try {
      await createAdminBlock({
        captainId,
        date: activeDate,
        isFullDay: false,
        startTime: slot.startTime,
        endTime: slot.endTime,
        reason: reason || `Blocked: ${slot.tripName}`,
      }).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const handleBlockSelectedSlots = async () => {
    if (selectedSlotIds.size === 0) {
      toast.error("Select at least one available time slot to block");
      return;
    }

    const slotsToBlock = availableSlots.filter((s) =>
      selectedSlotIds.has(s.scheduleId),
    );

    let successCount = 0;
    for (const slot of slotsToBlock) {
      const ok = await blockOneSlot(slot);
      if (ok) successCount++;
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Time slot blocked"
          : `${successCount} time slots blocked`,
      );
      setSelectedSlotIds(new Set());
      setReason("");
      refetchBlocks();
    } else {
      toast.error("Could not block selected times");
    }
  };

  const handleBlockFullDay = async () => {
    try {
      await createAdminBlock({
        captainId,
        date: activeDate,
        isFullDay: true,
        reason: reason || "Full day blocked by admin",
      }).unwrap();
      toast.success("Full day blocked");
      setSelectedSlotIds(new Set());
      setBlockFullDay(false);
      setReason("");
      refetchBlocks();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to block full day");
    }
  };

  const blocksForActiveDate = blocks.filter((b) => {
    const blockDate = new Date(b.startDateTime).toISOString().split("T")[0];
    return blockDate === activeDate;
  });

  const formattedDate = dayjs(activeDate).format("ddd, MMM D, YYYY");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-50 rounded-lg">
          <Ban className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Block Captain Availability
          </h2>
          <p className="text-sm text-gray-500">
            Use the calendar to pick a day with {captainName || "captain"}&apos;s
            trip times, select slots to block, or block the full day.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Captain schedule calendar (same style as client trip picker) */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-orange-500" />
            Captain trip calendar
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Orange = has scheduled times · Green count = still available
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-2">
            <Calendar
              fullscreen={false}
              value={dayjs(activeDate)}
              onPanelChange={(date) => setViewMonth(date)}
              onSelect={selectCalendarDate}
              disabledDate={(current) =>
                current ? current.isBefore(today, "day") : false
              }
              fullCellRender={(date) => {
                const key = date.format("YYYY-MM-DD");
                const summary = monthDayMap.get(key);
                const isSelected = key === activeDate;
                const hasSlots = !!summary && summary.totalSlots > 0;

                return (
                  <div
                    className={`mx-auto rounded px-0.5 py-1 text-center min-h-[42px] ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold ring-2 ring-blue-300"
                        : hasSlots
                          ? "bg-orange-100 text-orange-800 font-semibold"
                          : ""
                    }`}
                  >
                    <div>{date.date()}</div>
                    {hasSlots && (
                      <div
                        className={`text-[9px] leading-tight ${
                          isSelected ? "text-blue-100" : "text-orange-600"
                        }`}
                      >
                        {summary.availableSlots}/{summary.totalSlots} free
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {loadingMonth && (
            <p className="text-xs text-gray-400 mt-2">Loading calendar...</p>
          )}
        </div>

        {/* Time slots for selected day */}
        <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/30 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Times on {formattedDate}
            </h3>
            {availableSlots.length > 0 && (
              <span className="text-xs text-gray-500">
                {selectedSlotIds.size} selected
              </span>
            )}
          </div>

          {activeDaySummary && (
            <p className="text-xs text-gray-600 mb-3">
              {activeDaySummary.availableSlots} of {activeDaySummary.totalSlots}{" "}
              slot{activeDaySummary.totalSlots !== 1 ? "s" : ""} still available
            </p>
          )}

          {loadingTimes ? (
            <p className="text-xs text-gray-500">Loading times...</p>
          ) : scheduledTimes.length === 0 ? (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              No trip schedules on this date. Pick an orange date on the
              calendar or the captain must add times first.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 flex-1 content-start">
              {scheduledTimes.map((slot) => {
                const isSelected = selectedSlotIds.has(slot.scheduleId);
                const isDisabled = !slot.available;

                return (
                  <button
                    key={slot.scheduleId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && toggleSlot(slot.scheduleId)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-all min-w-[150px] ${
                      isDisabled
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isSelected
                          ? "border-red-600 bg-red-600 text-white font-bold shadow-md ring-2 ring-red-300"
                          : "border-gray-200 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50"
                    }`}
                  >
                    <span className="block font-semibold">
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span
                      className={`block text-xs mt-0.5 ${
                        isSelected ? "text-red-100" : "text-gray-500"
                      }`}
                    >
                      {slot.tripName}
                      {slot.booked && " · Booked"}
                      {slot.blocked && " · Blocked"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <AvailabilityBlocksList
            blocks={blocksForActiveDate}
            onDeleted={() => refetchBlocks()}
          />

          <div className="space-y-3 border-t border-gray-200 pt-4 mt-4">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isLoading || selectedSlotIds.size === 0}
                onClick={handleBlockSelectedSlots}
                className="py-2 px-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg"
              >
                {isLoading
                  ? "Blocking..."
                  : selectedSlotIds.size > 0
                    ? `Block ${selectedSlotIds.size} Selected`
                    : "Block Selected Times"}
              </button>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockFullDay}
                  onChange={(e) => {
                    setBlockFullDay(e.target.checked);
                    if (e.target.checked) setSelectedSlotIds(new Set());
                  }}
                  className="rounded"
                />
                Block entire day
              </label>

              {blockFullDay && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleBlockFullDay}
                  className="py-2 px-5 bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                >
                  Confirm Full Day Block
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
