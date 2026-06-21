import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ActionPlanCheckIn } from "@/components/value/ActionPlanCheckIn";
import { format } from "date-fns";

export default async function ActionPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = (await getSession())!;
  const plan = await prisma.actionPlan.findUnique({
    where: { id: params.id },
    include: {
      value: true,
      checkIns: { orderBy: { checkDate: "desc" }, take: 30 },
    },
  });
  if (!plan || plan.userId !== session.sub) notFound();

  const steps = JSON.parse(plan.steps) as string[];
  const obstacles = JSON.parse(plan.obstacles) as string[];
  const strategies = JSON.parse(plan.copingStrategies) as string[];

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/value/action-plan"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Tag tone={plan.status === "active" ? "bamboo" : "pine"}>
            {plan.status === "active"
              ? "进行中"
              : plan.status === "completed"
                ? "已完成"
                : "已放弃"}
          </Tag>
          {plan.value && (
            <span className="text-xs text-ink-light">· {plan.value.domain}</span>
          )}
        </div>
        <h1 className="font-song text-2xl text-ink">{plan.targetBehavior}</h1>
        <p className="text-sm text-ink-light mt-1.5">
          触发情境：{plan.triggerContext}
        </p>
        <div className="text-xs text-ink-light mt-2">
          {format(plan.startDate, "yyyy-MM-dd")}
          {plan.endDate ? ` → ${format(plan.endDate, "yyyy-MM-dd")}` : ""}
        </div>
      </header>

      <ActionPlanCheckIn
        planId={plan.id}
        initialCheckIns={plan.checkIns.map((c) => ({
          id: c.id,
          checkDate: c.checkDate.toISOString(),
          done: c.done,
          notes: c.notes,
        }))}
      />

      <Card className="mt-4">
        <div className="font-song text-base text-ink mb-3">执行步骤</div>
        <ol className="space-y-1.5 text-[15px] text-ink list-decimal list-inside">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Card>

      {obstacles.length > 0 && (
        <Card className="mt-3">
          <div className="font-song text-base text-ink mb-2">可能障碍</div>
          <ul className="space-y-1.5 text-[15px] text-ink">
            {obstacles.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {strategies.length > 0 && (
        <Card className="mt-3">
          <div className="font-song text-base text-ink mb-2">应对策略</div>
          <ul className="space-y-1.5 text-[15px] text-ink">
            {strategies.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-pine">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
