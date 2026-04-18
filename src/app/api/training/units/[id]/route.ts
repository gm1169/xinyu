import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const unit = await prisma.trainingUnit.findUnique({
    where: { id: params.id },
  });
  if (!unit) return fail("训练单元不存在", 404);

  const [prev, next] = await Promise.all([
    prisma.trainingUnit.findFirst({
      where: { module: unit.module, order: { lt: unit.order } },
      orderBy: { order: "desc" },
      select: { id: true, title: true },
    }),
    prisma.trainingUnit.findFirst({
      where: { module: unit.module, order: { gt: unit.order } },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  const progress = await prisma.userTrainingProgress.findUnique({
    where: {
      userId_unitId: { userId: session.sub, unitId: unit.id },
    },
  });

  return ok({
    id: unit.id,
    module: unit.module,
    order: unit.order,
    title: unit.title,
    description: unit.description,
    theoryContent: JSON.parse(unit.theoryContent),
    exercises: JSON.parse(unit.exercises),
    caseStudy: JSON.parse(unit.caseStudy),
    durationMinutes: unit.durationMinutes,
    progress: progress
      ? { status: progress.status, score: progress.score, notes: progress.notes }
      : { status: "not_started" },
    previousUnit: prev,
    nextUnit: next,
  });
}
