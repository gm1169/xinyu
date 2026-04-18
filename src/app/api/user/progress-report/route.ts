import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";
import { subDays, startOfDay, differenceInDays } from "date-fns";

type Period = "weekly" | "monthly";

function avg(nums: number[]) {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const url = new URL(req.url);
  const period: Period = url.searchParams.get("period") === "monthly" ? "monthly" : "weekly";
  const span = period === "monthly" ? 30 : 7;

  const userId = session.sub;
  const start = startOfDay(subDays(new Date(), span - 1));
  const prevStart = startOfDay(subDays(start, span));

  const [emotions, prevEmotions, sleep, training, readAphs] = await Promise.all([
    prisma.emotionRecord.findMany({
      where: { userId, recordDate: { gte: start } },
      orderBy: { recordDate: "asc" },
    }),
    prisma.emotionRecord.findMany({
      where: { userId, recordDate: { gte: prevStart, lt: start } },
    }),
    prisma.sleepRecord.findMany({
      where: { userId, recordDate: { gte: start } },
    }),
    prisma.userTrainingProgress.findMany({
      where: {
        userId,
        status: "completed",
        completedAt: { gte: start },
      },
      include: { unit: true },
    }),
    prisma.userAphorism.count({
      where: { userId, readAt: { gte: start } },
    }),
  ]);

  const avgEmotion = round1(avg(emotions.map((e) => e.emotionScore)));
  const prevAvgEmotion = round1(avg(prevEmotions.map((e) => e.emotionScore)));
  const avgAnxiety = round1(avg(emotions.map((e) => e.anxietyScore)));
  const avgDepression = round1(avg(emotions.map((e) => e.depressionScore)));
  const avgSleep = round1(avg(sleep.map((s) => s.sleepQuality)));

  const emotionDelta = prevAvgEmotion
    ? round1(((avgEmotion - prevAvgEmotion) / prevAvgEmotion) * 100)
    : 0;

  const highlights: string[] = [];
  if (training.length > 0)
    highlights.push(`完成了 ${training.length} 个训练单元`);
  if (readAphs > 0) highlights.push(`阅读了 ${readAphs} 条格言`);
  if (emotionDelta > 5)
    highlights.push(`情绪评分提升 ${emotionDelta}%`);
  if (sleep.length >= 5)
    highlights.push(`坚持记录了 ${sleep.length} 天睡眠`);

  const improvements: string[] = [];
  if (avgAnxiety >= 6) improvements.push("焦虑偏高，需要关注");
  if (avgDepression >= 6) improvements.push("抑郁偏高，建议增加心理练习");
  if (avgSleep > 0 && avgSleep < 5) improvements.push("睡眠质量偏低");
  if (emotions.length < Math.floor(span / 2))
    improvements.push("情绪记录不够连续");

  const suggestions: string[] = [];
  if (avgSleep > 0 && avgSleep < 6)
    suggestions.push("尝试「睡眠智慧课堂 · 放松训练」中的 4-7-8 呼吸法");
  if (avgAnxiety >= 6)
    suggestions.push("重温格言「所有的焦虑，都来自对无法控制的事的执着」");
  if (training.length === 0)
    suggestions.push("本期还没有新训练完成，先从入门篇第 1 单元开始");
  if (highlights.length === 0 && improvements.length === 0)
    suggestions.push("从记录今日情绪开始，让改变可被看见");

  return ok({
    period,
    startDate: start.toISOString(),
    endDate: new Date().toISOString(),
    summary: {
      highlights,
      improvements,
      suggestions,
    },
    emotion: {
      avgEmotion,
      avgAnxiety,
      avgDepression,
      prevAvgEmotion,
      emotionDelta,
      count: emotions.length,
    },
    sleep: {
      avgQuality: avgSleep,
      count: sleep.length,
    },
    training: {
      completedThisPeriod: training.length,
      titles: training.map((t) => t.unit.title),
    },
    aphorism: {
      readCount: readAphs,
    },
  });
}
