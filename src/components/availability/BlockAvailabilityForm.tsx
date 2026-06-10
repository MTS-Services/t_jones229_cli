"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ban, Clock, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateCaptainBlockMutation,
  useGetCaptainScheduledTimesQuery,
  type AvailabilityBlock,
  type CaptainScheduledTime,
} from "@/redux/api/availabilityApi";
import { formatWallClockTime } from "./AvailabilityBlocksList";

interface BlockAvailabilityFormProps {
  date: string;
  blocks?: AvailabilityBlock[];
  onSuccess?: () => void;
  lockDate?: boolean;
}

function slotOverlapsBlock(
  slot: Pick<CaptainScheduledTime, "startTime" | "endTime">,
  block: AvailabilityBlock,
): boolean {
  if (block.isFullDay) return true;
  const blockStart = formatWallClockTime(block.startDateTime);
  const blockEnd = formatWallClockTime(block.endDateTime);
  return slot.startTime < blockEnd && blockStart < slot.endTime;
}

function isSlotAlreadyBlocked(
  slot: CaptainScheduledTime,
  blocks: AvailabilityBlock[],
): boolean {
  return blocks.some((block) => slotOverlapsBlock(slot, block));
}

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

function SaveButton({
  onClick,
  disabled,
  loading,
  label = "Save",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#035292] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#024070] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}

export default function BlockAvailabilityForm({
  date,
  blocks = [],
  onSuccess,
  lockDate = false,
}: BlockAvailabilityFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const isPastDate = date < today;

  const [days, setDays] = useState<string[]>([date]);
  const [selectedSlotKeys, setSelectedSlotKeys] = useState<Set<string>>(
    new Set(),
  );
  const [isFullDay, setIsFullDay] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [customReason, setCustomReason] = useState("");
  const [savingAction, setSavingAction] = useState<
    "block" | "custom" | null
  >(null);

  const [createCaptainBlock, { isLoading }] = useCreateCaptainBlockMutation();

  const {
    data: scheduledTimes = [],
    isFetching: loadingTimes,
    refetch: refetchTimes,
  } = useGetCaptainScheduledTimesQuery(
    { date },
    { skip: !date, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    setDays([date]);
    setSelectedSlotKeys(new Set());
    setIsFullDay(false);
    setBlockReason("");
    setCustomReason("");
  }, [date]);

  const availableSlots = scheduledTimes.filter(
    (slot) => slot.available && !isSlotAlreadyBlocked(slot, blocks),
  );

  const slotKey = (slot: CaptainScheduledTime) =>
    `${slot.startTime}-${slot.endTime}-${slot.tripId}`;

  const toggleSlot = (slot: CaptainScheduledTime) => {
    setIsFullDay(false);
    const key = slotKey(slot);
    setSelectedSlotKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const addAnotherDay = () => setDays((prev) => [...prev, date]);
  const removeDay = (index: number) => {
    if (days.length === 1) return;
    setDays((prev) => prev.filter((_, i) => i !== index));
  };
  const updateDay = (index: number, value: string) => {
    setDays((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const afterSave = () => {
    onSuccess?.();
    refetchTimes();
  };

  const handleBlockTripTimes = async () => {
    if (isPastDate) {
      toast.error("Cannot block past dates");
      return;
    }

    const uniqueDays = [...new Set(days.filter(Boolean))];

    if (isFullDay) {
      setSavingAction("block");
      try {
        for (const day of uniqueDays) {
          await createCaptainBlock({
            date: day,
            isFullDay: true,
            reason: blockReason || undefined,
          }).unwrap();
        }
        toast.success(
          uniqueDays.length === 1 ? "Full day blocked" : "Days blocked",
        );
        setBlockReason("");
        setIsFullDay(false);
        afterSave();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to block full day");
      } finally {
        setSavingAction(null);
      }
      return;
    }

    if (selectedSlotKeys.size === 0) {
      toast.error("Select at least one trip time to block");
      return;
    }

    const slotsToBlock = availableSlots.filter((s) =>
      selectedSlotKeys.has(slotKey(s)),
    );

    setSavingAction("block");
    let successCount = 0;
    try {
      for (const slot of slotsToBlock) {
        try {
          await createCaptainBlock({
            date,
            isFullDay: false,
            startTime: slot.startTime,
            endTime: slot.endTime,
            reason: blockReason || `Blocked: ${slot.tripName}`,
          }).unwrap();
          successCount++;
        } catch (err: any) {
          toast.error(err?.data?.message || "Could not block this time slot");
          break;
        }
      }
      if (successCount > 0) {
        toast.success(
          successCount === 1
            ? "Time slot blocked"
            : `${successCount} time slots blocked`,
        );
        setSelectedSlotKeys(new Set());
        setBlockReason("");
        afterSave();
      }
    } finally {
      setSavingAction(null);
    }
  };

  const handleAddCustomTime = async () => {
    if (isPastDate) {
      toast.error("Cannot block past dates");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const uniqueDays = lockDate ? [date] : [...new Set(days.filter(Boolean))];

    setSavingAction("custom");
    let successCount = 0;
    try {
      for (const day of uniqueDays) {
        try {
          await createCaptainBlock({
            date: day,
            isFullDay: false,
            startTime,
            endTime,
            reason: customReason || undefined,
          }).unwrap();
          successCount++;
        } catch (err: any) {
          toast.error(
            err?.data?.message ||
              "Failed to block this time. It may already be blocked.",
          );
          break;
        }
      }
      if (successCount > 0) {
        toast.success("Custom time blocked");
        setCustomReason("");
        setDays([date]);
        afterSave();
      }
    } finally {
      setSavingAction(null);
    }
  };

  const canBlockTripTimes =
    !isPastDate && (isFullDay || selectedSlotKeys.size > 0);
  const canSaveCustomTime = !isPastDate && startTime < endTime;

  return (
    <div className="mt-4 space-y-6 border-t border-gray-100 pt-4">
      {/* ——— Block existing trip times ——— */}
      <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Ban className="h-4 w-4 text-red-500" />
            Block trip times
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Select your scheduled trip times on this date to mark them
            unavailable.
          </p>
        </div>

        {loadingTimes ? (
          <p className="text-xs text-gray-500">Loading your trip times...</p>
        ) : scheduledTimes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {scheduledTimes.map((slot) => {
              const key = slotKey(slot);
              const isSelected = selectedSlotKeys.has(key);
              const alreadyBlocked =
                slot.blocked || isSlotAlreadyBlocked(slot, blocks);
              const isDisabled =
                isPastDate || !slot.available || alreadyBlocked;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && toggleSlot(slot)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                    isDisabled
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : isSelected
                        ? "border-red-600 bg-red-600 text-white shadow-sm"
                        : "border-orange-200 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  <span className="block font-semibold">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] ${
                      isSelected ? "text-red-100" : "text-gray-500"
                    }`}
                  >
                    {slot.tripName?.trim()}
                    {slot.booked && " · Booked"}
                    {(alreadyBlocked || slot.blocked) && " · Blocked"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-3 text-xs text-amber-800">
            <p className="font-medium">No trip times on this date</p>
            <p className="mt-1">
              Add dates and times in{" "}
              <Link
                href="/dashboard/check-your-trip"
                className="font-semibold text-blue-700 underline"
              >
                Check Your Trip
              </Link>{" "}
              first.
            </p>
          </div>
        )}

        {availableSlots.length === 0 && scheduledTimes.length > 0 && (
          <p className="text-xs text-amber-700">
            All trip times on this date are already booked or blocked.
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isFullDay}
            onChange={(e) => {
              setIsFullDay(e.target.checked);
              if (e.target.checked) setSelectedSlotKeys(new Set());
            }}
            disabled={isPastDate}
            className="rounded border-gray-300"
          />
          Block entire day
        </label>

        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Reason (optional)
          </label>
          <input
            type="text"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="e.g. Personal day off"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end pt-1">
          <SaveButton
            onClick={handleBlockTripTimes}
            disabled={!canBlockTripTimes}
            loading={savingAction === "block" && isLoading}
          />
        </div>
      </section>

      {/* ——— Add custom blocked time ——— */}
      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="h-4 w-4 text-[#035292]" />
            Add new blocked time
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Block a custom time range that is not in your trip schedule.
          </p>
        </div>

        {!lockDate && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Dates</p>
            {days.map((day, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="date"
                  value={day}
                  min={today}
                  onChange={(e) => updateDay(index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {days.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="rounded-lg p-2 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAnotherDay}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add another day
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Start time
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              End time
            </label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">
            Reason (optional)
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="e.g. Maintenance"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end pt-1">
          <SaveButton
            onClick={handleAddCustomTime}
            disabled={!canSaveCustomTime}
            loading={savingAction === "custom" && isLoading}
          />
        </div>
      </section>
    </div>
  );
}
