export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

// 5:00 AM to 10:00 PM in half hour steps
export const TIME_OPTIONS = Array.from({ length: 35 }, (_, i) => {
  const minutes = 5 * 60 + i * 30;
  const value = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  return { value, label: formatTime(value) };
});
