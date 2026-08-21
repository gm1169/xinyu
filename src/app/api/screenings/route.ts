import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { SCALE_DEFINITIONS, scoreScale, type ScaleCode } from "@/lib/screening";

const Body = z.object({
  scale: z.enum(["PHQ9", "GAD7", "ISI"]),
  answers: z.array(z.number().int()).min(1).max(12),
});

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const results = await prisma.screeningResult.findMany({
    where: { userId: session.sub },
    orderBy: { completedAt: "desc" },
    take: 20,
  });

  return ok({ definitions: SCALE_DEFINITIONS, results });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  try {
    const scored = scoreScale(parsed.data.scale as ScaleCode, parsed.data.answers);
    const result = await prisma.screeningResult.create({
      data: {
        userId: session.sub,
        scale: parsed.data.scale,
        rawAnswers: JSON.stringify(parsed.data.answers),
        totalScore: scored.totalScore,
        severity: scored.severity,
        riskFlag: scored.riskFlag,
      },
    });

    if (scored.riskFlag) {
      await prisma.crisisEvent.create({
        data: {
          userId: session.sub,
          triggerSource: "screening",
          triggerText: "PHQ-9 item 9 endorsed",
          matchedTerms: JSON.stringify(["PHQ9_item_9"]),
          riskLevel: "urgent",
          recommendedAction: "PHQ-9 第9题提示自伤/死亡相关想法，需要人工复核并按机构流程转介。",
        },
      });
    }

    return ok({ result });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "量表评分失败");
  }
}
