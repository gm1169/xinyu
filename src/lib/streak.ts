// 连续使用天数计算
// 任意一项「活动」（格言式微干预 / 完成训练 / 记录情绪 / 记录睡眠）即视为该日活跃

import { prisma } from "./prisma";
import { startOfDay, differenceInCalendarDays, subDays } from "date-fns";

export type StreakResult = {
  current: number; // 当前连续天数（含今日，否则从昨日往前算）
  longest: number; // 历史最长连续天数
  activeDates: string[]; // 'YYYY-MM-DD'
};

function dayKey(d: Date): string {
  const day = startOfDay(d);
  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, "0");
  const dd = String(day.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export async function computeStreak(userId: string): Promise<StreakResult> {
  const since = subDays(new Date(), 365); // 一年窗口足够 MVP

  const [reads, training, emotion, sleep] = await Promise.all([
    prisma.userAphorism.findMany({
      where: { userId, readAt: { gte: since, not: null } },
      select: { readAt: true },
    }),
    prisma.userTrainingProgress.findMany({
      where: {
        userId,
        completedAt: { gte: since, not: null },
        status: "completed",
      },
      select: { completedAt: true },
    }),
    prisma.emotionRecord.findMany({
      where: { userId, recordDate: { gte: since } },
      select: { recordDate: true },
    }),
    prisma.sleepRecord.findMany({
      where: { userId, recordDate: { gte: since } },
      select: { recordDate: true },
    }),
  ]);

  const set = new Set<string>();
  for (const r of reads) if (r.readAt) set.add(dayKey(r.readAt));
  for (const t of training) if (t.completedAt) set.add(dayKey(t.completedAt));
  for (const e of emotion) set.add(dayKey(e.recordDate));
  for (const s of sleep) set.add(dayKey(s.recordDate));

  const activeDates = Array.from(set).sort();
  if (activeDates.length === 0) {
    return { current: 0, longest: 0, activeDates };
  }

  // longest streak
  let longest = 1;
  let run = 1;
  for (let i = 1; i < activeDates.length; i++) {
    const prev = new Date(activeDates[i - 1]);
    const curr = new Date(activeDates[i]);
    if (differenceInCalendarDays(curr, prev) === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  // current streak: 从今天或昨天起，连续向前
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const setHas = (d: Date) => set.has(dayKey(d));
  let current = 0;
  let cursor = setHas(today) ? today : setHas(yesterday) ? yesterday : null;
  while (cursor && setHas(cursor)) {
    current++;
    cursor = subDays(cursor, 1);
  }

  return { current, longest, activeDates };
}
