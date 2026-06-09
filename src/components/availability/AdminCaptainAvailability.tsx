"use client";

import { useEffect, useState } from "react";
import { Ban, CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";
import AvailabilityBlocksList from "./AvailabilityBlocksList";
import {
  useCreateAdminBlockMutation,
  useGetAvailabilityBlocksQuery,
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
  const today = new Date().toISOString().split("T")[0];
  const [activeDate, setActiveDate] = useState(today);
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(
    new Set(),
  );
  const [reason, setReason] = useState("");
  const [blockFullDay, setBlockFullDay] = useState(false);

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

  const availableSlots = scheduledTimes.filter((slot) => slot.available);

  useEffect(() => {
    setSelectedSlotIds(new Set());
    setBlockFullDay(false);
  }, [activeDate]);

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

  const formattedDate = new Date(activeDate + "T12:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

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
            Pick a date, select one or more of {captainName || "captain"}&apos;s
            scheduled times to block, or block the entire day.
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-sm">
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          Select date
        </label>
        <input
          type="date"
          value={activeDate}
          min={today}
          onChange={(e) => setActiveDate(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-4 border border-blue-100 rounded-lg p-4 bg-blue-50/50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Available times on {formattedDate}
          </h3>
          {availableSlots.length > 0 && (
            <span className="text-xs text-gray-500">
              Click to select · {selectedSlotIds.size} selected
            </span>
          )}
        </div>

        {loadingTimes ? (
          <p className="text-xs text-gray-500">Loading captain times...</p>
        ) : scheduledTimes.length === 0 ? (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            No trip schedules on this date. The captain has not added calendar
            times for this day yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {scheduledTimes.map((slot) => {
              const isSelected = selectedSlotIds.has(slot.scheduleId);
              const isDisabled = !slot.available;

              return (
                <button
                  key={slot.scheduleId}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && toggleSlot(slot.scheduleId)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all min-w-[140px] ${
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
      </div>

      <AvailabilityBlocksList
        blocks={blocksForActiveDate}
        onDeleted={() => refetchBlocks()}
      />

      <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-md"
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
                ? `Block ${selectedSlotIds.size} Selected Time${selectedSlotIds.size !== 1 ? "s" : ""}`
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
  );
}
