"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    n: 5,
    sense: "看见",
    bg: "bg-bamboo/15 text-bamboo",
    prompt: "环顾四周，说出 5 件你能看见的东西——尽量具体（颜色、形状、纹理）。",
  },
  {
    n: 4,
    sense: "听到",
    bg: "bg-pine/15 text-pine",
    prompt: "闭眼几秒，说出 4 种你能听到的声音——远近都算。",
  },
  {
    n: 3,
    sense: "触摸",
    bg: "bg-amber/15 text-amber",
    prompt: "说出 3 种你此刻能感觉到的触感——衣服的料子、椅子的硬度、空气的温度。",
  },
  {
    n: 2,
    sense: "闻到",
    bg: "bg-jiang-zi/15 text-jiang-zi",
    prompt: "说出 2 种你能闻到的味道——咖啡、洗衣液、空气，都算。如果没有明显的，就专心吸一口气。",
  },
  {
    n: 1,
    sense: "尝到",
    bg: "bg-cinnabar/15 text-cinnabar",
    prompt: "说出 1 种你嘴里的味道——茶、薄荷、甚至只是「无味」。",
  },
];

export default function GroundingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(
    STEPS.map((s) => Array(s.n).fill("")),
  );
  const [done, setDone] = useState(false);

  const cur = STEPS[step];

  function setAnswer(idx: number, value: string) {
    const next = answers.map((a) => [...a]);
    next[step][idx] = value;
    setAnswers(next);
  }

  function reset() {
    setStep(0);
    setAnswers(STEPS.map((s) => Array(s.n).fill("")));
    setDone(false);
  }

  if (done) {
    return (
      <div className="p-5 pt-6 animate-fade-in">
        <Link
          href="/app/practice"
          className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
        >
          <ArrowLeft size={14} />
          返回练习中心
        </Link>

        <Card className="text-center py-10 bg-gradient-to-br from-pine/5 to-bamboo/5 border-pine/15">
          <CheckCircle2 size={56} className="mx-auto text-pine" />
          <div className="font-song text-xl text-ink mt-4">
            已重新着陆
          </div>
          <div className="text-sm text-ink-light mt-2 leading-relaxed">
            你刚刚把注意力从「思维风暴」拉回到「此刻身体」。
            <br />
            这就是接地（grounding）——一个可以反复使用的工具。
          </div>
        </Card>

        <Card className="mt-4">
          <div className="font-song text-base text-ink mb-3">本次记录</div>
          <ul className="space-y-3 text-sm">
            {STEPS.map((s, i) => (
              <li key={s.n}>
                <div className="text-xs text-ink-light mb-1">
                  {s.n} 个{s.sense}
                </div>
                <div className="text-ink">
                  {answers[i].filter(Boolean).join("、") || "（未填写）"}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex gap-2 mt-5">
          <Button variant="secondary" className="flex-1" onClick={reset}>
            <RotateCcw size={14} className="mr-1.5" />
            再来一次
          </Button>
          <Link href="/app/practice" className="flex-1">
            <Button className="w-full">回到练习中心</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/practice"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回练习中心
      </Link>

      <header className="mb-5">
        <h1 className="font-song text-2xl text-ink">5-4-3-2-1 接地</h1>
        <p className="text-sm text-ink-light mt-1.5">
          用五感把自己拉回此刻——
          <br />
          强情绪 / 惊恐 / 解离时最有效。
        </p>
      </header>

      <div className="flex items-center gap-1.5 mb-5">
        {STEPS.map((s, i) => (
          <span
            key={s.n}
            className={`flex-1 h-1 rounded-full ${
              i <= step ? "bg-bamboo" : "bg-ink/10"
            }`}
          />
        ))}
      </div>

      <Card className="mb-4">
        <div className="text-center mb-4">
          <div
            className={`inline-flex w-16 h-16 rounded-full grid place-items-center font-song text-3xl ${cur.bg}`}
          >
            {cur.n}
          </div>
          <div className="font-song text-xl text-ink mt-3">
            {cur.n} 个{cur.sense}
          </div>
        </div>
        <p className="text-[15px] text-ink leading-loose">{cur.prompt}</p>

        <div className="mt-5 space-y-2">
          {answers[step].map((v, i) => (
            <input
              key={i}
              value={v}
              onChange={(e) => setAnswer(i, e.target.value)}
              placeholder={`第 ${i + 1} 个`}
              className="h-10 w-full rounded-sm border border-ink/15 bg-white px-3 text-[15px] text-ink focus:outline-none focus:border-bamboo focus:ring-2 focus:ring-bamboo/20"
            />
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        {step > 0 && (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setStep(step - 1)}
          >
            上一步
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>
            下一步
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setDone(true)}>
            完成
          </Button>
        )}
      </div>
    </div>
  );
}
