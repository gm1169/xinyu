"use client";

import { useState } from "react";
import { LifeBuoy, X } from "lucide-react";

export function CrisisHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 w-12 h-12 rounded-full bg-cinnabar/90 text-white shadow-lift grid place-items-center hover:bg-cinnabar transition-colors"
        aria-label="紧急帮助"
        title="紧急帮助"
      >
        <LifeBuoy size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-xuan rounded-md w-full max-w-sm p-5 shadow-lift animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-song text-lg text-ink">需要支持？</div>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-light hover:text-ink"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-ink leading-relaxed mb-4">
              此刻如果你感到难以承受，请优先联系下面的资源——它们 24
              小时随时可用，且免费。
            </p>

            <div className="space-y-3">
              <a
                href="tel:400-161-9995"
                className="block bg-cinnabar/10 border border-cinnabar/20 rounded-sm p-3 hover:bg-cinnabar/15"
              >
                <div className="text-xs text-ink-light">全国心理援助热线</div>
                <div className="font-song text-xl text-cinnabar mt-0.5">
                  400-161-9995
                </div>
                <div className="text-xs text-ink-light mt-1">24 小时</div>
              </a>
              <a
                href="tel:120"
                className="block bg-cinnabar/5 border border-cinnabar/15 rounded-sm p-3 hover:bg-cinnabar/10"
              >
                <div className="text-xs text-ink-light">生命危险</div>
                <div className="font-song text-xl text-cinnabar mt-0.5">
                  120
                </div>
                <div className="text-xs text-ink-light mt-1">
                  或前往最近医院急诊
                </div>
              </a>
            </div>

            <div className="mt-4 text-xs text-ink-light leading-relaxed">
              「心语」是一个 AI 陪伴工具，无法替代专业治疗师。
              请记住——你不孤单，也不必一个人扛。
            </div>
          </div>
        </div>
      )}
    </>
  );
}
