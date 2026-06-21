import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dayBucket } from "@/lib/date";
import { ok, unauthorized } from "@/lib/api";
import { checkAndAwardBadges } from "@/lib/badges";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const total = await prisma.aphorism.count();
  if (total === 0) return ok(null);

  const [aphorism] = await prisma.aphorism.findMany({
    orderBy: { id: "asc" },
    skip: dayBucket(new Date(), total),
    take: 1,
  });

  // Upsert user-aphorism (mark as read)
  const ua = await prisma.userAphorism.upsert({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: aphorism.id },
    },
    update: { readAt: new Date() },
    create: {
      userId: session.sub,
      aphorismId: aphorism.id,
      readAt: new Date(),
    },
  });

  await checkAndAwardBadges(session.sub);

  return ok({
    ...aphorism,
    annotations: JSON.parse(aphorism.annotations),
    applicationScenarios: JSON.parse(aphorism.applicationScenarios),
    tags: JSON.parse(aphorism.tags),
    isFavorite: ua.isFavorite,
    reflection: ua.reflection,
  });
}
