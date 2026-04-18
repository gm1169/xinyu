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
  "什么是「认知解离」？",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "你好，我是「心语」的 AI 心理陪伴。\n\n我不是治疗师，但可以和你一起练习、一起思考，一起把一个念头放到恰当的位置上。\n\n要不要告诉我，此刻你心里最明显的是什么？",
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
            心语助手
          </div>
          <div className="text-[11px] text-ink-light">
            AI 陪伴 · 不能替代专业治疗
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
        className="sticky bottom-0 bg-moonlit/95 backdrop-blur border-t border-ink/[0.06] p-3 flex gap-2"
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
