"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";

const PROMPTS = [
  "今天最让你停下来的瞬间是什么？",
  "如果用一句话总结今天，那是什么？",
  "今天你对自己说过的最严厉的一句话是什么？换一种说法呢？",
  "今天身体的感觉如何？哪里紧、哪里松？",
  "明天你想从今天带走什么、留下什么？",
];

export function JournalEditor({
  initialContent,
  initialMood,
}: {
  initialContent: string;
  initialMood: number | null;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<number | null>(initialMood);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);

  async function save() {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, mood }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSavedAt(new Date());
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <Card className="bg-bamboo/5 border-bamboo/15 text-sm text-ink leading-relaxed">
        <div className="text-xs text-bamboo mb-1.5">提示</div>
        {PROMPTS[promptIdx]}
        <button
          onClick={() => setPromptIdx((promptIdx + 1) % PROMPTS.length)}
          className="block mt-2 text-xs text-ink-light hover:text-bamboo"
        >
          换一个提示 →
        </button>
      </Card>

      <Card>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="此刻想到什么，就写什么……"
          className="min-h-[200px] text-base leading-relaxed"
        />
        <div className="mt-4 pt-4 border-t border-ink/[0.06]">
          <Slider
            label="今天的心情（可选）"
            value={mood ?? 5}
            onChange={(v) => setMood(v)}
            leftHint="低落"
            rightHint="愉悦"
          />
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {savedAt && (
            <span className="text-xs text-pine">
              已保存 · {savedAt.toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <Button onClick={save} disabled={saving || !content.trim()}>
            {saving ? "保存中…" : "保存今日"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
