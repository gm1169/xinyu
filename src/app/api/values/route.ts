import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const items = await prisma.valueExploration.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { actionPlans: { select: { id: true, status: true } } },
  });
  return ok(items);
}

const Body = z.object({
  domain: z.string().min(1).max(40),
  valueStatement: z.string().min(1).max(400),
  importance: z.number().int().min(1).max(10),
  confidence: z.number().int().min(1).max(10),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();
  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const value = await prisma.valueExploration.create({
    data: { ...parsed.data, userId: session.sub },
  });

  await checkAndAwardBadges(session.sub);
  return ok(value);
}
