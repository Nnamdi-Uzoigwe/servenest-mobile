import type { Weekday } from "@/types/api";

export const WEEKDAYS: { value: Weekday; short: string; long: string }[] = [
  { value: "monday", short: "Mon", long: "Monday" },
  { value: "tuesday", short: "Tue", long: "Tuesday" },
  { value: "wednesday", short: "Wed", long: "Wednesday" },
  { value: "thursday", short: "Thu", long: "Thursday" },
  { value: "friday", short: "Fri", long: "Friday" },
  { value: "saturday", short: "Sat", long: "Saturday" },
  { value: "sunday", short: "Sun", long: "Sunday" },
];

export const WORK_WEEK: Weekday[] = WEEKDAYS.slice(0, 5).map((d) => d.value);
export const EVERY_DAY: Weekday[] = WEEKDAYS.map((d) => d.value);

export function summarizeDays(days: Weekday[]): string {
  const sorted = WEEKDAYS.filter((d) => days.includes(d.value));
  if (sorted.length === 7) return "Every day";
  if (sorted.length === 5 && WORK_WEEK.every((d) => days.includes(d)))
    return "Monday to Friday";
  return sorted.map((d) => d.short).join(", ");
}
