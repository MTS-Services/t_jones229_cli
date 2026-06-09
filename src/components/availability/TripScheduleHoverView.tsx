"use client";

import { useMemo, useState } from "react";
import { Calendar, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CalendarDays, Clock } from "lucide-react";
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
  const selectedDates = useMemo(
    () => new Set(grouped.map((day) => day.date)),
    [grouped],
  );
  const [viewMonth, setViewMonth] = useState<Dayjs>(
    () => dayjs(grouped[0]?.date || undefined),
  );
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  if (grouped.length === 0) {
    const hasLegacy =
      (duration && duration > 0) ||
      tripDays.length > 0 ||
      (departureTime && departureTime !== "");

    if (!hasLegacy) {
      return (
        <span className="text-xs text-amber-600">
          No dates scheduled yet
        </span>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {duration ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}h
          </span>
        ) : null}
        {departureTime ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {departureTime}
          </span>
        ) : null}
        {tripDays.length > 0 ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {tripDays.join(", ")}
          </span>
        ) : null}
      </div>
    );
  }

  const totalSlots = grouped.reduce((sum, day) => sum + day.slots.length, 0);
  const hoveredDay: GroupedScheduleDay | undefined = hoveredDate
    ? scheduleByDate.get(hoveredDate)
    : undefined;

  const popoverContent = (
    <div className="w-72">
      <p className="mb-2 text-[11px] text-gray-500">
        Hover a highlighted date to see time slots
      </p>

      <div className="rounded-lg border border-gray-100 p-1">
        <Calendar
          fullscreen={false}
          value={viewMonth}
          onPanelChange={(date) => setViewMonth(date)}
          fullCellRender={(date) => {
            const key = date.format("YYYY-MM-DD");
            const daySchedule = scheduleByDate.get(key);
            const hasSlots = !!daySchedule;
            const isHovered = hoveredDate === key;

            return (
              <div
                className={`mx-auto min-h-[40px] rounded px-0.5 py-1 text-center transition-colors ${
                  isHovered
                    ? "bg-orange-500 text-white ring-2 ring-orange-400 ring-inset"
                    : hasSlots
                      ? "bg-orange-100 font-semibold text-orange-700 cursor-pointer hover:bg-orange-200"
                      : ""
                }`}
                onMouseEnter={() => {
                  if (hasSlots) setHoveredDate(key);
                }}
                onMouseLeave={() => {
                  setHoveredDate((current) => (current === key ? null : current));
                }}
              >
                <div>{date.date()}</div>
                {daySchedule ? (
                  <div
                    className={`text-[9px] leading-tight ${
                      isHovered ? "text-orange-50" : "text-orange-600"
                    }`}
                  >
                    {daySchedule.slots.length} slot
                    {daySchedule.slots.length !== 1 ? "s" : ""}
                  </div>
                ) : null}
              </div>
            );
          }}
        />
      </div>

      <div className="mt-3 h-24 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
        {hoveredDay ? (
          <>
            <p className="text-xs font-semibold text-gray-800">
              {dayjs(hoveredDay.date).format("ddd, MMM D, YYYY")}
            </p>
            <div className="mt-1.5 space-y-1">
              {hoveredDay.slots.map((slot, index) => (
                <p
                  key={`${hoveredDay.date}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 border border-gray-200 mr-1.5 mb-1"
                >
                  <Clock className="h-3 w-3 text-orange-500" />
                  {slot.startTime} – {slot.endTime}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Move over a highlighted date to view its times
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      title="Available dates & times"
      trigger="click"
      placement="topLeft"
      overlayStyle={{ zIndex: 10050 }}
      autoAdjustOverflow={false}
      destroyOnHidden={false}
      onOpenChange={(open) => {
        if (!open) setHoveredDate(null);
      }}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        aria-label="View trip schedule"
      >
        <CalendarDays className="h-3.5 w-3.5" />
        {grouped.length} date{grouped.length !== 1 ? "s" : ""} · {totalSlots}{" "}
        slot{totalSlots !== 1 ? "s" : ""}
      </button>
    </Popover>
  );
}
