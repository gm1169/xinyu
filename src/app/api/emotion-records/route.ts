import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { toDateOnly } from "@/lib/date";

const Body = z.object({
  recordDate: z.string(),
  emotionScore: z.number().int().min(1).max(10),
  anxietyScore: z.number().int().min(1).max(10),
  depressionScore: z.number().int().min(1).max(10),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const d = toDateOnly(parsed.data.recordDate);
  const record = await prisma.emotionRecord.upsert({
    where: {
      userId_recordDate: { userId: session.sub, recordDate: d },
    },
    update: {
      emotionScore: parsed.data.emotionScore,
      anxietyScore: parsed.data.anxietyScore,
      depressionScore: parsed.data.depressionScore,
      notes: parsed.data.notes,
    },
    create: {
      userId: session.sub,
      recordDate: d,
      emotionScore: parsed.data.emotionScore,
      anxietyScore: parsed.data.anxietyScore,
      depressionScore: parsed.data.depressionScore,
      notes: parsed.data.notes,
    },
  });

  return ok(record);
}
