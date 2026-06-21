import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft, Plus } from "lucide-react";

const LIFE_DOMAINS = [
  { label: "职业发展", emoji: "💼" },
  { label: "家庭关系", emoji: "🏡" },
  { label: "身心健康", emoji: "🌿" },
  { label: "个人成长", emoji: "🌱" },
  { label: "休闲娱乐", emoji: "🎨" },
  { label: "社会贡献", emoji: "🤝" },
];

export default async function ValuePage() {
  const session = (await getSession())!;
  const values = await prisma.valueExploration.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { actionPlans: { where: { status: "active" } } },
  });
  const exploredDomains = new Set(values.map((v) => v.domain));

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <div className="text-xs text-ink-light">模块三</div>
        <h1 className="font-song text-2xl text-ink">价值导向行动</h1>
        <p className="text-sm text-ink-light mt-1.5 leading-relaxed">
          明确方向，
          <br />
          把模糊的渴望翻译为可落地的日常行为。
        </p>
      </header>

      <section className="mb-6">
        <h2 className="font-song text-lg text-ink mb-3">探索六大领域</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {LIFE_DOMAINS.map((d) => {
            const explored = exploredDomains.has(d.label);
            return (
              <Link
                key={d.label}
                href={`/app/value/new?domain=${encodeURIComponent(d.label)}`}
              >
                <Card
                  className={`h-full ${
                    explored ? "border-bamboo/30 bg-bamboo/5" : ""
                  }`}
                >
                  <div className="text-xl mb-1.5">{d.emoji}</div>
                  <div className="font-song text-base text-ink">{d.label}</div>
                  <div className="text-xs text-ink-light mt-1">
                    {explored ? "已探索 ✓" : "开始探索"}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-song text-lg text-ink">我的价值陈述</h2>
          <Link href="/app/value/new">
            <Button size="sm" variant="secondary">
              <Plus size={14} className="mr-1" />
              新增
            </Button>
          </Link>
        </div>
        {values.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-2xl mb-2">🧭</div>
            <div className="text-sm text-ink-light">
              还没有价值陈述。
              <br />
              先从一个你在乎的领域开始吧。
            </div>
          </Card>
        ) : (
          <ul className="space-y-3">
            {values.map((v) => (
              <li key={v.id}>
                <Card>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag tone="bamboo">{v.domain}</Tag>
                    <span className="text-xs text-ink-light">
                      重要度 {v.importance} · 信心 {v.confidence}
                    </span>
                  </div>
                  <p className="text-[15px] text-ink leading-relaxed">
                    {v.valueStatement}
                  </p>
                  <div className="mt-3 pt-3 border-t border-ink/[0.06] flex items-center justify-between text-sm">
                    <span className="text-ink-light">
                      {v.actionPlans.length
                        ? `${v.actionPlans.length} 个进行中的行动`
                        : "还没有行动计划"}
                    </span>
                    <Link
                      href={`/app/value/action-plan/new?valueId=${v.id}`}
                      className="text-bamboo"
                    >
                      {v.actionPlans.length ? "查看/新增" : "制定计划 →"}
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-song text-lg text-ink">行动计划</h2>
          <Link href="/app/value/action-plan">
            <Button size="sm" variant="secondary">
              查看全部
            </Button>
          </Link>
        </div>
        <Card className="text-sm text-ink-light">
          将「想成为什么样的人」拆解为「目标行为 · 触发情境 · 执行步骤 · 可能障碍 · 应对策略」五要素。
        </Card>
      </section>
    </div>
  );
}
