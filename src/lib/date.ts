import { startOfDay, formatISO } from "date-fns";

export function today(): Date {
  return startOfDay(new Date());
}

export function toDateOnly(d: Date | string): Date {
  return startOfDay(typeof d === "string" ? new Date(d) : d);
}

export function isoDateOnly(d: Date = new Date()): string {
  return formatISO(startOfDay(d), { representation: "date" });
}

// 把一个日期的「天」转为 0..N 的桶索引 — 用于每日格言轮换
export function dayBucket(date = new Date(), mod: number): number {
  const epochDay = Math.floor(startOfDay(date).getTime() / (1000 * 60 * 60 * 24));
  return ((epochDay % mod) + mod) % mod;
}
