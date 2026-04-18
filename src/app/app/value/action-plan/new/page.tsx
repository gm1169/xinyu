"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { ArrowLeft, Plus, X } from "lucide-react";
import { isoDateOnly } from "@/lib/date";

type ValueItem = { id: string; domain: string; valueStatement: string };

export default function NewActionPlanPage() {
  const router = useRouter();
  const params = useSearchParams();
  const presetValueId = params.get("valueId");

  const [values, setValues] = useState<ValueItem[]>([]);
  const [valueId, setValueId] = useState<string>(presetValueId ?? "");
  const [targetBehavior, setTargetBehavior] = useState("");
  const [triggerContext, setTriggerContext] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [obstacles, setObstacles] = useState<string[]>([""]);
  const [strategies, setStrategies] = useState<string[]>([""]);
  const [startDate, setStartDate] = useState(isoDateOnly());
  const [endDate, setEndDate] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/values")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setValues(d.data);
      });
  }, []);

  function updateList(
    list: string[],
    setList: (v: string[]) => void,
    i: number,
    v: string,
  ) {
    const next = [...list];
    next[i] = v;
    setList(next);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (cleanSteps.length === 0) {
      setErr("至少需要一个执行步骤");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/action-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valueId: valueId || null,
        targetBehavior,
        triggerContext,
        steps: cleanSteps,
        obstacles: obstacles.map((s) => s.trim()).filter(Boolean),
        copingStrategies: strategies.map((s) => s.trim()).filter(Boolean),
        startDate,
        endDate: endDate || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) {
      setErr(data.error?.message || "保存失败");
      return;
    }
    router.push("/app/value/action-plan");
    router.refresh();
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/value/action-plan"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <h1 className="font-song text-2xl text-ink mb-1">新建行动计划</h1>
      <p className="text-sm text-ink-light mb-5">
        目标行为 · 触发情境 · 执行步骤 · 可能障碍 · 应对策略
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {values.length > 0 && (
          <Card>
            <Label htmlFor="valueId">关联的价值（可选）</Label>
            <select
              id="valueId"
              value={valueId}
              onChange={(e) => setValueId(e.target.value)}
              className="h-10 w-full rounded-sm border border-ink/15 bg-white px-3 text-[15px] text-ink"
            >
              <option value="">不关联</option>
              {values.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.domain} · {v.valueStatement.slice(0, 30)}
                </option>
              ))}
            </select>
          </Card>
        )}

        <Card>
          <Label htmlFor="tb" required>
            目标行为
          </Label>
          <Input
            id="tb"
            value={targetBehavior}
            onChange={(e) => setTargetBehavior(e.target.value)}
            placeholder="例如：每天专注阅读 30 分钟"
            required
          />
          <div className="mt-4">
            <Label htmlFor="tc" required>
              触发情境
            </Label>
            <Input
              id="tc"
              value={triggerContext}
              onChange={(e) => setTriggerContext(e.target.value)}
              placeholder="例如：晚饭后坐在书桌前"
              required
            />
          </div>
        </Card>

        <ListCard
          title="执行步骤"
          items={steps}
          setItems={setSteps}
          placeholder="例如：打开阅读 App"
          required
        />

        <ListCard
          title="可能障碍"
          items={obstacles}
          setItems={setObstacles}
          placeholder="例如：加班回家已经很累"
        />

        <ListCard
          title="应对策略"
          items={strategies}
          setItems={setStrategies}
          placeholder="例如：先只读 5 分钟作为最低承诺"
        />

        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sd" required>
                开始日期
              </Label>
              <Input
                id="sd"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ed">结束日期（可选）</Label>
              <Input
                id="ed"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? "保存中…" : "保存行动计划"}
        </Button>
      </form>
    </div>
  );
}

function ListCard({
  title,
  items,
  setItems,
  placeholder,
  required,
}: {
  title: string;
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <Card>
      <Label required={required}>{title}</Label>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <Input
              value={it}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                setItems(next);
              }}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="text-ink-light hover:text-cinnabar shrink-0 w-8 flex items-center justify-center"
                aria-label="删除"
              >
                <X size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-2 text-sm text-bamboo inline-flex items-center gap-1"
      >
        <Plus size={14} />
        添加一项
      </button>
    </Card>
  );
}
