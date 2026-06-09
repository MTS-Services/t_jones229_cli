"use client";

import { useEffect, useState } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Plus, Trash2, CalendarDays } from "lucide-react";

export interface ScheduleDay {
  date: string;
  slots: { startTime: string; endTime: string }[];
}

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

interface TripSchedulePickerProps {
  value?: ScheduleDay[];
  onChange: (schedules: ScheduleDay[]) => void;
  fieldName?: string;
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

  const sync = (next: ScheduleDay[]) => {
    setSchedules(next);
    onChange(next);
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
    sync(
      schedules.map((s) =>
        s.date === dateStr
          ? {
              ...s,
              slots: [...s.slots, { startTime: "13:00", endTime: "17:00" }],
            }
          : s,
      ),
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
    sync(
      schedules.map((s) =>
        s.date === dateStr
          ? {
              ...s,
              slots: s.slots.map((slot, i) =>
                i === slotIndex ? { ...slot, [field]: val } : slot,
              ),
            }
          : s,
      ),
    );
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
        day.
      </p>

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
          .map((day) => (
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
                {day.slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-wrap">
                    <select
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(day.date, idx, "startTime", e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span className="text-gray-400">to</span>
                    <select
                      value={slot.endTime}
                      onChange={(e) =>
                        updateSlot(day.date, idx, "endTime", e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
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
                ))}
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
          ))}
      </div>
    </div>
  );
}
