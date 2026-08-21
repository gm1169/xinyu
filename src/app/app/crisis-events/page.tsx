import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

const levelLabels: Record<string, string> = {
  watch: "观察",
  urgent: "需尽快人工复核",
  emergency: "紧急风险",
};

export default async function CrisisEventsPage() {
  const session = (await getSession())!;
  const events = await prisma.crisisEvent.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="p-5 pb-8 animate-fade-in">
      <header className="flex items-center gap-3 mb-5">
        <Link href="/app/profile" className="text-ink-light"><ArrowLeft size={18} /></Link>
        <div>
          <div className="font-song text-xl text-ink flex items-center gap-2">
            <AlertTriangle size={18} className="text-cinnabar" />
            危机提示记录
          </div>
          <div className="text-xs text-ink-light mt-0.5">筛查提示 · 人工转介建议 · 日志留痕</div>
        </div>
      </header>

      <Card className="mb-4 bg-cinnabar/5 border-cinnabar/20">
        <p className="text-sm text-ink-light leading-relaxed">
          这里记录系统识别到的风险提示，目的是支持人工复核和转介闭环；记录本身不代表诊断，也不代表系统已完成救援处置。
        </p>
      </Card>

      {events.length === 0 ? (
        <Card>
          <div className="text-sm text-ink-light text-center py-8">暂无危机提示记录。</div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-song text-base text-ink">{levelLabels[event.riskLevel] ?? event.riskLevel}</div>
                  <div className="text-xs text-ink-light">{new Date(event.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-ink-light mb-2">来源：{event.triggerSource} · 状态：{event.referralStatus}</div>
                <p className="text-sm text-ink leading-relaxed">{event.recommendedAction}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
