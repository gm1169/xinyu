"use client";

import { useState } from "react";
import { Heart, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Input";

export type AphorismViewData = {
  id: string;
  content: string;
  source: string;
  annotations: { char: string; meaning: string }[];
  interpretation: string;
  psychologyAnalysis: string;
  applicationScenarios: string[];
  tags: string[];
};

export function AphorismView({
  aphorism,
  initialFavorite,
  initialReflection,
}: {
  aphorism: AphorismViewData;
  initialFavorite: boolean;
  initialReflection: string;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [reflection, setReflection] = useState(initialReflection);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");

  async function toggleFavorite() {
    setFavorite((v) => !v);
    const res = await fetch(`/api/aphorisms/${aphorism.id}/favorite`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) setFavorite(data.data.isFavorite);
  }

  async function saveReflection() {
    if (!reflection.trim()) return;
    setSaved("saving");
    const res = await fetch(`/api/aphorisms/${aphorism.id}/reflection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection }),
    });
    const data = await res.json();
    setSaved(data.success ? "saved" : "idle");
    if (data.success) setTimeout(() => setSaved("idle"), 1500);
  }

  return (
    <div className="space-y-4">
      {/* 主体格言 */}
      <Card className="text-center py-8 border-bamboo/10 bg-gradient-to-b from-xuan to-moonlit">
        <p className="aphorism-text text-3xl text-ink leading-loose">
          {aphorism.content}
        </p>
        <div className="text-sm text-ink-light mt-5">— {aphorism.source}</div>
        <div className="flex flex-wrap justify-center gap-1.5 mt-5">
          {aphorism.tags.map((t) => (
            <Tag key={t} tone="bamboo">
              {t}
            </Tag>
          ))}
        </div>
        <button
          onClick={toggleFavorite}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-light hover:text-cinnabar"
        >
          <Heart
            size={18}
            fill={favorite ? "currentColor" : "none"}
            className={favorite ? "text-cinnabar" : ""}
          />
          {favorite ? "已收藏" : "收藏"}
        </button>
      </Card>

      {aphorism.annotations.length > 0 && (
        <Card>
          <div className="font-song text-base text-ink mb-3">逐字注释</div>
          <ul className="space-y-2 text-sm">
            {aphorism.annotations.map((a) => (
              <li key={a.char} className="flex gap-3">
                <span className="font-song text-bamboo min-w-[3em]">
                  {a.char}
                </span>
                <span className="text-ink-light">{a.meaning}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <div className="font-song text-base text-ink mb-2">含义解读</div>
        <p className="text-[15px] text-ink leading-relaxed">
          {aphorism.interpretation}
        </p>
      </Card>

      <Card>
        <div className="font-song text-base text-ink mb-2">
          心理学视角 · 现代解码
        </div>
        <p className="text-[15px] text-ink leading-relaxed">
          {aphorism.psychologyAnalysis}
        </p>
      </Card>

      <Card>
        <div className="font-song text-base text-ink mb-3">
          应用场景 · 何时想起它
        </div>
        <ul className="space-y-2 text-[15px] text-ink">
          {aphorism.applicationScenarios.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-bamboo">·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="font-song text-base text-ink mb-3">
          我的感悟
        </div>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="在此刻，这句话让你想到什么？"
        />
        <div className="mt-3 flex items-center justify-end gap-2">
          {saved === "saved" && (
            <span className="text-xs text-pine">已保存 ✓</span>
          )}
          <Button
            size="sm"
            onClick={saveReflection}
            disabled={saved === "saving" || !reflection.trim()}
          >
            <Save size={14} className="mr-1" />
            {saved === "saving" ? "保存中…" : "保存"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
