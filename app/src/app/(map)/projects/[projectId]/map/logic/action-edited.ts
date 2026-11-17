/*
 * Age of an action, shown at the top right of the row.
 * Today is 0d. Then days, weeks, and years.
 */

// "0d" today, "3d" this week, "4w" after that, "1y" after a year.
export function editedLabel(editedAt: Date, now: Date) {
  const day = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.max(0, Math.round((day(now) - day(editedAt)) / 86_400_000));
  if (days < 7) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 365)}y`;
}
