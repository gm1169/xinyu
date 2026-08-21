"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Msg = { role: "user" | "assistant"; content: string; crisis?: boolean };

const STARTERS = [
  "引导我做一次认知解离练习",
  "我最近睡不好，怎么办？",
  "我感觉很焦虑",
  "给我一个格言式微干预练习",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "你好，我是「心语」的人工智能（AI）支持性对话助手。\n\n我不能替代精神科医生、心理治疗师或急救服务，但可以陪你做一次简短记录、认知重评或格言式微干预练习。\n\n要不要告诉我，此刻最明显的感受是什么？",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || pending) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setPending(true);

    const res = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    const data = await res.json();
    setPending(false);
    if (data.success) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.data.content,
          crisis: !!data.data.crisis,
        },
      ]);
    } else {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "不好意思，我这边遇到一点故障，请稍后再试。",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-moonlit/90 backdrop-blur px-5 py-3 border-b border-ink/[0.06] flex items-center gap-3">
        <Link href="/app" className="text-ink-light">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="font-song text-base text-ink flex items-center gap-1.5">
            <Sparkles size={14} className="text-bamboo" />
            AI支持性对话
          </div>
          <div className="text-[11px] text-ink-light">
            非诊断 · 非替代治疗 · 高风险时建议人工转介
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-6 space-y-3">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} />
        ))}
        {pending && (
          <div className="flex gap-1 text-ink-light text-sm pl-1">
            <span className="animate-pulse">思考中…</span>
          </div>
        )}

        {messages.length === 1 && !pending && (
          <div className="pt-4">
            <div className="text-xs text-ink-light mb-2 pl-1">
              试试这些开头
            </div>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-sm px-3 py-2 rounded-sm bg-xuan border border-ink/10 text-ink hover:border-bamboo/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="sticky bottom-20 z-20 bg-moonlit/95 backdrop-blur border-t border-ink/[0.06] p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="写下此刻的感受…"
          className="flex-1 h-11 rounded-sm border border-ink/15 bg-white px-3 text-[15px] text-ink focus:outline-none focus:border-bamboo"
        />
        <Button type="submit" disabled={pending || !input.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-md bg-bamboo text-white px-4 py-2.5 text-[15px] whitespace-pre-wrap leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[85%] rounded-md px-4 py-3 text-[15px] whitespace-pre-wrap leading-relaxed ${
          msg.crisis
            ? "bg-cinnabar/10 border border-cinnabar/30 text-ink"
            : "bg-xuan border border-ink/[0.06] text-ink"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}
