"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateCaptainBlockMutation,
} from "@/redux/api/availabilityApi";

interface BlockAvailabilityFormProps {
  date: string;
  onSuccess?: () => void;
}

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export default function BlockAvailabilityForm({
  date,
  onSuccess,
}: BlockAvailabilityFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [days, setDays] = useState<string[]>([date]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [reason, setReason] = useState("");

  const [createCaptainBlock, { isLoading }] = useCreateCaptainBlockMutation();

  useEffect(() => {
    setDays([date]);
  }, [date]);

  const addAnotherDay = () => setDays((prev) => [...prev, date]);
  const removeDay = (index: number) => {
    if (days.length === 1) return;
    setDays((prev) => prev.filter((_, i) => i !== index));
  };
  const updateDay = (index: number, value: string) => {
    setDays((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uniqueDays = [...new Set(days.filter(Boolean))];
    if (!isFullDay && startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    let successCount = 0;

    for (const day of uniqueDays) {
      try {
        await createCaptainBlock({
          date: day,
          isFullDay,
          startTime: isFullDay ? undefined : startTime,
          endTime: isFullDay ? undefined : endTime,
          reason: reason || undefined,
        }).unwrap();
        successCount++;
      } catch (err: any) {
        if (uniqueDays.length === 1) {
          toast.error(
            err?.data?.message ||
              "Failed to block this day. It may already be blocked.",
          );
          return;
        }
      }
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Day blocked successfully"
          : `${successCount} days blocked successfully`,
      );
      setDays([date]);
      setReason("");
      onSuccess?.();
    } else {
      toast.error("Could not block the selected days");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-900">Block Unavailable Time</h3>

      <div className="space-y-2">
        {days.map((day, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="date"
              value={day}
              min={today}
              onChange={(e) => updateDay(index, e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              required
            />
            {days.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(index)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addAnotherDay}
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add another day
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start time {!isFullDay && <span className="text-red-500">*</span>}
          </label>
          <select
            value={startTime}
            disabled={isFullDay}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End time {!isFullDay && <span className="text-red-500">*</span>}
          </label>
          <select
            value={endTime}
            disabled={isFullDay}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isFullDay}
          onChange={(e) => setIsFullDay(e.target.checked)}
          className="rounded border-gray-300"
        />
        Block entire day instead
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Reason (optional)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Personal day off"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isLoading ? "Blocking..." : days.length > 1 ? `Block ${days.length} Days` : "Block This Day"}
      </button>
    </form>
  );
}
