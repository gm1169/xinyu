import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";

const CATEGORIES = ["classical", "poetry", "modern"];

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const q = (url.searchParams.get("q") ?? "").trim();
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100"), 200);

  const items = await prisma.aphorism.findMany({
    where: {
      ...(category && CATEGORIES.includes(category) ? { category } : {}),
      ...(q
        ? {
            OR: [
              { content: { contains: q } },
              { source: { contains: q } },
              { interpretation: { contains: q } },
              { tags: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { id: "asc" },
    take: limit,
  });

  // user-aphorism overlay
  const userMap = new Map<string, { isFavorite: boolean }>(
    (
      await prisma.userAphorism.findMany({
        where: { userId: session.sub, aphorismId: { in: items.map((i) => i.id) } },
      })
    ).map((u) => [u.aphorismId, { isFavorite: u.isFavorite }]),
  );

  let result = items.map((a) => ({
    id: a.id,
    content: a.content,
    source: a.source,
    category: a.category,
    tags: JSON.parse(a.tags) as string[],
    isFavorite: userMap.get(a.id)?.isFavorite ?? false,
  }));

  if (tag) {
    result = result.filter((r) => r.tags.includes(tag));
  }

  // Aggregate available tags for filter UI
  const allTags = new Set<string>();
  for (const i of items) for (const t of JSON.parse(i.tags) as string[]) allTags.add(t);

  return ok({ items: result, total: result.length, tags: Array.from(allTags) });
}
