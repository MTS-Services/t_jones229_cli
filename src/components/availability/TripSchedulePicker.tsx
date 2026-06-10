"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Plus, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  dayHasOverlappingSlots,
  formatOverlapMessage,
  getOverlappingSlotIndices,
  timeSlotsOverlap,
  type ScheduleSlot,
} from "./tripScheduleUtils";

export interface ScheduleDay {
  date: string;
  slots: { startTime: string; endTime: string }[];
}

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

const DEFAULT_SLOT_CANDIDATES: ScheduleSlot[] = [
  { startTime: "08:00", endTime: "12:00" },
  { startTime: "13:00", endTime: "17:00" },
  { startTime: "06:00", endTime: "10:00" },
  { startTime: "17:00", endTime: "20:00" },
];

interface TripSchedulePickerProps {
  value?: ScheduleDay[];
  onChange: (schedules: ScheduleDay[]) => void;
  fieldName?: string;
}

function findNextAvailableSlot(existing: ScheduleSlot[]): ScheduleSlot | null {
  for (const candidate of DEFAULT_SLOT_CANDIDATES) {
    const overlaps = existing.some((slot) =>
      timeSlotsOverlap(
        slot.startTime,
        slot.endTime,
        candidate.startTime,
        candidate.endTime,
      ),
    );
    if (!overlaps) return candidate;
  }
  return null;
}

export default function TripSchedulePicker({
  value = [],
  onChange,
}: TripSchedulePickerProps) {
  const [schedules, setSchedules] = useState<ScheduleDay[]>(value);
  const [pickerDate, setPickerDate] = useState<Dayjs | null>(null);
  const today = dayjs().startOf("day");

  useEffect(() => {
    setSchedules(value || []);
  }, [value]);

  const overlapByDate = useMemo(() => {
    const map = new Map<string, Set<number>>();
    for (const day of schedules) {
      map.set(day.date, getOverlappingSlotIndices(day.slots));
    }
    return map;
  }, [schedules]);

  const hasAnyOverlap = useMemo(
    () => schedules.some((day) => dayHasOverlappingSlots(day.slots)),
    [schedules],
  );

  const sync = (next: ScheduleDay[]) => {
    setSchedules(next);
    onChange(next);
  };

  const rejectIfOverlapping = (day: ScheduleDay): boolean => {
    if (!dayHasOverlappingSlots(day.slots)) return false;
    toast.error(formatOverlapMessage(day.date, day.slots));
    return true;
  };

  const addDate = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    if (schedules.some((s) => s.date === dateStr)) return;
    sync([
      ...schedules,
      { date: dateStr, slots: [{ startTime: "08:00", endTime: "12:00" }] },
    ]);
    setPickerDate(null);
  };

  const removeDate = (dateStr: string) => {
    sync(schedules.filter((s) => s.date !== dateStr));
  };

  const addSlot = (dateStr: string) => {
    const day = schedules.find((s) => s.date === dateStr);
    if (!day) return;

    const nextSlot = findNextAvailableSlot(day.slots);
    if (!nextSlot) {
      toast.error(
        "No more non-overlapping time slots available on this day. Adjust or remove an existing slot first.",
      );
      return;
    }

    const nextDay: ScheduleDay = {
      ...day,
      slots: [...day.slots, nextSlot],
    };
    sync(
      schedules.map((s) => (s.date === dateStr ? nextDay : s)),
    );
  };

  const removeSlot = (dateStr: string, slotIndex: number) => {
    sync(
      schedules
        .map((s) => {
          if (s.date !== dateStr) return s;
          const slots = s.slots.filter((_, i) => i !== slotIndex);
          return slots.length ? { ...s, slots } : null;
        })
        .filter(Boolean) as ScheduleDay[],
    );
  };

  const updateSlot = (
    dateStr: string,
    slotIndex: number,
    field: "startTime" | "endTime",
    val: string,
  ) => {
    const next = schedules.map((s) => {
      if (s.date !== dateStr) return s;
      return {
        ...s,
        slots: s.slots.map((slot, i) =>
          i === slotIndex ? { ...slot, [field]: val } : slot,
        ),
      };
    });

    const updatedDay = next.find((s) => s.date === dateStr);
    if (!updatedDay) return;

    const slot = updatedDay.slots[slotIndex];
    if (slot.startTime >= slot.endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    if (rejectIfOverlapping(updatedDay)) return;

    sync(next);
  };

  const selectedDates = new Set(schedules.map((s) => s.date));

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        <CalendarDays className="inline-block h-4 w-4 mr-2 text-orange-500" />
        Available Dates &amp; Times
      </label>
      <p className="text-xs text-gray-500">
        Pick specific dates on the calendar, then add one or more time slots per
        day. Times on the same day cannot overlap (e.g. 08:00–11:00 and
        09:00–13:00 is not allowed).
      </p>

      {hasAnyOverlap && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Some time slots overlap on the same day. Fix the highlighted slots
            before saving.
          </p>
        </div>
      )}

      <div className="border-2 border-gray-200 rounded-lg p-3 max-w-sm bg-white">
        <Calendar
          fullscreen={false}
          value={pickerDate ?? undefined}
          disabledDate={(current) =>
            current ? current.isBefore(today) : false
          }
          onSelect={(date) => {
            setPickerDate(date);
            addDate(date);
          }}
          dateFullCellRender={(date) => {
            const key = date.format("YYYY-MM-DD");
            const isSelected = selectedDates.has(key);
            return (
              <div
                className={`ant-picker-cell-inner mx-auto rounded ${
                  isSelected ? "bg-orange-100 text-orange-700 font-semibold" : ""
                }`}
              >
                {date.date()}
              </div>
            );
          }}
        />
      </div>

      {schedules.length === 0 && (
        <p className="text-sm text-amber-600">
          Select at least one date and time slot for this trip.
        </p>
      )}

      <div className="space-y-4">
        {schedules
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((day) => {
            const overlapping = overlapByDate.get(day.date) ?? new Set<number>();

            return (
              <div
                key={day.date}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800">
                    {dayjs(day.date).format("ddd, MMM D, YYYY")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDate(day.date)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {day.slots.map((slot, idx) => {
                    const isOverlapping = overlapping.has(idx);

                    return (
                      <div key={idx}>
                        <div
                          className={`flex items-center gap-2 flex-wrap rounded-lg p-1 ${
                            isOverlapping
                              ? "border border-red-300 bg-red-50"
                              : ""
                          }`}
                        >
                          <select
                            value={slot.startTime}
                            onChange={(e) =>
                              updateSlot(
                                day.date,
                                idx,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className={`border rounded-lg px-2 py-1.5 text-sm ${
                              isOverlapping
                                ? "border-red-300 bg-white"
                                : "border-gray-200"
                            }`}
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-400">to</span>
                          <select
                            value={slot.endTime}
                            onChange={(e) =>
                              updateSlot(
                                day.date,
                                idx,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className={`border rounded-lg px-2 py-1.5 text-sm ${
                              isOverlapping
                                ? "border-red-300 bg-white"
                                : "border-gray-200"
                            }`}
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          {day.slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSlot(day.date, idx)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        {isOverlapping && (
                          <p className="mt-1 text-xs text-red-600">
                            Overlaps with another slot on this day
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => addSlot(day.date)}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add another time on this day
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
