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

export interface ScheduleSlot {
  startTime: string;
  endTime: string;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** True when two slots share any time (touching endpoints like 11:00–12:00 are allowed). */
export function timeSlotsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const a1 = parseTimeToMinutes(start1);
  const a2 = parseTimeToMinutes(end1);
  const b1 = parseTimeToMinutes(start2);
  const b2 = parseTimeToMinutes(end2);
  if (a1 >= a2 || b1 >= b2) return false;
  return a1 < b2 && b1 < a2;
}

/** Slot indices on a day that participate in at least one overlap. */
export function getOverlappingSlotIndices(slots: ScheduleSlot[]): Set<number> {
  const overlapping = new Set<number>();
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (timeSlotsOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
        overlapping.add(i);
        overlapping.add(j);
      }
    }
  }
  return overlapping;
}

export function dayHasOverlappingSlots(slots: ScheduleSlot[]): boolean {
  return getOverlappingSlotIndices(slots).size > 0;
}

export function schedulesHaveOverlaps(
  schedules: GroupedScheduleDay[],
): boolean {
  return schedules.some((day) => dayHasOverlappingSlots(day.slots));
}

export function formatOverlapMessage(date: string, slots: ScheduleSlot[]): string {
  const indices = getOverlappingSlotIndices(slots);
  const labels = [...indices]
    .sort((a, b) => a - b)
    .map((i) => `${slots[i].startTime}–${slots[i].endTime}`);
  return `Overlapping times on ${date}: ${labels.join(", ")}`;
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
