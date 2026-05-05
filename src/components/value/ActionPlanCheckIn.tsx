"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { CheckCircle2, Circle } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

type CheckIn = {
  id: string;
  checkDate: string;
  done: boolean;
  notes: string | null;
};

export function ActionPlanCheckIn({
  planId,
  initialCheckIns,
}: {
  planId: string;
  initialCheckIns: CheckIn[];
}) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState<"none" | "ok" | "skip">("none");

  const todayStr = useMemo(
    () => startOfDay(new Date()).toISOString().slice(0, 10),
    [],
  );
  const todayEntry = checkIns.find(
    (c) => c.checkDate.slice(0, 10) === todayStr,
  );
  const last14 = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) =>
      subDays(new Date(), 13 - i),
    );
    return days.map((d) => {
      const key = startOfDay(d).toISOString().slice(0, 10);
      const entry = checkIns.find((c) => c.checkDate.slice(0, 10) === key);
      return { date: d, key, entry };
    });
  }, [checkIns]);

  async function submit(done: boolean) {
    setSaving("none");
    const res = await fetch(`/api/action-plans/${planId}/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done, notes }),
    });
    const data = await res.json();
    if (data.success) {
      const ci = data.data as CheckIn;
      setCheckIns((prev) => {
        const others = prev.filter(
          (c) => c.checkDate.slice(0, 10) !== ci.checkDate.slice(0, 10),
        );
        return [
          { ...ci, checkDate: new Date(ci.checkDate).toISOString() },
          ...others,
        ];
      });
      setSaving(done ? "ok" : "skip");
      setNotes("");
      setTimeout(() => setSaving("none"), 1500);
    }
  }

  const doneCount = checkIns.filter((c) => c.done).length;

  return (
    <Card>
      <div className="font-song text-base text-ink mb-3">今日打卡</div>

      {todayEntry ? (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2
            size={18}
            className={todayEntry.done ? "text-pine" : "text-ink-light"}
          />
          <span className="text-ink">
            今天{todayEntry.done ? "已完成 ✓" : "未完成（已记录）"}
          </span>
          {todayEntry.notes && (
            <span className="text-ink-light text-xs">
              · {todayEntry.notes}
            </span>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="今天做了 / 没做的情境是？"
          />
          <div className="flex items-center justify-end gap-2">
            {saving === "ok" && (
              <span className="text-xs text-pine">已记录完成 ✓</span>
            )}
            {saving === "skip" && (
              <span className="text-xs text-ink-light">已记录未完成</span>
            )}
            <Button variant="secondary" size="sm" onClick={() => submit(false)}>
              没做到
            </Button>
            <Button size="sm" onClick={() => submit(true)}>
              做到了
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-ink/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-light">最近 14 天</span>
          <span className="text-xs text-ink-light">
            累计完成 {doneCount} 天
          </span>
        </div>
        <ul
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
        >
          {last14.map(({ key, date, entry }) => (
            <li
              key={key}
              className="flex flex-col items-center gap-1"
              title={`${format(date, "MM/dd")}: ${
                entry ? (entry.done ? "完成" : "未完成") : "未记录"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-sm grid place-items-center text-[10px] ${
                  entry?.done
                    ? "bg-pine text-white"
                    : entry
                      ? "bg-ink/10 text-ink-light"
                      : "bg-ink/5 text-ink-light/50"
                }`}
              >
                {entry?.done ? "✓" : entry ? "·" : ""}
              </div>
              <span className="text-[9px] text-ink-light">
                {format(date, "dd")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
