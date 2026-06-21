import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, fail } from "@/lib/api";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const aphorism = await prisma.aphorism.findUnique({
    where: { id: params.id },
  });
  if (!aphorism) return fail("格言不存在", 404);

  const existing = await prisma.userAphorism.findUnique({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: params.id },
    },
  });

  const isFavorite = !(existing?.isFavorite ?? false);
  await prisma.userAphorism.upsert({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: params.id },
    },
    update: { isFavorite },
    create: {
      userId: session.sub,
      aphorismId: params.id,
      isFavorite,
      readAt: new Date(),
    },
  });

  return ok({ isFavorite });
}
