import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");

  const total = await prisma.aphorism.count();
  if (total === 0) return ok(null);

  // 简单的随机：拉取一定数量后随机选一条；可选按 tag 过滤
  const candidates = await prisma.aphorism.findMany({
    take: total > 200 ? 200 : total,
    orderBy: { id: "asc" },
  });
  const filtered = tag
    ? candidates.filter((a) =>
        (JSON.parse(a.tags) as string[]).includes(tag),
      )
    : candidates;
  if (filtered.length === 0) return ok(null);

  const a = filtered[Math.floor(Math.random() * filtered.length)];

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
  });
}
