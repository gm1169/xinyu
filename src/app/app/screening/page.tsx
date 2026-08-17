"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SCALE_DEFINITIONS, SEVERITY_LABELS, type ScaleCode } from "@/lib/screening";

const scales: ScaleCode[] = ["PHQ9", "GAD7", "ISI"];

export default function ScreeningPage() {
  const [scale, setScale] = useState<ScaleCode>("PHQ9");
  const definition = SCALE_DEFINITIONS[scale];
  const [answers, setAnswers] = useState<number[]>(() => Array(definition.itemLabels.length).fill(0));
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const completed = useMemo(() => answers.length === definition.itemLabels.length, [answers, definition]);

  useEffect(() => {
    setAnswers(Array(definition.itemLabels.length).fill(0));
    setResult(null);
  }, [scale, definition.itemLabels.length]);

  useEffect(() => {
    fetch("/api/screenings")
      .then((res) => res.json())
      .then((data) => setHistory(data.data?.results ?? []));
  }, []);

  function setAnswer(index: number, value: number) {
    setAnswers((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  async function submit() {
    const res = await fetch("/api/screenings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scale, answers }),
    });
    const data = await res.json();
    if (data.success) {
      setResult(data.data.result);
      setHistory((prev) => [data.data.result, ...prev]);
    }
  }

  return (
    <div className="p-5 pb-8 animate-fade-in">
      <header className="flex items-center gap-3 mb-5">
        <Link href="/app/profile" className="text-ink-light"><ArrowLeft size={18} /></Link>
        <div>
          <div className="font-song text-xl text-ink flex items-center gap-2">
            <ClipboardList size={18} className="text-bamboo" />
            标准量表筛查
          </div>
          <div className="text-xs text-ink-light mt-0.5">PHQ-9 · GAD-7 · ISI</div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {scales.map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            className={`rounded-sm border px-3 py-2 text-sm ${scale === s ? "border-bamboo bg-bamboo/10 text-bamboo" : "border-ink/10 bg-xuan text-ink-light"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="font-song text-lg text-ink">{definition.name}</div>
        <p className="text-sm text-ink-light leading-relaxed mt-2">{definition.description}</p>
      </Card>

      <div className="space-y-3">
        {definition.itemLabels.map((label, index) => (
          <Card key={label}>
            <div className="text-sm text-ink leading-relaxed mb-3">{index + 1}. {label}</div>
            <div className="grid grid-cols-2 gap-2">
              {definition.options.map((option, value) => (
                <button
                  key={option}
                  onClick={() => setAnswer(index, value)}
                  className={`rounded-sm border px-2 py-2 text-xs text-left ${answers[index] === value ? "border-bamboo bg-bamboo/10 text-bamboo" : "border-ink/10 bg-white text-ink-light"}`}
                >
                  {value} · {option}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={submit} disabled={!completed} className="w-full mt-4">保存并评分</Button>

      {result && (
        <Card className="mt-4 bg-bamboo/5 border-bamboo/20">
          <div className="font-song text-lg text-ink">本次结果</div>
          <div className="text-sm text-ink mt-2">总分：{result.totalScore}</div>
          <div className="text-sm text-ink">等级：{SEVERITY_LABELS[result.severity] ?? result.severity}</div>
          {result.riskFlag && <div className="text-sm text-cinnabar mt-2">PHQ-9 第9题提示风险，已记录为待人工复核事件。</div>}
          <div className="text-xs text-ink-light mt-3">筛查结果不等同诊断。如分数较高或出现安全风险，请联系专业人员。</div>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-4">
          <div className="font-song text-base text-ink mb-3">最近记录</div>
          <ul className="space-y-2">
            {history.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm border-b border-ink/[0.06] pb-2 last:border-b-0 last:pb-0">
                <span>{item.scale} · {item.totalScore}分 · {SEVERITY_LABELS[item.severity] ?? item.severity}</span>
                <span className="text-xs text-ink-light">{new Date(item.completedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
