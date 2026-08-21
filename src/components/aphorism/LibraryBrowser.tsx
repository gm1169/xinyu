"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

type Item = {
  id: string;
  content: string;
  source: string;
  category: "classical" | "poetry" | "modern";
  tags: string[];
  isFavorite: boolean;
};

const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "classical", label: "古语" },
  { id: "poetry", label: "诗词" },
  { id: "modern", label: "现代" },
] as const;

export function LibraryBrowser() {
  const [items, setItems] = useState<Item[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [tag, setTag] = useState<string>("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);

  const visibleTags = useMemo(
    () => (showAllTags ? allTags : allTags.slice(0, 28)),
    [allTags, showAllTags],
  );

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);
    fetch(`/api/aphorisms?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setItems(d.data.items);
          setAllTags(d.data.tags);
        }
        setLoading(false);
      });
  }, [category, tag, q]);

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索文化文本、出处、心理靶点……"
          className="h-10 w-full rounded-sm border border-ink/15 bg-white pl-9 pr-3 text-[15px] text-ink focus:outline-none focus:border-bamboo focus:ring-2 focus:ring-bamboo/20"
        />
      </div>

      <div className="inline-flex rounded-sm bg-ink/5 p-1 mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
              category === c.id ? "bg-xuan text-ink shadow-card" : "text-ink-light"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setTag("")}
            className={`text-xs px-2 py-0.5 rounded-sm ${
              tag === "" ? "bg-bamboo text-white" : "bg-ink/5 text-ink-light"
            }`}
          >
            不筛选
          </button>
          {visibleTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t === tag ? "" : t)}
              className={`text-xs px-2 py-0.5 rounded-sm ${
                tag === t ? "bg-bamboo text-white" : "bg-ink/5 text-ink-light"
              }`}
            >
              {t}
            </button>
          ))}
          {allTags.length > 28 && (
            <button
              onClick={() => setShowAllTags((v) => !v)}
              className="text-xs px-2 py-0.5 rounded-sm border border-bamboo/20 text-bamboo bg-bamboo/5"
            >
              {showAllTags ? "收起标签" : `展开 ${allTags.length - 28} 个`}
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center text-sm text-ink-light py-8">加载中…</div>
      ) : items.length === 0 ? (
        <Card className="text-center py-10 text-sm text-ink-light">
          没有找到匹配的格言式微干预内容
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id}>
              <Link href={`/app/aphorism/${a.id}`}>
                <Card className="hover:border-bamboo/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="aphorism-text text-lg text-ink leading-relaxed">
                        {a.content}
                      </p>
                      <div className="text-xs text-ink-light mt-2">
                        — {a.source}
                      </div>
                    </div>
                    {a.isFavorite && (
                      <Heart size={16} className="text-cinnabar shrink-0 mt-1" fill="currentColor" />
                    )}
                  </div>
                  {a.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {a.tags.map((t) => (
                        <Tag key={t} tone="bamboo">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
