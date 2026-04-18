"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { CheckCircle2, Sparkles } from "lucide-react";

type Exercise = {
  id: string;
  type: "choice" | "reflection" | "slider";
  question: string;
  options?: string[];
  correctAnswer?: number;
  placeholder?: string;
};

type Unit = {
  id: string;
  title: string;
  theoryContent: { text: string; keyPoints: string[] };
  exercises: Exercise[];
  caseStudy: {
    title: string;
    content: string;
    reflectionQuestions: string[];
  };
};

type Step = "theory" | "exercise" | "case" | "done";

export function TrainingUnitRunner({
  unit,
  initialStatus,
  nextUnit,
}: {
  unit: Unit;
  initialStatus: string;
  nextUnit: { id: string; title: string } | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(
    initialStatus === "completed" ? "done" : "theory",
  );
  const [exIndex, setExIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const current = unit.exercises[exIndex];

  async function completeUnit() {
    setSubmitting(true);

    // Score = ratio of correct "choice" answers, scaled to 0-100
    const choiceItems = unit.exercises.filter((e) => e.type === "choice");
    let correct = 0;
    for (const e of choiceItems) {
      if (answers[e.id] === e.correctAnswer) correct++;
    }
    const score = choiceItems.length
      ? Math.round((correct / choiceItems.length) * 100)
      : 100;

    const res = await fetch(`/api/training/units/${unit.id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, answers, notes }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setEarnedBadges(data.data.earnedBadges ?? []);
      setStep("done");
      router.refresh();
    }
  }

  if (step === "theory") {
    return (
      <div className="space-y-4">
        <Card>
          <div className="font-song text-lg text-ink mb-3">理论讲解</div>
          <p className="text-[15px] text-ink leading-loose">
            {unit.theoryContent.text}
          </p>
          {unit.theoryContent.keyPoints.length > 0 && (
            <ul className="mt-5 space-y-2 pt-4 border-t border-ink/[0.06]">
              {unit.theoryContent.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <span className="text-bamboo mt-0.5">◆</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Button
          size="lg"
          className="w-full"
          onClick={() => setStep("exercise")}
        >
          开始练习
        </Button>
      </div>
    );
  }

  if (step === "exercise") {
    const answered = current.id in answers;
    return (
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-ink-light">
              练习 {exIndex + 1} / {unit.exercises.length}
            </div>
          </div>
          <div className="font-song text-base text-ink mb-4">
            {current.question}
          </div>

          {current.type === "choice" && current.options && (
            <ul className="space-y-2">
              {current.options.map((opt, i) => {
                const selected = answers[current.id] === i;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-3 rounded-sm border text-[15px] transition-colors ${
                        selected
                          ? "border-bamboo bg-bamboo/5 text-ink"
                          : "border-ink/10 hover:border-bamboo/40 text-ink"
                      }`}
                      onClick={() =>
                        setAnswers({ ...answers, [current.id]: i })
                      }
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {current.type === "reflection" && (
            <Textarea
              value={(answers[current.id] as string) ?? ""}
              onChange={(e) =>
                setAnswers({ ...answers, [current.id]: e.target.value })
              }
              placeholder={current.placeholder}
            />
          )}

          {current.type === "slider" && (
            <div className="pt-2">
              <Slider
                label=""
                value={(answers[current.id] as number) ?? 5}
                onChange={(v) =>
                  setAnswers({ ...answers, [current.id]: v })
                }
                leftHint="1"
                rightHint="10"
              />
            </div>
          )}
        </Card>

        <div className="flex gap-2">
          {exIndex > 0 && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setExIndex(exIndex - 1)}
            >
              上一题
            </Button>
          )}
          {exIndex < unit.exercises.length - 1 ? (
            <Button
              className="flex-1"
              disabled={!answered && current.type !== "slider"}
              onClick={() => {
                if (current.type === "slider" && !(current.id in answers)) {
                  setAnswers({ ...answers, [current.id]: 5 });
                }
                setExIndex(exIndex + 1);
              }}
            >
              下一题
            </Button>
          ) : (
            <Button
              className="flex-1"
              disabled={!answered && current.type !== "slider"}
              onClick={() => {
                if (current.type === "slider" && !(current.id in answers)) {
                  setAnswers({ ...answers, [current.id]: 5 });
                }
                setStep("case");
              }}
            >
              进入案例学习
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === "case") {
    return (
      <div className="space-y-4">
        <Card>
          <div className="text-xs text-bamboo mb-2">案例学习</div>
          <div className="font-song text-lg text-ink mb-3">
            {unit.caseStudy.title}
          </div>
          <p className="text-[15px] text-ink leading-loose">
            {unit.caseStudy.content}
          </p>

          {unit.caseStudy.reflectionQuestions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-ink/[0.06]">
              <div className="text-sm text-ink-light mb-2">反思：</div>
              <ul className="space-y-1.5 text-[15px] text-ink">
                {unit.caseStudy.reflectionQuestions.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-bamboo">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <div className="font-song text-base text-ink mb-2">
            我的练习心得（可选）
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="这次训练给你带来了什么？"
          />
        </Card>

        <Button
          size="lg"
          className="w-full"
          onClick={completeUnit}
          disabled={submitting}
        >
          {submitting ? "正在提交…" : "完成本单元"}
        </Button>
      </div>
    );
  }

  // done
  return (
    <div className="space-y-4">
      <Card className="text-center py-10 bg-gradient-to-br from-pine/5 to-bamboo/5 border-pine/15">
        <CheckCircle2 size={56} className="mx-auto text-pine" />
        <div className="font-song text-xl text-ink mt-4">
          恭喜完成本单元
        </div>
        <div className="text-sm text-ink-light mt-2 leading-relaxed">
          「{unit.title}」已记入你的成长档案
        </div>

        {earnedBadges.length > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 bg-amber/10 text-amber px-4 py-2 rounded-sm text-sm">
            <Sparkles size={14} />
            解锁徽章：{earnedBadges.join("、")}
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Link href="/app/training" className="flex-1">
          <Button variant="secondary" className="w-full">
            返回训练营
          </Button>
        </Link>
        {nextUnit && (
          <Link href={`/app/training/${nextUnit.id}`} className="flex-1">
            <Button className="w-full">下一单元 →</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
