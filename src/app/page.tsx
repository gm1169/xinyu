import Link from "next/link";
import { Button } from "@/components/ui/Button";

const features = [
  {
    title: "每日格言智慧",
    body: "精选中华古典与现代哲思，配以逐字注释、心理学解读与应用场景。",
    emoji: "📜",
  },
  {
    title: "认知解离训练营",
    body: "6 个系统化单元，帮你学会与念头保持距离——「你不是你的想法」。",
    emoji: "🧘",
  },
  {
    title: "价值导向行动",
    body: "借鉴 ACT，将模糊的人生目标拆解为可执行的日常行为。",
    emoji: "🧭",
  },
  {
    title: "睡眠智慧课堂",
    body: "结合失眠 CBT-I 与放松训练，改善睡眠质量。",
    emoji: "🌙",
  },
  {
    title: "我的心理档案",
    body: "情绪曲线、阅读感悟、进展报告——看见自己的成长。",
    emoji: "📈",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-block text-5xl mb-6">📖</div>
        <h1 className="font-song text-4xl sm:text-5xl text-ink tracking-wider">
          心语
        </h1>
        <p className="mt-3 text-ink-light">格言智慧心理干预系统</p>
        <p className="mt-8 text-ink/80 leading-loose max-w-lg mx-auto">
          以中华传统智慧为魂，
          <br />
          以循证心理技术为骨，
          <br />
          以数字便捷为形——
          <br />
          可随身携带的「心理药箱」。
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link href="/register">
            <Button size="lg">开始使用</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              已有账户
            </Button>
          </Link>
        </div>
      </section>

      <div className="ink-divider max-w-xl mx-auto" />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-song text-2xl text-ink text-center mb-10">
          五大核心模块
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <li
              key={f.title}
              className="bg-xuan rounded-md p-5 shadow-card border border-ink/[0.04]"
            >
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="font-song text-lg text-ink">{f.title}</div>
              <div className="mt-1.5 text-sm text-ink-light leading-relaxed">
                {f.body}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-center py-10 text-xs text-ink-light/70">
        心语 · MVP · v0.1
      </footer>
    </main>
  );
}
