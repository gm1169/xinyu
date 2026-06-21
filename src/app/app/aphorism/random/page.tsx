"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type Aphorism = {
  id: string;
  content: string;
  source: string;
  interpretation: string;
  tags: string[];
};

const NEED_TAGS = [
  { id: "", label: "随机" },
  { id: "焦虑", label: "焦虑" },
  { id: "正念", label: "想静一静" },
  { id: "放下", label: "放不下" },
  { id: "希望", label: "需要希望" },
  { id: "行为激活", label: "提不起劲" },
  { id: "认知解离", label: "脑子停不下来" },
];

export default function RandomAphorismPage() {
  const [tag, setTag] = useState("");
  const [aphorism, setAphorism] = useState<Aphorism | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(t: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (t) params.set("tag", t);
    const res = await fetch(`/api/aphorisms/random?${params}`);
    const data = await res.json();
    setLoading(false);
    if (data.success) setAphorism(data.data);
  }

  useEffect(() => {
    load(tag);
  }, [tag]);

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/aphorism"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <h1 className="font-song text-2xl text-ink">现在给我一句</h1>
        <p className="text-sm text-ink-light mt-1.5">
          告诉我此刻你最需要什么——我帮你抽一句。
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {NEED_TAGS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTag(t.id)}
            className={`text-sm px-3 py-1.5 rounded-sm transition-colors ${
              tag === t.id
                ? "bg-bamboo text-white"
                : "bg-xuan border border-ink/10 text-ink-light"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="text-center py-12 text-sm text-ink-light">
          抽签中…
        </Card>
      ) : aphorism ? (
        <Card className="text-center py-10 bg-gradient-to-b from-xuan to-moonlit border-bamboo/10">
          <p className="aphorism-text text-3xl text-ink leading-loose">
            {aphorism.content}
          </p>
          <div className="text-sm text-ink-light mt-5">— {aphorism.source}</div>
          <p className="text-[15px] text-ink-light mt-6 px-4 leading-relaxed">
            {aphorism.interpretation}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-5">
            {aphorism.tags.map((t) => (
              <Tag key={t} tone="bamboo">
                {t}
              </Tag>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-10 text-sm text-ink-light">
          暂无匹配的格言，换一个心情试试。
        </Card>
      )}

      <div className="flex items-center justify-center gap-3 mt-5">
        <Button variant="secondary" onClick={() => load(tag)} disabled={loading}>
          <RefreshCw size={14} className="mr-1.5" />
          再来一句
        </Button>
        {aphorism && (
          <Link href={`/app/aphorism/${aphorism.id}`}>
            <Button>
              展开释义
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
