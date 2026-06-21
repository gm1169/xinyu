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

  const a = await prisma.aphorism.findUnique({ where: { id: params.id } });
  if (!a) return fail("格言不存在", 404);

  const ua = await prisma.userAphorism.findUnique({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: a.id },
    },
  });

  return ok({
    id: a.id,
    content: a.content,
    source: a.source,
    category: a.category,
    annotations: JSON.parse(a.annotations),
    interpretation: a.interpretation,
    psychologyAnalysis: a.psychologyAnalysis,
    applicationScenarios: JSON.parse(a.applicationScenarios),
    tags: JSON.parse(a.tags),
    isFavorite: ua?.isFavorite ?? false,
    reflection: ua?.reflection ?? "",
  });
}
