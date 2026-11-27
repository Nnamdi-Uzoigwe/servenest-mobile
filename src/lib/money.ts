// The API stores money as whole kobo (100 kobo = 1 naira), so the maths is always exact
export function formatNaira(kobo: number): string {
  const naira = Math.floor(kobo / 100);
  const rest = kobo % 100;
  const grouped = String(naira).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest === 0
    ? `₦${grouped}`
    : `₦${grouped}.${String(rest).padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
