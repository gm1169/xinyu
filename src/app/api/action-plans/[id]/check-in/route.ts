import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { toDateOnly } from "@/lib/date";

const Body = z.object({
  checkDate: z.string().optional(),
  done: z.boolean(),
  notes: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const plan = await prisma.actionPlan.findUnique({ where: { id: params.id } });
  if (!plan || plan.userId !== session.sub) return fail("不存在", 404);

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const date = toDateOnly(parsed.data.checkDate ?? new Date().toISOString());

  const ci = await prisma.actionCheckIn.upsert({
    where: { planId_checkDate: { planId: plan.id, checkDate: date } },
    update: { done: parsed.data.done, notes: parsed.data.notes },
    create: {
      planId: plan.id,
      checkDate: date,
      done: parsed.data.done,
      notes: parsed.data.notes,
    },
  });

  return ok(ci);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const plan = await prisma.actionPlan.findUnique({ where: { id: params.id } });
  if (!plan || plan.userId !== session.sub) return fail("不存在", 404);

  const checkIns = await prisma.actionCheckIn.findMany({
    where: { planId: plan.id },
    orderBy: { checkDate: "desc" },
    take: 60,
  });
  return ok(checkIns);
}
