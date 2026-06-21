import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";

const moduleLabels: Record<string, string> = {
  intro: "入门篇",
  advanced: "进阶篇",
  practice: "实战篇",
};

const moduleDescriptions: Record<string, string> = {
  intro: "建立对认知解离的基本认识",
  advanced: "深化练习，应用于复杂情境",
  practice: "在真实生活场景中实践",
};

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const units = await prisma.trainingUnit.findMany({
    orderBy: [{ module: "asc" }, { order: "asc" }],
  });
  const progress = await prisma.userTrainingProgress.findMany({
    where: { userId: session.sub },
  });
  const progressMap = new Map(progress.map((p) => [p.unitId, p.status]));

  const moduleOrder = ["intro", "advanced", "practice"];
  const grouped = new Map<
    string,
    { id: string; name: string; description: string; units: unknown[] }
  >();
  // 预置教学顺序，未填充的模块最后会被忽略
  for (const m of moduleOrder) {
    grouped.set(m, {
      id: m,
      name: moduleLabels[m] ?? m,
      description: moduleDescriptions[m] ?? "",
      units: [],
    });
  }
  for (const u of units) {
    if (!grouped.has(u.module)) {
      grouped.set(u.module, {
        id: u.module,
        name: moduleLabels[u.module] ?? u.module,
        description: moduleDescriptions[u.module] ?? "",
        units: [],
      });
    }
    grouped.get(u.module)!.units.push({
      id: u.id,
      order: u.order,
      title: u.title,
      description: u.description,
      durationMinutes: u.durationMinutes,
      status: progressMap.get(u.id) ?? "not_started",
    });
  }

  return ok(
    Array.from(grouped.values()).filter((m) => (m.units as unknown[]).length > 0),
  );
}
