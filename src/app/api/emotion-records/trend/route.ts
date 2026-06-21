import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";
import { subDays, startOfDay } from "date-fns";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const since = startOfDay(subDays(new Date(), 29));
  const records = await prisma.emotionRecord.findMany({
    where: { userId: session.sub, recordDate: { gte: since } },
    orderBy: { recordDate: "asc" },
  });

  let trend: "improving" | "stable" | "declining" = "stable";
  if (records.length >= 4) {
    const mid = Math.floor(records.length / 2);
    const early =
      records.slice(0, mid).reduce((s, r) => s + r.emotionScore, 0) / mid;
    const late =
      records.slice(mid).reduce((s, r) => s + r.emotionScore, 0) /
      (records.length - mid);
    if (late - early > 0.5) trend = "improving";
    else if (early - late > 0.5) trend = "declining";
  }

  const avg = (key: "emotionScore" | "anxietyScore" | "depressionScore") =>
    records.length
      ? Math.round(
          (records.reduce((s, r) => s + r[key], 0) / records.length) * 10,
        ) / 10
      : 0;

  return ok({
    records,
    summary: {
      count: records.length,
      avgEmotion: avg("emotionScore"),
      avgAnxiety: avg("anxietyScore"),
      avgDepression: avg("depressionScore"),
      trend,
    },
  });
}
