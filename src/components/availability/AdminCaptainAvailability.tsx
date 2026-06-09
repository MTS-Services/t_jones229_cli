"use client";

import { useState } from "react";
import { Ban, CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import AvailabilityBlocksList from "./AvailabilityBlocksList";
import {
  useCreateAdminBlockMutation,
  useGetAvailabilityBlocksQuery,
  useGetCaptainScheduledTimesQuery,
} from "@/redux/api/availabilityApi";

interface AdminCaptainAvailabilityProps {
  captainId: string;
  captainName?: string;
}

export default function AdminCaptainAvailability({
  captainId,
  captainName,
}: AdminCaptainAvailabilityProps) {
  const today = new Date().toISOString().split("T")[0];
  const [days, setDays] = useState<string[]>([today]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [reason, setReason] = useState("");
  const [activeDate, setActiveDate] = useState(today);

  const now = new Date();
  const { data: blocks = [], refetch: refetchBlocks } =
    useGetAvailabilityBlocksQuery({
      captainId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

  const { data: scheduledTimes = [], isFetching: loadingTimes } =
    useGetCaptainScheduledTimesQuery(
      { captainId, date: activeDate },
      { skip: !activeDate },
    );

  const [createAdminBlock, { isLoading }] = useCreateAdminBlockMutation();

  const addAnotherDay = () => setDays((prev) => [...prev, today]);
  const removeDay = (index: number) => {
    if (days.length === 1) return;
    setDays((prev) => prev.filter((_, i) => i !== index));
  };
  const updateDay = (index: number, value: string) => {
    setDays((prev) => prev.map((d, i) => (i === index ? value : d)));
    setActiveDate(value);
  };

  const blockScheduledTime = async (
    date: string,
    start: string,
    end: string,
    tripName: string,
  ) => {
    try {
      await createAdminBlock({
        captainId,
        date,
        isFullDay: false,
        startTime: start,
        endTime: end,
        reason: reason || `Blocked: ${tripName}`,
      }).unwrap();
      toast.success(`Blocked ${start}–${end}`);
      refetchBlocks();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to block time");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueDays = [...new Set(days.filter(Boolean))];
    if (!uniqueDays.length) {
      toast.error("Please select at least one date");
      return;
    }
    if (!isFullDay && startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    let successCount = 0;
    for (const date of uniqueDays) {
      try {
        await createAdminBlock({
          captainId,
          date,
          isFullDay,
          startTime: isFullDay ? undefined : startTime,
          endTime: isFullDay ? undefined : endTime,
          reason: reason || undefined,
        }).unwrap();
        successCount++;
      } catch {
        /* continue */
      }
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Day blocked successfully"
          : `${successCount} days blocked`,
      );
      setDays([today]);
      setReason("");
      refetchBlocks();
    } else {
      toast.error("Could not block — time may already be blocked");
    }
  };

  const blocksForActiveDate = blocks.filter((b) => {
    const blockDate = new Date(b.startDateTime).toISOString().split("T")[0];
    return blockDate === activeDate;
  });

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
            View {captainName || "captain"}&apos;s scheduled trip times by day
            and block specific slots or full days.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          Select date to view scheduled times
        </label>
        <div className="space-y-2 max-w-sm">
          {days.map((day, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="date"
                value={day}
                min={today}
                onChange={(e) => updateDay(index, e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAnotherDay}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add another day
          </button>
        </div>
      </div>

      {/* Auto-fetched captain trip times for selected day */}
      <div className="mb-4 border border-blue-100 rounded-lg p-4 bg-blue-50/50">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Scheduled trip times on{" "}
          {new Date(activeDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        {loadingTimes ? (
          <p className="text-xs text-gray-500">Loading times...</p>
        ) : scheduledTimes.length === 0 ? (
          <p className="text-xs text-gray-500">
            No trip schedules on this date.
          </p>
        ) : (
          <div className="space-y-2">
            {scheduledTimes.map((slot) => (
              <div
                key={slot.scheduleId}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
              >
                <div className="text-sm">
                  <span className="font-medium text-gray-800">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <span className="text-gray-500 ml-2">· {slot.tripName}</span>
                  {!slot.available && (
                    <span className="ml-2 text-xs text-red-600">
                      {slot.booked ? "(Booked)" : "(Blocked)"}
                    </span>
                  )}
                </div>
                {slot.available && (
                  <button
                    type="button"
                    onClick={() =>
                      blockScheduledTime(
                        activeDate,
                        slot.startTime,
                        slot.endTime,
                        slot.tripName,
                      )
                    }
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Block
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AvailabilityBlocksList
        blocks={blocksForActiveDate}
        onDeleted={() => refetchBlocks()}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border-t border-gray-100 pt-4 mt-4"
      >
        <h3 className="text-sm font-semibold text-gray-900">
          Or block custom time / full day
        </h3>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Start time {!isFullDay && "*"}
            </label>
            <select
              value={startTime}
              disabled={isFullDay}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
            >
              {["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              End time {!isFullDay && "*"}
            </label>
            <select
              value={endTime}
              disabled={isFullDay}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
            >
              {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isFullDay}
            onChange={(e) => setIsFullDay(e.target.checked)}
            className="rounded"
          />
          Block entire day instead
        </label>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-md"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
        >
          {isLoading ? "Blocking..." : "Block Selected Day(s)"}
        </button>
      </form>
    </div>
  );
}
