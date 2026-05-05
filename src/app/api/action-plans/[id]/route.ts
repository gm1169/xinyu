import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const plan = await prisma.actionPlan.findUnique({
    where: { id: params.id },
    include: {
      value: true,
      checkIns: { orderBy: { checkDate: "desc" }, take: 60 },
    },
  });
  if (!plan || plan.userId !== session.sub) return fail("不存在", 404);

  return ok({
    ...plan,
    steps: JSON.parse(plan.steps),
    obstacles: JSON.parse(plan.obstacles),
    copingStrategies: JSON.parse(plan.copingStrategies),
  });
}

const PatchBody = z.object({
  status: z.enum(["active", "completed", "abandoned"]).optional(),
  reflection: z.string().max(2000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const plan = await prisma.actionPlan.findUnique({ where: { id: params.id } });
  if (!plan || plan.userId !== session.sub) return fail("不存在", 404);

  const parsed = PatchBody.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const updated = await prisma.actionPlan.update({
    where: { id: plan.id },
    data: parsed.data,
  });
  return ok(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const plan = await prisma.actionPlan.findUnique({ where: { id: params.id } });
  if (!plan || plan.userId !== session.sub) return fail("不存在", 404);

  await prisma.actionPlan.delete({ where: { id: plan.id } });
  return ok({ deleted: true });
}
