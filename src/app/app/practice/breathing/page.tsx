"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Pattern = {
  id: "478" | "box" | "long_exhale";
  name: string;
  desc: string;
  // 阶段：标签 + 持续秒数
  phases: { label: string; seconds: number }[];
};

const PATTERNS: Pattern[] = [
  {
    id: "478",
    name: "4-7-8 呼吸",
    desc: "最简单的神经系统降温按钮——副交感激活的「降温键」。",
    phases: [
      { label: "吸气", seconds: 4 },
      { label: "屏息", seconds: 7 },
      { label: "呼气", seconds: 8 },
    ],
  },
  {
    id: "box",
    name: "方盒呼吸",
    desc: "海军陆战队压力管理标配——四等分节奏，稳定专注。",
    phases: [
      { label: "吸气", seconds: 4 },
      { label: "屏息", seconds: 4 },
      { label: "呼气", seconds: 4 },
      { label: "屏息", seconds: 4 },
    ],
  },
  {
    id: "long_exhale",
    name: "长呼气",
    desc: "焦虑时最简单的版本——只关心呼气长于吸气。",
    phases: [
      { label: "吸气", seconds: 4 },
      { label: "呼气", seconds: 6 },
    ],
  },
];

export default function BreathingPage() {
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0); // 当前 phase 内已过秒数
  const [cycles, setCycles] = useState(0);
  const tickRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // tick loop
  useEffect(() => {
    if (!running) return;
    startTimeRef.current = performance.now() - elapsed * 1000;
    function tick() {
      const now = performance.now();
      const phase = pattern.phases[phaseIdx];
      const e = (now - startTimeRef.current) / 1000;
      if (e >= phase.seconds) {
        const nextIdx = (phaseIdx + 1) % pattern.phases.length;
        setPhaseIdx(nextIdx);
        if (nextIdx === 0) setCycles((c) => c + 1);
        startTimeRef.current = now;
        setElapsed(0);
      } else {
        setElapsed(e);
      }
      tickRef.current = requestAnimationFrame(tick);
    }
    tickRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIdx, pattern]);

  function selectPattern(p: Pattern) {
    setPattern(p);
    setRunning(false);
    setPhaseIdx(0);
    setElapsed(0);
    setCycles(0);
  }

  function reset() {
    setRunning(false);
    setPhaseIdx(0);
    setElapsed(0);
    setCycles(0);
  }

  const phase = pattern.phases[phaseIdx];
  const progress = phase ? Math.min(elapsed / phase.seconds, 1) : 0;
  // 圆缩放：吸气放大，呼气缩小，屏息保持
  const scale = (() => {
    if (!phase) return 0.6;
    if (phase.label === "吸气") return 0.6 + 0.4 * progress;
    if (phase.label === "呼气") return 1.0 - 0.4 * progress;
    return 1.0; // 屏息
  })();
  const remaining = phase ? Math.max(0, Math.ceil(phase.seconds - elapsed)) : 0;

  return (
    <div className="p-5 pt-6 animate-fade-in min-h-screen flex flex-col">
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-4">
        <h1 className="font-song text-2xl text-ink">呼吸练习</h1>
        <p className="text-sm text-ink-light mt-1">
          跟随圆的呼吸——身体先于大脑放下紧张。
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPattern(p)}
            className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
              pattern.id === p.id
                ? "bg-bamboo text-white"
                : "bg-xuan border border-ink/10 text-ink-light"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="text-sm text-ink-light mb-6 leading-relaxed">
        {pattern.desc}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] py-8">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-bamboo/30 to-pine/30 blur-2xl transition-transform ease-linear"
            style={{
              transform: `scale(${scale})`,
              transitionDuration: "200ms",
            }}
          />
          <div
            className="relative rounded-full bg-gradient-to-br from-bamboo to-pine shadow-lift flex items-center justify-center transition-transform ease-linear"
            style={{
              width: 200,
              height: 200,
              transform: `scale(${scale})`,
              transitionDuration: "200ms",
            }}
          >
            <div className="text-center text-white">
              <div className="font-song text-2xl">
                {running ? phase?.label : "准备好了吗？"}
              </div>
              {running && (
                <div className="text-4xl mt-2 font-song tabular-nums">
                  {remaining}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-ink-light mt-6">
          已完成{" "}
          <span className="text-bamboo font-medium">{cycles}</span> 个循环
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <Button variant="secondary" onClick={reset}>
          <RotateCcw size={16} className="mr-1.5" />
          重置
        </Button>
        <Button size="lg" onClick={() => setRunning(!running)}>
          {running ? (
            <>
              <Pause size={16} className="mr-1.5" />
              暂停
            </>
          ) : (
            <>
              <Play size={16} className="mr-1.5" />
              {cycles > 0 ? "继续" : "开始"}
            </>
          )}
        </Button>
      </div>

      <Card className="mt-6 bg-xuan/60 border-bamboo/10">
        <div className="text-sm text-ink leading-relaxed">
          <strong className="text-bamboo">小贴士：</strong>
          鼻子吸气、嘴巴呼气；呼气时让肩膀沉下来。注意「呼气比吸气长」是关键——
          这才是让神经系统降温的部分。
        </div>
      </Card>
    </div>
  );
}
