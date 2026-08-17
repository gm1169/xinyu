import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { triageCrisis } from "@/lib/crisis";

const Body = z.object({
  triggerSource: z.enum(["assistant", "screening", "manual"]),
  triggerText: z.string().max(4000).optional(),
  referralStatus: z.enum(["pending", "acknowledged", "referred", "resolved"]).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const events = await prisma.crisisEvent.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return ok(events);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const triage = triageCrisis(parsed.data.triggerText ?? "");
  const event = await prisma.crisisEvent.create({
    data: {
      userId: session.sub,
      triggerSource: parsed.data.triggerSource,
      triggerText: parsed.data.triggerText,
      matchedTerms: JSON.stringify(triage.matchedTerms),
      riskLevel: triage.level,
      recommendedAction: triage.recommendedAction,
      referralStatus: parsed.data.referralStatus ?? "pending",
    },
  });

  return ok({ event, triage });
}
