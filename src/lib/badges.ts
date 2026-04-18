import { prisma } from "./prisma";

// 轻量级徽章检查：在关键事件后调用，授予当前应得的徽章
export async function checkAndAwardBadges(userId: string) {
  const [
    readCount,
    reflectionCount,
    completedUnits,
    introUnits,
    valueDomains,
    actionStarted,
    sleepRecords,
  ] = await Promise.all([
    prisma.userAphorism.count({ where: { userId, readAt: { not: null } } }),
    prisma.userAphorism.count({
      where: { userId, reflection: { not: null } },
    }),
    prisma.userTrainingProgress.count({
      where: { userId, status: "completed" },
    }),
    prisma.userTrainingProgress.findMany({
      where: { userId, status: "completed" },
      include: { unit: true },
    }),
    prisma.valueExploration.findMany({
      where: { userId },
      select: { domain: true },
      distinct: ["domain"],
    }),
    prisma.actionPlan.count({ where: { userId } }),
    prisma.sleepRecord.count({ where: { userId } }),
  ]);

  const introCompletedCount = introUnits.filter(
    (p) => p.unit.module === "intro",
  ).length;

  const targets: string[] = [];
  if (readCount >= 1) targets.push("first_step");
  if (readCount >= 30) targets.push("aphorism_reader");
  if (reflectionCount >= 10) targets.push("reflector");
  if (completedUnits >= 1) targets.push("defusion_novice");
  if (introCompletedCount >= 6) targets.push("defusion_adept");
  if (valueDomains.length >= 3) targets.push("value_seeker");
  if (actionStarted >= 1) targets.push("action_taker");
  if (sleepRecords >= 7) targets.push("sleep_keeper");

  if (targets.length === 0) return [] as string[];

  const badges = await prisma.badge.findMany({
    where: { code: { in: targets } },
  });
  const newlyEarned: string[] = [];
  for (const b of badges) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: b.id } },
    });
    if (!existing) {
      await prisma.userBadge.create({
        data: { userId, badgeId: b.id },
      });
      newlyEarned.push(b.code);
    }
  }
  return newlyEarned;
}
