import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const items = await prisma.userAphorism.findMany({
    where: { userId: session.sub, isFavorite: true },
    include: { aphorism: true },
    orderBy: { updatedAt: "desc" },
  });

  return ok(
    items.map((x) => ({
      id: x.aphorism.id,
      content: x.aphorism.content,
      source: x.aphorism.source,
      tags: JSON.parse(x.aphorism.tags),
      reflection: x.reflection,
    })),
  );
}
