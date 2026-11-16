// Registry phone booking: Mon–Fri 13:00–16:00 (Europe/Kyiv). day: 0 = Sunday … 6 = Saturday; minutes since midnight.
export function registryStatus(day: number, minutes: number): { text: string; open: boolean } {
  const from = 13 * 60;
  const to = 16 * 60;
  const workday = day >= 1 && day <= 5;
  if (workday && minutes >= from && minutes < to) return { text: "Зараз приймає дзвінки — до 16:00", open: true };
  if (workday && minutes < from) return { text: "Дзвінки сьогодні з 13:00 до 16:00", open: false };
  if (day >= 1 && day <= 4) return { text: "Дзвінки завтра з 13:00 до 16:00", open: false };
  return { text: "Дзвінки в понеділок з 13:00 до 16:00", open: false };
}
