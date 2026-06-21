import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { BookOpen, Plus } from "lucide-react";
import { sleepLessons, categoryLabels } from "@/lib/sleep-content";
import { format } from "date-fns";

export default async function SleepPage() {
  const session = (await getSession())!;
  const records = await prisma.sleepRecord.findMany({
    where: { userId: session.sub },
    orderBy: { recordDate: "desc" },
    take: 7,
  });
  const avgQuality =
    records.length > 0
      ? Math.round(
          (records.reduce((s, r) => s + r.sleepQuality, 0) / records.length) *
            10,
        ) / 10
      : null;

  const lessonsByCat = new Map<string, typeof sleepLessons>();
  for (const l of sleepLessons) {
    if (!lessonsByCat.has(l.category)) lessonsByCat.set(l.category, []);
    lessonsByCat.get(l.category)!.push(l);
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <header className="mb-5">
        <div className="text-xs text-ink-light">模块四</div>
        <h1 className="font-song text-2xl text-ink">睡眠智慧课堂</h1>
        <p className="text-sm text-ink-light mt-1.5 leading-relaxed">
          良夜，是可以被培养的。
        </p>
      </header>

      <Link href="/app/practice" className="block mb-4">
        <Card className="bg-gradient-to-br from-pine/10 to-bamboo/10 border-pine/20 flex items-center gap-3">
          <div className="text-2xl">🌙</div>
          <div className="flex-1">
            <div className="font-song text-base text-ink">睡前练习</div>
            <div className="text-xs text-ink-light mt-0.5">
              4-7-8 呼吸 · 渐进式肌肉放松——身体先放下，大脑才放下
            </div>
          </div>
        </Card>
      </Link>

      <Card className="mb-5 bg-gradient-to-br from-jiang-zi/5 to-xuan border-jiang-zi/15">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-song text-base text-ink">最近 7 天</div>
            <div className="text-xs text-ink-light mt-0.5">
              已记录 {records.length} 次
            </div>
          </div>
          <Link href="/app/sleep/record">
            <Button size="sm">
              <Plus size={14} className="mr-1" />
              记录今晚
            </Button>
          </Link>
        </div>
        {avgQuality !== null ? (
          <div className="text-3xl font-song text-ink">
            {avgQuality}
            <span className="text-sm text-ink-light ml-2">平均睡眠质量</span>
          </div>
        ) : (
          <div className="text-sm text-ink-light">
            还没有记录——第一晚就是起点。
          </div>
        )}

        {records.length > 0 && (
          <ul className="mt-4 flex gap-1">
            {records
              .slice()
              .reverse()
              .map((r) => (
                <li
                  key={r.id}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-sm bg-jiang-zi/30"
                    style={{ height: `${r.sleepQuality * 6 + 8}px` }}
                  />
                  <div className="text-[10px] text-ink-light">
                    {format(r.recordDate, "MM/dd")}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </Card>

      {[...lessonsByCat.entries()].map(([cat, lessons]) => (
        <section key={cat} className="mb-5">
          <h2 className="font-song text-lg text-ink mb-3">
            {categoryLabels[cat]}
          </h2>
          <ul className="space-y-2.5">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link href={`/app/sleep/lesson/${l.id}`}>
                  <Card className="hover:border-bamboo/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <BookOpen
                        size={20}
                        className="text-bamboo mt-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-song text-base text-ink">
                          {l.title}
                        </div>
                        <div className="text-sm text-ink-light mt-1 leading-relaxed">
                          {l.summary}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
