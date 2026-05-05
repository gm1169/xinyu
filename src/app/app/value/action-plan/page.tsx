import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";

export default async function ActionPlansPage() {
  const session = (await getSession())!;
  const plans = await prisma.actionPlan.findMany({
    where: { userId: session.sub },
    include: { value: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/value"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <div className="flex items-center justify-between mb-5">
        <h1 className="font-song text-2xl text-ink">行动计划</h1>
        <Link href="/app/value/action-plan/new">
          <Button size="sm">
            <Plus size={14} className="mr-1" />
            新建
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <Card className="text-center py-10">
          <div className="text-2xl mb-2">🚶</div>
          <div className="text-sm text-ink-light">
            千里之行，始于足下。
            <br />
            新建你的第一个行动计划。
          </div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {plans.map((p) => (
            <li key={p.id}>
              <Link href={`/app/value/action-plan/${p.id}`}>
              <Card className="hover:border-bamboo/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Tag tone={p.status === "active" ? "bamboo" : "pine"}>
                    {p.status === "active"
                      ? "进行中"
                      : p.status === "completed"
                        ? "已完成"
                        : "已放弃"}
                  </Tag>
                  {p.value && (
                    <span className="text-xs text-ink-light">
                      · {p.value.domain}
                    </span>
                  )}
                </div>
                <div className="font-song text-base text-ink">
                  {p.targetBehavior}
                </div>
                <div className="text-sm text-ink-light mt-1">
                  触发情境：{p.triggerContext}
                </div>
                <div className="mt-3 pt-3 border-t border-ink/[0.06] flex items-center justify-between text-xs text-ink-light">
                  <span>
                    {format(p.startDate, "yyyy-MM-dd")}
                    {p.endDate ? ` → ${format(p.endDate, "yyyy-MM-dd")}` : ""}
                  </span>
                  <span>{JSON.parse(p.steps).length} 个步骤</span>
                </div>
              </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
