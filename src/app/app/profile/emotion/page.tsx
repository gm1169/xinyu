"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { ArrowLeft } from "lucide-react";
import { isoDateOnly } from "@/lib/date";

export default function EmotionRecordPage() {
  const router = useRouter();
  const [emotion, setEmotion] = useState(6);
  const [anxiety, setAnxiety] = useState(4);
  const [depression, setDepression] = useState(3);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const res = await fetch("/api/emotion-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordDate: isoDateOnly(),
        emotionScore: emotion,
        anxietyScore: anxiety,
        depressionScore: depression,
        notes,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) {
      setErr(data.error?.message || "保存失败");
      return;
    }
    router.push("/app/profile");
    router.refresh();
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/profile"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <h1 className="font-song text-2xl text-ink mb-1">今日情绪</h1>
      <p className="text-sm text-ink-light mb-5">
        可被看见的，才可能被改变。
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <Slider
            label="整体情绪"
            value={emotion}
            onChange={setEmotion}
            leftHint="低落"
            rightHint="愉悦"
          />
        </Card>
        <Card>
          <Slider
            label="焦虑程度"
            value={anxiety}
            onChange={setAnxiety}
            leftHint="平静"
            rightHint="焦虑"
          />
        </Card>
        <Card>
          <Slider
            label="抑郁程度"
            value={depression}
            onChange={setDepression}
            leftHint="无感"
            rightHint="沉重"
          />
        </Card>

        <Card>
          <div className="font-song text-base text-ink mb-2">今天发生了什么？</div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="可以是一件具体的事，也可以是一种说不清的感觉。"
          />
        </Card>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? "保存中…" : "保存记录"}
        </Button>
      </form>
    </div>
  );
}
