import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  const items = await prisma.actionPlan.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { value: true },
  });
  return ok(
    items.map((p) => ({
      ...p,
      steps: JSON.parse(p.steps),
      obstacles: JSON.parse(p.obstacles),
      copingStrategies: JSON.parse(p.copingStrategies),
    })),
  );
}

const Body = z.object({
  valueId: z.string().optional().nullable(),
  targetBehavior: z.string().min(1).max(200),
  triggerContext: z.string().min(1).max(200),
  steps: z.array(z.string().min(1)).min(1).max(10),
  obstacles: z.array(z.string()).max(10).optional(),
  copingStrategies: z.array(z.string()).max(10).optional(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();
  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const plan = await prisma.actionPlan.create({
    data: {
      userId: session.sub,
      valueId: parsed.data.valueId || null,
      targetBehavior: parsed.data.targetBehavior,
      triggerContext: parsed.data.triggerContext,
      steps: JSON.stringify(parsed.data.steps),
      obstacles: JSON.stringify(parsed.data.obstacles ?? []),
      copingStrategies: JSON.stringify(parsed.data.copingStrategies ?? []),
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });

  await checkAndAwardBadges(session.sub);
  return ok(plan);
}
