"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LifeBuoy, X } from "lucide-react";
import { DEFAULT_CRISIS_RESOURCE } from "@/lib/crisis";

export function CrisisHelp() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";
  const resource = DEFAULT_CRISIS_RESOURCE;
  const bottomClass = pathname.startsWith("/app/assistant") ? "bottom-44" : "bottom-24";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed ${bottomClass} right-4 z-30 w-12 h-12 rounded-full bg-cinnabar/90 text-white shadow-lift grid place-items-center hover:bg-cinnabar transition-colors`}
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
              如果你或身边的人存在伤害自己、伤害他人或无法保证安全的风险，请优先联系人工专业资源。
            </p>

            <div className="space-y-3">
              <HotlineCard
                label={resource.label}
                phone={resource.phone}
                note="武汉示范部署首选心理援助热线"
              />
              <HotlineCard
                label={resource.secondaryLabel}
                phone={resource.secondaryPhone}
                note="全国统一心理援助接入号"
              />
              <HotlineCard
                label={resource.olderAdultLabel}
                phone={resource.olderAdultPhone}
                note="老年专项心理支持"
              />
              <HotlineCard
                label={resource.hope24Label}
                phone={resource.hope24Phone}
                note="可作为跨地区补充心理危机支持"
              />
              <HotlineCard
                label={resource.beijingLabel}
                phone={resource.beijingMobile}
                note={`座机可拨 ${resource.beijingLandline}`}
              />
              <HotlineCard
                label="生命危险或急症"
                phone={resource.emergencyPhone}
                note="或前往最近医院急诊"
              />
            </div>

            <div className="mt-4 text-xs text-ink-light leading-relaxed">
              「心语」是 AI 辅助陪伴和筛查工具，不能替代专业治疗师、精神科医生或急救服务。正式部署前需由项目单位复核热线和转介流程。
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HotlineCard({ label, phone, note }: { label: string; phone: string; note: string }) {
  return (
    <a
      href={`tel:${phone}`}
      className="block bg-cinnabar/10 border border-cinnabar/20 rounded-sm p-3 hover:bg-cinnabar/15"
    >
      <div className="text-xs text-ink-light">{label}</div>
      <div className="font-song text-xl text-cinnabar mt-0.5">{phone}</div>
      <div className="text-xs text-ink-light mt-1">{note}</div>
    </a>
  );
}
