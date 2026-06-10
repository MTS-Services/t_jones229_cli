"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import dayjs from "dayjs";
import { CalendarDays, Clock, X } from "lucide-react";
import {
  groupSchedulesByDate,
  GroupedScheduleDay,
  TripScheduleRecord,
  getOverlappingSlotIndices,
  dayHasOverlappingSlots,
} from "./tripScheduleUtils";

interface TripScheduleHoverViewProps {
  schedules?: TripScheduleRecord[];
  duration?: number;
  tripDays?: string[];
  departureTime?: string;
}

function groupByMonth(days: GroupedScheduleDay[]) {
  const map = new Map<string, GroupedScheduleDay[]>();
  for (const day of days) {
    const key = dayjs(day.date).format("YYYY-MM");
    const bucket = map.get(key) ?? [];
    bucket.push(day);
    map.set(key, bucket);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function slotHours(startTime: string, endTime: string): string {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return "";
  const h = mins / 60;
  return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`;
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
  const months = useMemo(() => groupByMonth(grouped), [grouped]);
  const [open, setOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
  const firstDate = dayjs(grouped[0].date).format("MMM D");
  const lastDate = dayjs(grouped[grouped.length - 1].date).format("MMM D, YYYY");

  const visibleDays =
    monthFilter === "all"
      ? grouped
      : grouped.filter((d) => dayjs(d.date).format("YYYY-MM") === monthFilter);

  const modal = open ? (
    <div
      className="fixed inset-0 z-[10060] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-schedule-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close schedule"
        onClick={() => setOpen(false)}
      />

      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-blue-50 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <div className="rounded-lg bg-white p-1.5 shadow-sm">
                <CalendarDays className="h-4 w-4 text-orange-500" />
              </div>
              <h3
                id="trip-schedule-title"
                className="text-base font-bold text-gray-900 sm:text-lg"
              >
                Trip schedule
              </h3>
            </div>
            <p className="text-xs text-gray-600 sm:text-sm">
              {grouped.length} date{grouped.length !== 1 ? "s" : ""} ·{" "}
              {totalSlots} time slot{totalSlots !== 1 ? "s" : ""} · {firstDate}
              – {lastDate}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/80 hover:text-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {months.length > 1 && (
          <div className="shrink-0 border-b border-gray-100 px-4 py-3 sm:px-5">
            <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setMonthFilter("all")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  monthFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All dates
              </button>
              {months.map(([key, days]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMonthFilter(key)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    monthFilter === key
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {dayjs(`${key}-01`).format("MMM YYYY")} ({days.length})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          <div className="space-y-3">
            {visibleDays.map((day) => (
              <article
                key={day.date}
                className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
              >
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {dayjs(day.date).format("dddd, MMM D, YYYY")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {day.slots.length} time slot
                      {day.slots.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                    {dayjs(day.date).format("ddd")}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {day.slots.map((slot, index) => {
                    const hours = slotHours(slot.startTime, slot.endTime);
                    const overlapping = getOverlappingSlotIndices(day.slots);
                    const isOverlapping = overlapping.has(index);

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 ${
                          isOverlapping
                            ? "border-red-300 bg-red-50"
                            : "border-orange-100 bg-orange-50/60"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                          <Clock
                            className={`h-4 w-4 ${
                              isOverlapping ? "text-red-500" : "text-orange-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">
                            {slot.startTime} – {slot.endTime}
                          </p>
                          {isOverlapping ? (
                            <p className="text-[11px] font-medium text-red-600">
                              Overlaps another slot
                            </p>
                          ) : hours ? (
                            <p className="text-[11px] text-gray-500">
                              {hours} trip
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {dayHasOverlappingSlots(day.slots) && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    This day has overlapping times — edit the trip schedule to
                    fix it.
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex max-w-full items-center gap-2 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 text-left text-xs font-medium text-blue-800 transition-all hover:border-blue-300 hover:shadow-sm sm:text-sm"
        aria-label="View full trip schedule"
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
        <span className="min-w-0">
          <span className="block font-semibold">
            {grouped.length} date{grouped.length !== 1 ? "s" : ""} · {totalSlots}{" "}
            slot{totalSlots !== 1 ? "s" : ""}
          </span>
          <span className="block truncate text-[11px] font-normal text-blue-600/80 sm:text-xs">
            Tap to view all times
          </span>
        </span>
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
