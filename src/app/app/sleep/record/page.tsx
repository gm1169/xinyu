"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { ArrowLeft } from "lucide-react";
import { isoDateOnly } from "@/lib/date";

export default function SleepRecordPage() {
  const router = useRouter();
  const [recordDate, setRecordDate] = useState(isoDateOnly());
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepQuality, setSleepQuality] = useState(6);
  const [wakeUps, setWakeUps] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const res = await fetch("/api/sleep-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordDate,
        bedtime,
        wakeTime,
        sleepQuality,
        wakeUps,
        notes,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) {
      setErr(data.error?.message || "保存失败");
      return;
    }
    router.push("/app/sleep");
    router.refresh();
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/sleep"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <h1 className="font-song text-2xl text-ink mb-1">记录昨夜</h1>
      <p className="text-sm text-ink-light mb-5">
        写下来，才能看得见。
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <Label htmlFor="d" required>
            日期
          </Label>
          <Input
            id="d"
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            required
          />
        </Card>

        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bt" required>
                就寝时间
              </Label>
              <Input
                id="bt"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="wt" required>
                起床时间
              </Label>
              <Input
                id="wt"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card>
          <Slider
            label="睡眠质量"
            value={sleepQuality}
            onChange={setSleepQuality}
            leftHint="很糟"
            rightHint="很好"
          />
          <div className="mt-5">
            <Label htmlFor="wu">夜间醒来次数</Label>
            <Input
              id="wu"
              type="number"
              min={0}
              max={20}
              value={wakeUps}
              onChange={(e) => setWakeUps(Number(e.target.value) || 0)}
            />
          </div>
        </Card>

        <Card>
          <Label htmlFor="n">备注（可选）</Label>
          <Textarea
            id="n"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="昨晚做了什么梦？有什么让你辗转的事？"
          />
        </Card>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? "保存中…" : "保存"}
        </Button>
      </form>
    </div>
  );
}
