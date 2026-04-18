import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft } from "lucide-react";

export default async function FavoritesPage() {
  const session = (await getSession())!;
  const favorites = await prisma.userAphorism.findMany({
    where: { userId: session.sub, isFavorite: true },
    include: { aphorism: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/aphorism"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <h1 className="font-song text-2xl text-ink mb-5">收藏的格言</h1>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-3xl mb-3">📚</div>
          <div className="text-ink-light text-sm">
            还没有收藏的格言
            <br />
            遇到心动的那句，点一下「收藏」吧
          </div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {favorites.map((f) => (
            <li key={f.id}>
              <Card>
                <p className="aphorism-text text-xl text-ink leading-relaxed">
                  {f.aphorism.content}
                </p>
                <div className="text-xs text-ink-light mt-2">
                  — {f.aphorism.source}
                </div>
                {f.reflection && (
                  <div className="mt-3 pt-3 border-t border-ink/[0.06] text-sm text-ink-light">
                    <span className="text-bamboo">我的感悟 · </span>
                    {f.reflection}
                  </div>
                )}
                <div className="mt-3 flex gap-1.5 flex-wrap">
                  {(JSON.parse(f.aphorism.tags) as string[]).map((t) => (
                    <Tag key={t} tone="bamboo">
                      {t}
                    </Tag>
                  ))}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
