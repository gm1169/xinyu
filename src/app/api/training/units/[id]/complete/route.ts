import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";

const Body = z.object({
  score: z.number().int().min(0).max(100).optional(),
  answers: z.record(z.string(), z.any()).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const unit = await prisma.trainingUnit.findUnique({
    where: { id: params.id },
  });
  if (!unit) return fail("训练单元不存在", 404);

  const progress = await prisma.userTrainingProgress.upsert({
    where: {
      userId_unitId: { userId: session.sub, unitId: unit.id },
    },
    update: {
      status: "completed",
      completedAt: new Date(),
      score: parsed.data.score ?? null,
      answers: parsed.data.answers ? JSON.stringify(parsed.data.answers) : null,
      notes: parsed.data.notes ?? null,
    },
    create: {
      userId: session.sub,
      unitId: unit.id,
      status: "completed",
      startedAt: new Date(),
      completedAt: new Date(),
      score: parsed.data.score ?? null,
      answers: parsed.data.answers ? JSON.stringify(parsed.data.answers) : null,
      notes: parsed.data.notes ?? null,
    },
  });

  const earnedBadges = await checkAndAwardBadges(session.sub);

  const next = await prisma.trainingUnit.findFirst({
    where: { module: unit.module, order: { gt: unit.order } },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return ok({
    status: progress.status,
    score: progress.score,
    nextUnit: next,
    earnedBadges,
  });
}
