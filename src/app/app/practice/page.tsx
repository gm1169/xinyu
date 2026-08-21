import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const PRACTICES = [
  {
    href: "/app/practice/breathing",
    emoji: "🌬️",
    title: "呼吸练习",
    body: "三种节奏（4-7-8 / 方盒 / 长呼气），3 分钟回到身体。",
    tone: "from-pine/10 to-bamboo/10 border-pine/20",
  },
  {
    href: "/app/practice/grounding",
    emoji: "🌿",
    title: "5-4-3-2-1 接地",
    body: "强情绪、解离、惊恐时——用五感重新着陆此刻。",
    tone: "from-bamboo/10 to-amber/10 border-bamboo/20",
  },
  {
    href: "/app/practice/pmr",
    emoji: "🛌",
    title: "渐进式肌肉放松",
    body: "8 组肌群依次紧绷-放松，10 分钟身心松弛。",
    tone: "from-jiang-zi/10 to-pine/10 border-jiang-zi/20",
  },
  {
    href: "/app/assistant",
    emoji: "🤖",
    title: "AI支持性对话",
    body: "非诊断、非替代治疗；高风险时提示人工转介。",
    tone: "from-amber/10 to-xuan border-amber/20",
  },
];

export default function PracticeHubPage() {
  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-6">
        <h1 className="font-song text-2xl text-ink">此刻就练</h1>
        <p className="text-sm text-ink-light mt-1.5 leading-relaxed">
          不必等心情好了再做——
          <br />
          做了，心情才会好。
        </p>
      </header>

      <ul className="space-y-3">
        {PRACTICES.map((p) => (
          <li key={p.href}>
            <Link href={p.href}>
              <Card
                className={`bg-gradient-to-br ${p.tone} hover:shadow-lift transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-song text-base text-ink">
                      {p.title}
                    </div>
                    <div className="text-sm text-ink-light mt-1 leading-relaxed">
                      {p.body}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-bamboo shrink-0 mt-1" />
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center text-xs text-ink-light/70">
        所有练习都不是「治疗」——
        是把心理工具放在你随手可取之处的一种方式。
      </div>
    </div>
  );
}
