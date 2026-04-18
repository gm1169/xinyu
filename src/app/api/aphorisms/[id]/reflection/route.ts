import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, fail, safeJson } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";

const Body = z.object({ reflection: z.string().min(1).max(2000) });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("内容不能为空");

  const ua = await prisma.userAphorism.upsert({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: params.id },
    },
    update: { reflection: parsed.data.reflection },
    create: {
      userId: session.sub,
      aphorismId: params.id,
      reflection: parsed.data.reflection,
      readAt: new Date(),
    },
  });

  await checkAndAwardBadges(session.sub);
  return ok({ reflection: ua.reflection, updatedAt: ua.updatedAt });
}
