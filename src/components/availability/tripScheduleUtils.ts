export interface TripScheduleRecord {
  id?: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
}

export interface GroupedScheduleDay {
  date: string;
  slots: { startTime: string; endTime: string }[];
}

/** Normalize API scheduleDate to YYYY-MM-DD (matches captain picker date) */
export function toScheduleDateKey(scheduleDate: string | Date): string {
  const iso =
    typeof scheduleDate === "string"
      ? scheduleDate
      : scheduleDate.toISOString();
  if (iso.length >= 10 && iso[4] === "-" && iso[7] === "-") {
    return iso.slice(0, 10);
  }
  const d = new Date(scheduleDate);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function groupSchedulesByDate(
  schedules: TripScheduleRecord[] = [],
): GroupedScheduleDay[] {
  const map = new Map<string, { startTime: string; endTime: string }[]>();

  for (const schedule of schedules) {
    const date = toScheduleDateKey(schedule.scheduleDate);
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    });
  }

  return Array.from(map.entries())
    .map(([date, slots]) => ({ date, slots }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
