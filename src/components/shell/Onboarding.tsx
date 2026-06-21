"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const KEY = "xinyu_onboarding_seen";

const STEPS = [
  {
    emoji: "📜",
    title: "欢迎来到「心语」",
    body: "中华传统智慧 + 现代认知行为疗法。\n这里没有治愈承诺，只有一个安静的同行者。",
  },
  {
    emoji: "🧘",
    title: "你不是你的想法",
    body: "认知解离训练帮你把念头放回它该在的位置——\n念头会来，念头会走，你是天空，不是天气。",
  },
  {
    emoji: "🧭",
    title: "记录、练习、行动",
    body: "三件小事：\n· 看一眼今日格言\n· 记录一次情绪\n· 完成一次呼吸\n持续胜过完美。",
  },
  {
    emoji: "🛟",
    title: "如果难以承受",
    body: "右下角的「救生圈」按钮随时可调出紧急资源。\n请记住：你不孤单，也不必一个人扛。",
  },
];

export function Onboarding({ shouldShow }: { shouldShow: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!shouldShow) return;
    const seen = typeof window !== "undefined" && localStorage.getItem(KEY);
    if (!seen) setOpen(true);
  }, [shouldShow]);

  function dismiss() {
    if (typeof window !== "undefined") localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;
  const cur = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-5">
      <div className="bg-xuan w-full sm:max-w-sm rounded-t-lg sm:rounded-lg p-6 shadow-lift animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-4">{cur.emoji}</div>
          <div className="font-song text-xl text-ink">{cur.title}</div>
          <p className="text-sm text-ink leading-loose mt-3 whitespace-pre-line">
            {cur.body}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === step ? "bg-bamboo" : "bg-ink/15"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={dismiss}
            className="text-sm text-ink-light hover:text-ink px-3"
          >
            跳过
          </button>
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              下一步
              <ArrowRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button onClick={dismiss}>开始使用</Button>
          )}
        </div>
      </div>
    </div>
  );
}
