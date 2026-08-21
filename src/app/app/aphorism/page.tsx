import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dayBucket } from "@/lib/date";
import { AphorismView } from "@/components/aphorism/AphorismView";
import { Heart } from "lucide-react";

export default async function AphorismPage() {
  const session = (await getSession())!;
  const total = await prisma.aphorism.count();
  const aphorisms = total
    ? await prisma.aphorism.findMany({
        orderBy: { id: "asc" },
        skip: dayBucket(new Date(), total),
        take: 1,
      })
    : [];
  const aphorism = aphorisms[0];
  if (!aphorism) return <div className="p-6">暂无格言式微干预内容</div>;

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

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs text-ink-light">今日格言式微干预</div>
          <div className="font-song text-xl text-ink">心语每日练习</div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/aphorism/random"
            className="text-ink-light hover:text-bamboo text-sm"
          >
            抽一句
          </Link>
          <Link
            href="/app/aphorism/library"
            className="text-ink-light hover:text-bamboo text-sm"
          >
            书架
          </Link>
          <Link
            href="/app/aphorism/favorites"
            className="text-ink-light hover:text-cinnabar flex items-center gap-1.5 text-sm"
          >
            <Heart size={16} />
            收藏
          </Link>
        </div>
      </div>

      <AphorismView
        aphorism={{
          id: aphorism.id,
          content: aphorism.content,
          source: aphorism.source,
          annotations: JSON.parse(aphorism.annotations),
          interpretation: aphorism.interpretation,
          psychologyAnalysis: aphorism.psychologyAnalysis,
          applicationScenarios: JSON.parse(aphorism.applicationScenarios),
          tags: JSON.parse(aphorism.tags),
        }}
        initialFavorite={ua.isFavorite}
        initialReflection={ua.reflection ?? ""}
      />
    </div>
  );
}
