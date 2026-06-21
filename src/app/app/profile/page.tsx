import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { EmotionChart } from "@/components/profile/EmotionChart";
import { ChevronRight, Heart, Flame, ScrollText, Settings } from "lucide-react";
import { subDays } from "date-fns";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { computeStreak } from "@/lib/streak";

const trendLabels: Record<string, string> = {
  improving: "正在改善 ↗",
  stable: "相对稳定 →",
  declining: "需要关注 ↘",
};

export default async function ProfilePage() {
  const session = (await getSession())!;
  const userId = session.sub;

  const [
    user,
    emotionRecords,
    userBadges,
    readCount,
    completedUnits,
    favorites,
    streak,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.emotionRecord.findMany({
      where: { userId, recordDate: { gte: subDays(new Date(), 30) } },
      orderBy: { recordDate: "asc" },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.userAphorism.count({ where: { userId, readAt: { not: null } } }),
    prisma.userTrainingProgress.count({
      where: { userId, status: "completed" },
    }),
    prisma.userAphorism.count({ where: { userId, isFavorite: true } }),
    computeStreak(userId),
  ]);

  const allBadges = await prisma.badge.findMany({ orderBy: { id: "asc" } });
  const earnedCodes = new Set(userBadges.map((b) => b.badge.code));

  let trend: "improving" | "stable" | "declining" = "stable";
  if (emotionRecords.length >= 4) {
    const mid = Math.floor(emotionRecords.length / 2);
    const early =
      emotionRecords.slice(0, mid).reduce((s, r) => s + r.emotionScore, 0) / mid;
    const late =
      emotionRecords.slice(mid).reduce((s, r) => s + r.emotionScore, 0) /
      (emotionRecords.length - mid);
    if (late - early > 0.5) trend = "improving";
    else if (early - late > 0.5) trend = "declining";
  }

  return (
    <div className="p-5 pt-6 pb-2 animate-fade-in">
      <header className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bamboo to-pine grid place-items-center text-white text-xl font-song">
          {user?.nickname?.[0] ?? "心"}
        </div>
        <div className="flex-1">
          <div className="font-song text-xl text-ink">{user?.nickname}</div>
          <div className="text-xs text-ink-light">{user?.phone}</div>
        </div>
        <Link
          href="/app/profile/settings"
          className="text-ink-light hover:text-ink p-2"
          aria-label="设置"
        >
          <Settings size={18} />
        </Link>
        <LogoutButton />
      </header>

      {streak.current > 0 && (
        <Card className="mb-4 bg-gradient-to-br from-amber/10 to-xuan border-amber/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div className="flex-1">
              <div className="font-song text-lg text-ink">
                连续 {streak.current} 天与心相伴
              </div>
              <div className="text-xs text-ink-light mt-0.5">
                历史最长 {streak.longest} 天 · 持续就是力量
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-2 mb-5">
        <Stat label="阅读格言" value={readCount} Icon={ScrollText} />
        <Stat label="训练单元" value={completedUnits} Icon={Flame} />
        <Stat label="收藏" value={favorites} Icon={Heart} />
        <Stat label="连续天数" value={streak.current} Icon={Flame} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-song text-base text-ink">情绪曲线</div>
            <div className="text-xs text-ink-light mt-0.5">最近 30 天</div>
          </div>
          <Tag
            tone={
              trend === "improving"
                ? "pine"
                : trend === "declining"
                  ? "cinnabar"
                  : "default"
            }
          >
            {trendLabels[trend]}
          </Tag>
        </div>
        {emotionRecords.length === 0 ? (
          <div className="text-sm text-ink-light text-center py-8">
            还没有情绪记录。
            <br />
            <Link href="/app/profile/emotion" className="text-bamboo">
              记录今日情绪 →
            </Link>
          </div>
        ) : (
          <EmotionChart
            records={emotionRecords.map((r) => ({
              recordDate: r.recordDate,
              emotionScore: r.emotionScore,
              anxietyScore: r.anxietyScore,
              depressionScore: r.depressionScore,
            }))}
          />
        )}
      </Card>

      <Card className="mb-4">
        <div className="font-song text-base text-ink mb-3">徽章墙</div>
        <ul className="grid grid-cols-4 gap-3">
          {allBadges.map((b) => {
            const earned = earnedCodes.has(b.code);
            return (
              <li key={b.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-full grid place-items-center text-2xl ${
                    earned
                      ? "bg-amber/15"
                      : "bg-ink/5 grayscale opacity-40"
                  }`}
                >
                  {b.iconEmoji}
                </div>
                <div
                  className={`text-[11px] mt-1.5 leading-tight ${earned ? "text-ink" : "text-ink-light/60"}`}
                >
                  {b.name}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <ul className="space-y-2">
        <LinkRow
          href="/app/profile/report"
          label="成长报告"
          emoji="📊"
        />
        <LinkRow
          href="/app/profile/journal"
          label="心语日记"
          emoji="📓"
        />
        <LinkRow
          href="/app/assistant"
          label="AI 心理陪伴"
          emoji="🤖"
        />
        <LinkRow
          href="/app/practice"
          label="此刻就练"
          emoji="🌬️"
        />
        <LinkRow
          href="/app/profile/emotion"
          label="记录今日情绪"
          emoji="📝"
        />
        <LinkRow
          href="/app/aphorism/favorites"
          label="我收藏的格言"
          emoji="📖"
        />
        <LinkRow
          href="/app/value"
          label="我的价值与行动"
          emoji="🧭"
        />
      </ul>

      <div className="text-center text-xs text-ink-light/70 mt-8 pb-4">
        心语 · v0.1 · MVP
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<any>;
}) {
  return (
    <Card className="text-center !p-3">
      <Icon size={18} className="mx-auto text-bamboo mb-1.5" />
      <div className="font-song text-xl text-ink leading-none">{value}</div>
      <div className="text-[11px] text-ink-light mt-1.5">{label}</div>
    </Card>
  );
}

function LinkRow({
  href,
  label,
  emoji,
}: {
  href: string;
  label: string;
  emoji: string;
}) {
  return (
    <li>
      <Link href={href}>
        <Card className="flex items-center justify-between !py-3">
          <span className="flex items-center gap-3 text-[15px] text-ink">
            <span className="text-lg">{emoji}</span>
            {label}
          </span>
          <ChevronRight size={16} className="text-ink-light" />
        </Card>
      </Link>
    </li>
  );
}
