import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";

export const CONSENT_VERSION = "grant-mvp-2026-08";

const Body = z.object({
  acceptedPrivacy: z.boolean(),
  acceptedDisclaimer: z.boolean(),
  acceptedScreening: z.boolean(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const latest = await prisma.consentRecord.findFirst({
    where: { userId: session.sub },
    orderBy: { acceptedAt: "desc" },
  });

  return ok({ consentVersion: CONSENT_VERSION, latest });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  if (!parsed.data.acceptedPrivacy || !parsed.data.acceptedDisclaimer) {
    return fail("必须阅读并同意隐私政策与免责声明后继续使用");
  }

  const record = await prisma.consentRecord.create({
    data: {
      userId: session.sub,
      consentVersion: CONSENT_VERSION,
      acceptedPrivacy: parsed.data.acceptedPrivacy,
      acceptedDisclaimer: parsed.data.acceptedDisclaimer,
      acceptedScreening: parsed.data.acceptedScreening,
      userAgent: req.headers.get("user-agent"),
    },
  });

  return ok(record);
}
