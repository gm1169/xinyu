import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/profile/SettingsForm";
import { Card } from "@/components/ui/Card";
import { DEFAULT_CRISIS_RESOURCE } from "@/lib/crisis";

export default async function SettingsPage() {
  const session = (await getSession())!;
  const crisis = DEFAULT_CRISIS_RESOURCE;
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      phone: true,
      nickname: true,
      aphorismReminder: true,
      emotionReminder: true,
      sleepReminder: true,
    },
  });

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/profile"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <h1 className="font-song text-2xl text-ink mb-1">设置</h1>
      <p className="text-sm text-ink-light mb-5">让心语更贴合你的节奏。</p>

      {user && <SettingsForm initial={user} />}

      <Card className="mt-5 bg-cinnabar/5 border-cinnabar/15">
        <div className="font-song text-base text-ink mb-2">紧急资源</div>
        <p className="text-sm text-ink leading-relaxed">
          如果你或你身边的人正在经历严重心理困扰，请优先寻求专业支持：
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          <li>
            · <span className="font-medium">{crisis.label}：</span>
            <a href={`tel:${crisis.phone}`} className="text-cinnabar">
              {crisis.phone}
            </a>
            （24 小时）
          </li>
          <li>
            · <span className="font-medium">{crisis.secondaryLabel}：</span>
            <a href={`tel:${crisis.secondaryPhone}`} className="text-cinnabar">
              {crisis.secondaryPhone}
            </a>
          </li>
          <li>
            · <span className="font-medium">{crisis.olderAdultLabel}：</span>
            <a href={`tel:${crisis.olderAdultPhone}`} className="text-cinnabar">
              {crisis.olderAdultPhone}
            </a>
            （老年专项）
          </li>
          <li>
            · <span className="font-medium">{crisis.hope24Label}：</span>
            <a href={`tel:${crisis.hope24Phone}`} className="text-cinnabar">
              {crisis.hope24Phone}
            </a>
          </li>
          <li>
            · <span className="font-medium">{crisis.beijingLabel}：</span>
            <a href={`tel:${crisis.beijingLandline}`} className="text-cinnabar">
              {crisis.beijingLandline}
            </a>
            （座机） /{" "}
            <a href={`tel:${crisis.beijingMobile}`} className="text-cinnabar">
              {crisis.beijingMobile}
            </a>
            （手机）
          </li>
          <li>
            · <span className="font-medium">生命危险请拨：</span>
            <a href={`tel:${crisis.emergencyPhone}`} className="text-cinnabar">
              {crisis.emergencyPhone}
            </a>{" "}
            或前往最近医院急诊
          </li>
          <li>· 各大城市精神卫生中心 / 三甲医院心理科可线下咨询</li>
        </ul>
      </Card>

      <div className="text-center text-xs text-ink-light/70 mt-8 pb-4">
        心语 · v0.1 · 内部 MVP
      </div>
    </div>
  );
}
