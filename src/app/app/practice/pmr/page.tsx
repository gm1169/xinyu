"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const GROUPS = [
  { id: "feet", name: "双脚", howTo: "把脚趾紧紧抓向脚底，绷紧脚掌……" },
  { id: "calves", name: "小腿", howTo: "脚尖向上勾，绷紧小腿……" },
  { id: "thighs", name: "大腿", howTo: "把大腿压向床面 / 椅面，绷紧大腿……" },
  { id: "abdomen", name: "腹部", howTo: "收紧腹部，像准备被人轻拍肚子……" },
  { id: "hands", name: "双手", howTo: "握紧两个拳头……" },
  { id: "arms", name: "手臂", howTo: "抬起双臂，绷紧上臂二头肌……" },
  { id: "shoulders", name: "肩膀", howTo: "把肩膀向上耸到耳朵……" },
  { id: "face", name: "面部", howTo: "皱起整张脸——眉头、嘴唇、下巴都收紧……" },
];

// Phase: 5s tense → 10s release → 2s gap → next group
const TENSE_S = 5;
const RELEASE_S = 10;
const GAP_S = 2;
const TOTAL = TENSE_S + RELEASE_S + GAP_S; // 17s per group

type Phase = "tense" | "release" | "gap";

export default function PmrPage() {
  const [running, setRunning] = useState(false);
  const [groupIdx, setGroupIdx] = useState(0);
  const [secondsInGroup, setSecondsInGroup] = useState(0);
  const [done, setDone] = useState(false);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - secondsInGroup * 1000;
    function tick() {
      const now = performance.now();
      const e = (now - startRef.current) / 1000;
      if (e >= TOTAL) {
        if (groupIdx >= GROUPS.length - 1) {
          setRunning(false);
          setDone(true);
          return;
        }
        setGroupIdx((g) => g + 1);
        startRef.current = now;
        setSecondsInGroup(0);
      } else {
        setSecondsInGroup(e);
      }
      tickRef.current = requestAnimationFrame(tick);
    }
    tickRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, groupIdx]);

  function reset() {
    setRunning(false);
    setGroupIdx(0);
    setSecondsInGroup(0);
    setDone(false);
  }

  const group = GROUPS[groupIdx];
  const phase: Phase =
    secondsInGroup < TENSE_S
      ? "tense"
      : secondsInGroup < TENSE_S + RELEASE_S
        ? "release"
        : "gap";
  const phaseElapsed =
    phase === "tense"
      ? secondsInGroup
      : phase === "release"
        ? secondsInGroup - TENSE_S
        : secondsInGroup - TENSE_S - RELEASE_S;
  const phaseTotal = phase === "tense" ? TENSE_S : phase === "release" ? RELEASE_S : GAP_S;
  const remaining = Math.max(0, Math.ceil(phaseTotal - phaseElapsed));

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
        <Card className="text-center py-12 bg-gradient-to-br from-pine/5 to-bamboo/5 border-pine/15">
          <CheckCircle2 size={56} className="mx-auto text-pine" />
          <div className="font-song text-xl text-ink mt-4">已完成放松</div>
          <div className="text-sm text-ink-light mt-2 leading-relaxed">
            8 组肌群 · 约 2 分钟
            <br />
            身体记得这种「放下」的感觉——
            <br />
            它会在下次紧张时重新可用。
          </div>
        </Card>
        <div className="flex gap-2 mt-5">
          <Button variant="secondary" className="flex-1" onClick={reset}>
            <RotateCcw size={14} className="mr-1.5" />
            再做一次
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
        <h1 className="font-song text-2xl text-ink">渐进式肌肉放松</h1>
        <p className="text-sm text-ink-light mt-1.5">
          8 组肌群依次紧绷→放松——
          <br />
          身体先于大脑放下紧张。
        </p>
      </header>

      <div className="flex items-center gap-1 mb-5">
        {GROUPS.map((g, i) => (
          <span
            key={g.id}
            className={`flex-1 h-1 rounded-full ${
              i < groupIdx
                ? "bg-pine"
                : i === groupIdx
                  ? "bg-bamboo"
                  : "bg-ink/10"
            }`}
          />
        ))}
      </div>

      <Card
        className={`text-center py-10 transition-colors ${
          phase === "tense"
            ? "bg-cinnabar/5 border-cinnabar/15"
            : phase === "release"
              ? "bg-pine/5 border-pine/15"
              : "bg-xuan"
        }`}
      >
        <div className="text-xs text-ink-light">
          第 {groupIdx + 1} / {GROUPS.length} 组
        </div>
        <div className="font-song text-3xl text-ink mt-2">{group.name}</div>
        <div className="mt-5">
          <div
            className={`font-song text-2xl ${
              phase === "tense"
                ? "text-cinnabar"
                : phase === "release"
                  ? "text-pine"
                  : "text-ink-light"
            }`}
          >
            {phase === "tense" ? "紧绷" : phase === "release" ? "放松" : "切换"}
          </div>
          <div className="text-5xl mt-3 font-song tabular-nums text-ink">
            {remaining}
          </div>
        </div>
        <p className="text-sm text-ink-light mt-6 px-4 leading-relaxed">
          {phase === "tense"
            ? group.howTo
            : phase === "release"
              ? "完全放下——感受紧绷与放松之间的差异。"
              : "下一组准备……"}
        </p>
      </Card>

      <div className="flex items-center justify-center gap-3 mt-5">
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
              {secondsInGroup > 0 || groupIdx > 0 ? "继续" : "开始"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
