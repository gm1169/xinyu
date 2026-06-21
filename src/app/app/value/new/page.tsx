"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { ArrowLeft } from "lucide-react";

const DOMAINS = [
  "职业发展",
  "家庭关系",
  "身心健康",
  "个人成长",
  "休闲娱乐",
  "社会贡献",
];

const DOMAIN_PROMPTS: Record<string, string> = {
  职业发展: "在职业上，你希望成为一个什么样的人？",
  家庭关系: "你希望在家人心中，是一个什么样的存在？",
  身心健康: "你想给自己的身体和心灵什么样的待遇？",
  个人成长: "学习和成长对你意味着什么？",
  休闲娱乐: "哪些事情能让你真正放松和快乐？",
  社会贡献: "你希望用你的存在给世界留下什么？",
};

export default function NewValuePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [domain, setDomain] = useState(params.get("domain") ?? DOMAINS[0]);
  const [valueStatement, setValueStatement] = useState("");
  const [importance, setImportance] = useState(8);
  const [confidence, setConfidence] = useState(5);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d = params.get("domain");
    if (d) setDomain(d);
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const res = await fetch("/api/values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, valueStatement, importance, confidence }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.success) {
      setErr(data.error?.message || "保存失败");
      return;
    }
    router.push("/app/value");
    router.refresh();
  }

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/value"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <h1 className="font-song text-2xl text-ink">探索价值</h1>
        <p className="text-sm text-ink-light mt-1.5">
          想清楚之后，再行动。
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <Label htmlFor="domain" required>
            生活领域
          </Label>
          <select
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="h-10 w-full rounded-sm border border-ink/15 bg-white px-3 text-[15px] text-ink"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="mt-3 text-xs text-ink-light bg-bamboo/5 p-2.5 rounded-sm">
            {DOMAIN_PROMPTS[domain]}
          </div>
        </Card>

        <Card>
          <Label htmlFor="statement" required>
            我的价值陈述
          </Label>
          <Textarea
            id="statement"
            value={valueStatement}
            onChange={(e) => setValueStatement(e.target.value)}
            placeholder="例如：做一个能被女儿依靠、也能被自己尊重的父亲。"
            required
          />
          <div className="mt-2 text-xs text-ink-light">
            不是目标，是方向——你要朝哪走，而不是要到达哪里。
          </div>
        </Card>

        <Card>
          <Slider
            label="它对我有多重要？"
            value={importance}
            onChange={setImportance}
            leftHint="并不重要"
            rightHint="极其重要"
          />
          <div className="mt-5">
            <Slider
              label="我有多大信心去追求它？"
              value={confidence}
              onChange={setConfidence}
              leftHint="毫无信心"
              rightHint="非常有信心"
            />
          </div>
        </Card>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? "保存中…" : "保存价值"}
        </Button>
      </form>
    </div>
  );
}
