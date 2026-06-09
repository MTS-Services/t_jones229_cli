"use client";

import { useMemo, useState } from "react";
import { Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  groupSchedulesByDate,
  GroupedScheduleDay,
  TripScheduleRecord,
} from "./tripScheduleUtils";

interface TripScheduleHoverViewProps {
  schedules?: TripScheduleRecord[];
  duration?: number;
  tripDays?: string[];
  departureTime?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getCalendarDays(viewMonth: Dayjs): Dayjs[] {
  const monthStart = viewMonth.startOf("month");
  const monthEnd = viewMonth.endOf("month");
  const gridStart = monthStart.subtract(monthStart.day(), "day");
  const gridEnd = monthEnd.add(6 - monthEnd.day(), "day");

  const days: Dayjs[] = [];
  let current = gridStart;
  while (current.isBefore(gridEnd) || current.isSame(gridEnd, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }
  return days;
}

export default function TripScheduleHoverView({
  schedules = [],
  duration,
  tripDays = [],
  departureTime,
}: TripScheduleHoverViewProps) {
  const grouped = useMemo(
    () => groupSchedulesByDate(schedules),
    [schedules],
  );
  const scheduleByDate = useMemo(
    () => new Map(grouped.map((day) => [day.date, day])),
    [grouped],
  );
  const [viewMonth, setViewMonth] = useState<Dayjs>(
    () => dayjs(grouped[0]?.date || undefined),
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const calendarDays = useMemo(
    () => getCalendarDays(viewMonth),
    [viewMonth],
  );

  if (grouped.length === 0) {
    const hasLegacy =
      (duration && duration > 0) ||
      tripDays.length > 0 ||
      (departureTime && departureTime !== "");

    if (!hasLegacy) {
      return (
        <span className="text-xs text-amber-600">No dates scheduled yet</span>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {duration ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {duration}h
          </span>
        ) : null}
        {departureTime ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {departureTime}
          </span>
        ) : null}
        {tripDays.length > 0 ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {tripDays.join(", ")}
          </span>
        ) : null}
      </div>
    );
  }

  const totalSlots = grouped.reduce((sum, day) => sum + day.slots.length, 0);
  const activeDay: GroupedScheduleDay | undefined = activeDate
    ? scheduleByDate.get(activeDate)
    : undefined;

  const selectDate = (key: string, hasSlots: boolean) => {
    if (!hasSlots) return;
    setActiveDate(key);
  };

  const popoverContent = (
    <div className="w-[min(calc(100vw-2rem),320px)] sm:w-[340px]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Available dates &amp; times
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
            Tap or hover a highlighted date to view slots
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
          {grouped.length} dates
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setViewMonth((m) => m.subtract(1, "month"))}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800">
            {viewMonth.format("MMMM YYYY")}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setViewMonth((m) => m.add(1, "month"))}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 px-2 pt-2">
          {WEEKDAYS.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 px-2 pb-3 pt-1">
          {calendarDays.map((date) => {
            const key = date.format("YYYY-MM-DD");
            const daySchedule = scheduleByDate.get(key);
            const hasSlots = !!daySchedule;
            const isActive = activeDate === key;
            const isCurrentMonth = date.month() === viewMonth.month();

            return (
              <button
                key={key}
                type="button"
                disabled={!hasSlots}
                onMouseEnter={() => selectDate(key, hasSlots)}
                onFocus={() => selectDate(key, hasSlots)}
                onClick={() => selectDate(key, hasSlots)}
                className={`flex min-h-[44px] flex-col items-center justify-center rounded-lg px-0.5 py-1 text-center transition-colors sm:min-h-[48px] ${
                  isActive
                    ? "bg-orange-500 text-white ring-2 ring-orange-300 ring-inset"
                    : hasSlots
                      ? "cursor-pointer bg-orange-50 font-semibold text-orange-700 hover:bg-orange-100"
                      : isCurrentMonth
                        ? "text-gray-400"
                        : "text-gray-300"
                }`}
              >
                <span className="text-xs leading-none sm:text-sm">
                  {date.date()}
                </span>
                {daySchedule ? (
                  <span
                    className={`mt-0.5 text-[9px] leading-tight ${
                      isActive ? "text-orange-50" : "text-orange-600"
                    }`}
                  >
                    {daySchedule.slots.length} slot
                    {daySchedule.slots.length !== 1 ? "s" : ""}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 h-24 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
        {activeDay ? (
          <>
            <p className="text-xs font-semibold text-gray-800">
              {dayjs(activeDay.date).format("ddd, MMM D, YYYY")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeDay.slots.map((slot, index) => (
                <span
                  key={`${activeDay.date}-${index}`}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700"
                >
                  <Clock className="h-3 w-3 shrink-0 text-orange-500" />
                  {slot.startTime} – {slot.endTime}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs italic text-gray-400">
            Select a highlighted date to view its times
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      placement="bottomLeft"
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setActiveDate(null);
      }}
      overlayStyle={{ zIndex: 10050, maxWidth: "calc(100vw - 16px)" }}
      overlayInnerStyle={{ padding: 12 }}
      autoAdjustOverflow
      destroyOnHidden={false}
    >
      <button
        type="button"
        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        aria-label="View trip schedule"
        aria-expanded={open}
      >
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {grouped.length} date{grouped.length !== 1 ? "s" : ""} · {totalSlots}{" "}
          slot{totalSlots !== 1 ? "s" : ""}
        </span>
      </button>
    </Popover>
  );
}
