import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";
import { toDateOnly } from "@/lib/date";

const Body = z.object({
  recordDate: z.string(),
  bedtime: z.string().regex(/^\d{2}:\d{2}$/),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/),
  sleepQuality: z.number().int().min(1).max(10),
  wakeUps: z.number().int().min(0).max(20).default(0),
  notes: z.string().max(500).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const records = await prisma.sleepRecord.findMany({
    where: { userId: session.sub },
    orderBy: { recordDate: "desc" },
    take: 30,
  });
  return ok(records);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const d = toDateOnly(parsed.data.recordDate);
  const record = await prisma.sleepRecord.upsert({
    where: {
      userId_recordDate: { userId: session.sub, recordDate: d },
    },
    update: {
      bedtime: parsed.data.bedtime,
      wakeTime: parsed.data.wakeTime,
      sleepQuality: parsed.data.sleepQuality,
      wakeUps: parsed.data.wakeUps,
      notes: parsed.data.notes,
    },
    create: {
      userId: session.sub,
      recordDate: d,
      bedtime: parsed.data.bedtime,
      wakeTime: parsed.data.wakeTime,
      sleepQuality: parsed.data.sleepQuality,
      wakeUps: parsed.data.wakeUps,
      notes: parsed.data.notes,
    },
  });

  await checkAndAwardBadges(session.sub);
  return ok(record);
}
