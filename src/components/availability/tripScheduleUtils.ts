import dayjs from "dayjs";

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

export function groupSchedulesByDate(
  schedules: TripScheduleRecord[] = [],
): GroupedScheduleDay[] {
  const map = new Map<string, { startTime: string; endTime: string }[]>();

  for (const schedule of schedules) {
    const date = dayjs(schedule.scheduleDate).format("YYYY-MM-DD");
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
