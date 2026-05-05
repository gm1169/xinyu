import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dayBucket } from "@/lib/date";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Onboarding } from "@/components/shell/Onboarding";

async function getDashboardData(userId: string) {
  const total = await prisma.aphorism.count();
  const aphorism = total
    ? (
        await prisma.aphorism.findMany({
          orderBy: { id: "asc" },
          skip: dayBucket(new Date(), total),
          take: 1,
        })
      )[0]
    : null;

  const completedUnits = await prisma.userTrainingProgress.count({
    where: { userId, status: "completed" },
  });
  const totalUnits = await prisma.trainingUnit.count();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEmotion = await prisma.emotionRecord.findUnique({
    where: {
      userId_recordDate: { userId, recordDate: todayStart },
    },
  });

  return { aphorism, completedUnits, totalUnits, todayEmotion };
}

export default async function AppHome() {
  const session = (await getSession())!;
  const { aphorism, completedUnits, totalUnits, todayEmotion } =
    await getDashboardData(session.sub);
  const isNewUser = completedUnits === 0 && !todayEmotion;

  return (
    <div className="p-5 pb-4 animate-fade-in">
      <Onboarding shouldShow={isNewUser} />
      <header className="pt-3 pb-6">
        <div className="text-sm text-ink-light">
          {greeting()}，{session.nickname}
        </div>
        <div className="font-song text-2xl text-ink mt-1">
          愿你今日心安
        </div>
      </header>

      {aphorism && (
        <Link href="/app/aphorism" className="block">
          <Card className="bg-gradient-to-br from-xuan to-moonlit border-bamboo/10">
            <div className="flex items-center gap-1.5 text-xs text-bamboo mb-3">
              <Sparkles size={14} />
              今日格言
            </div>
            <p className="aphorism-text text-2xl text-ink leading-relaxed">
              {aphorism.content}
            </p>
            <div className="text-right text-sm text-ink-light mt-3">
              — {aphorism.source}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-bamboo">
              <span>查看释义与心理学解读</span>
              <ArrowRight size={16} />
            </div>
          </Card>
        </Link>
      )}

      <Link href="/app/practice/breathing" className="block mt-4">
        <Card className="bg-gradient-to-br from-pine/10 to-bamboo/10 border-pine/20 flex items-center gap-4">
          <div className="text-3xl">🌬️</div>
          <div className="flex-1">
            <div className="font-song text-base text-ink">此刻就练 · 呼吸</div>
            <div className="text-xs text-ink-light mt-0.5">
              焦虑、入睡前、卡住时——3 分钟回到身体
            </div>
          </div>
          <ArrowRight size={16} className="text-bamboo shrink-0" />
        </Card>
      </Link>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link href="/app/training">
          <Card className="h-full">
            <div className="text-2xl mb-2">🧘</div>
            <div className="font-song text-base text-ink">认知解离训练</div>
            <div className="text-xs text-ink-light mt-1">
              已完成 {completedUnits}/{totalUnits}
            </div>
          </Card>
        </Link>
        <Link href="/app/value">
          <Card className="h-full">
            <div className="text-2xl mb-2">🧭</div>
            <div className="font-song text-base text-ink">价值与行动</div>
            <div className="text-xs text-ink-light mt-1">
              探索你的方向
            </div>
          </Card>
        </Link>
        <Link href="/app/sleep">
          <Card className="h-full">
            <div className="text-2xl mb-2">🌙</div>
            <div className="font-song text-base text-ink">睡眠智慧课堂</div>
            <div className="text-xs text-ink-light mt-1">
              改善你的长夜
            </div>
          </Card>
        </Link>
        <Link href="/app/profile/emotion">
          <Card className="h-full">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-song text-base text-ink">今日情绪</div>
            <div className="text-xs text-ink-light mt-1">
              {todayEmotion ? "已记录 ✓" : "还未记录"}
            </div>
          </Card>
        </Link>
      </div>

      {!todayEmotion && (
        <Card className="mt-4">
          <div className="font-song text-base text-ink mb-1">
            今天，你感觉如何？
          </div>
          <div className="text-sm text-ink-light">
            只需一分钟，记录下此刻的情绪，让「可被看见」成为变化的开始。
          </div>
          <Link href="/app/profile/emotion" className="block mt-4">
            <Button size="sm" className="w-full">
              去记录
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "夜深了";
  if (h < 11) return "早安";
  if (h < 14) return "午安";
  if (h < 18) return "下午好";
  if (h < 22) return "晚上好";
  return "夜深了";
}
