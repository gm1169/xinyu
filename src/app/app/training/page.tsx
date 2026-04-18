import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { CheckCircle2, Circle, PlayCircle, Clock } from "lucide-react";

const moduleNames: Record<string, string> = {
  intro: "入门篇",
  advanced: "进阶篇",
  practice: "实战篇",
};

export default async function TrainingPage() {
  const session = (await getSession())!;
  const units = await prisma.trainingUnit.findMany({
    orderBy: [{ module: "asc" }, { order: "asc" }],
  });
  const progress = await prisma.userTrainingProgress.findMany({
    where: { userId: session.sub },
  });
  const pMap = new Map(progress.map((p) => [p.unitId, p.status]));

  const byModule = new Map<string, typeof units>();
  for (const u of units) {
    if (!byModule.has(u.module)) byModule.set(u.module, []);
    byModule.get(u.module)!.push(u);
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <header className="mb-6">
        <div className="text-xs text-ink-light">模块二</div>
        <h1 className="font-song text-2xl text-ink">认知解离训练营</h1>
        <p className="text-sm text-ink-light mt-1 leading-relaxed">
          学习与念头保持距离——
          <br />
          你不是你的想法，你是想法的观察者。
        </p>
      </header>

      {[...byModule.entries()].map(([mod, moduleUnits]) => {
        const completedCount = moduleUnits.filter(
          (u) => pMap.get(u.id) === "completed",
        ).length;
        return (
          <section key={mod} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-song text-lg text-ink">
                {moduleNames[mod] ?? mod}
              </h2>
              <Tag tone={completedCount === moduleUnits.length ? "pine" : "bamboo"}>
                {completedCount} / {moduleUnits.length}
              </Tag>
            </div>
            <ul className="space-y-2.5">
              {moduleUnits.map((u) => {
                const status = pMap.get(u.id) ?? "not_started";
                const Icon =
                  status === "completed"
                    ? CheckCircle2
                    : status === "in_progress"
                      ? PlayCircle
                      : Circle;
                const iconColor =
                  status === "completed"
                    ? "text-pine"
                    : status === "in_progress"
                      ? "text-amber"
                      : "text-ink/25";
                return (
                  <li key={u.id}>
                    <Link href={`/app/training/${u.id}`}>
                      <Card className="hover:border-bamboo/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <Icon size={22} className={`${iconColor} mt-0.5 shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-ink-light">
                                第 {u.order} 单元
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-xs text-ink-light">
                                <Clock size={11} />
                                {u.durationMinutes} 分钟
                              </span>
                            </div>
                            <div className="font-song text-base text-ink mt-0.5">
                              {u.title}
                            </div>
                            <div className="text-sm text-ink-light mt-1 leading-relaxed">
                              {u.description}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
