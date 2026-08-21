"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type Report = {
  period: "weekly" | "monthly";
  summary: {
    highlights: string[];
    improvements: string[];
    suggestions: string[];
  };
  emotion: {
    avgEmotion: number;
    avgAnxiety: number;
    avgDepression: number;
    prevAvgEmotion: number;
    emotionDelta: number;
    count: number;
  };
  sleep: { avgQuality: number; count: number };
  training: { completedThisPeriod: number; titles: string[] };
  aphorism: { readCount: number };
};

export default function ProgressReportPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/progress-report?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setReport(d.data);
        setLoading(false);
      });
  }, [period]);

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/profile"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-song text-2xl text-ink">成长报告</h1>
          <p className="text-sm text-ink-light mt-1">
            汇总筛查、情绪、睡眠与格言式微干预记录，辅助随访沟通。
          </p>
        </div>
      </div>

      <div className="inline-flex rounded-sm bg-ink/5 p-1 mb-5">
        {(["weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${
              period === p ? "bg-xuan text-ink shadow-card" : "text-ink-light"
            }`}
          >
            {p === "weekly" ? "本周" : "本月"}
          </button>
        ))}
      </div>

      {loading && (
        <Card className="text-center text-sm text-ink-light py-8">
          加载中…
        </Card>
      )}

      {report && !loading && (
        <>
          {report.summary.highlights.length > 0 && (
            <Card className="mb-4 border-pine/15 bg-pine/5">
              <div className="font-song text-base text-ink mb-2 flex items-center gap-2">
                <span>✨</span>
                <span>亮点</span>
              </div>
              <ul className="space-y-1.5 text-[15px] text-ink">
                {report.summary.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-pine">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard
              label="平均情绪"
              value={report.emotion.avgEmotion || "—"}
              hint={
                report.emotion.emotionDelta
                  ? `${report.emotion.emotionDelta > 0 ? "↑" : "↓"} ${Math.abs(
                      report.emotion.emotionDelta,
                    )}%`
                  : "暂无对比"
              }
              hintTone={
                report.emotion.emotionDelta > 0
                  ? "pine"
                  : report.emotion.emotionDelta < 0
                    ? "cinnabar"
                    : "default"
              }
            />
            <MetricCard
              label="平均焦虑"
              value={report.emotion.avgAnxiety || "—"}
              hint={`${report.emotion.count} 天记录`}
            />
            <MetricCard
              label="平均抑郁"
              value={report.emotion.avgDepression || "—"}
            />
            <MetricCard
              label="睡眠质量"
              value={report.sleep.avgQuality || "—"}
              hint={`${report.sleep.count} 夜记录`}
            />
          </div>

          <Card className="mb-4">
            <div className="font-song text-base text-ink mb-2">本期练习</div>
            <div className="text-sm text-ink">
              完成训练单元{" "}
              <span className="text-bamboo font-medium">
                {report.training.completedThisPeriod}
              </span>{" "}
              · 格言式微干预{" "}
              <span className="text-bamboo font-medium">
                {report.aphorism.readCount}
              </span>
            </div>
            {report.training.titles.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-ink-light">
                {report.training.titles.map((t, i) => (
                  <li key={i}>· {t}</li>
                ))}
              </ul>
            )}
          </Card>

          {report.summary.improvements.length > 0 && (
            <Card className="mb-4 border-amber/20 bg-amber/5">
              <div className="font-song text-base text-ink mb-2 flex items-center gap-2">
                <span>🔍</span>
                <span>需要关注</span>
              </div>
              <ul className="space-y-1.5 text-[15px] text-ink">
                {report.summary.improvements.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {report.summary.suggestions.length > 0 && (
            <Card className="mb-4">
              <div className="font-song text-base text-ink mb-2 flex items-center gap-2">
                <span>🧭</span>
                <span>建议</span>
              </div>
              <ul className="space-y-1.5 text-[15px] text-ink">
                {report.summary.suggestions.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-bamboo">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  hintTone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  hintTone?: "default" | "pine" | "cinnabar";
}) {
  return (
    <Card className="!p-4">
      <div className="text-xs text-ink-light">{label}</div>
      <div className="font-song text-2xl text-ink mt-1.5">{value}</div>
      {hint && (
        <div className="mt-1.5">
          <Tag tone={hintTone === "default" ? "default" : hintTone}>{hint}</Tag>
        </div>
      )}
    </Card>
  );
}
