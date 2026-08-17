"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CompliancePage() {
  const [latest, setLatest] = useState<any>(null);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [acceptedScreening, setAcceptedScreening] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/compliance/consent")
      .then((res) => res.json())
      .then((data) => setLatest(data.data?.latest ?? null));
  }, []);

  async function submitConsent() {
    setMessage("");
    const res = await fetch("/api/compliance/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acceptedPrivacy, acceptedDisclaimer, acceptedScreening }),
    });
    const data = await res.json();
    if (data.success) {
      setLatest(data.data);
      setMessage("已记录本次知情同意。正式部署时需接入机构版知情同意书和伦理审批编号。");
    } else {
      setMessage(data.error?.message ?? "提交失败");
    }
  }

  async function deleteAccount() {
    if (deleteText !== "DELETE_MY_DATA") return;
    const res = await fetch("/api/user/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: deleteText }),
    });
    const data = await res.json();
    if (data.success) window.location.href = "/register";
    else setMessage(data.error?.message ?? "删除失败");
  }

  return (
    <div className="p-5 pb-8 animate-fade-in">
      <header className="flex items-center gap-3 mb-5">
        <Link href="/app/profile" className="text-ink-light"><ArrowLeft size={18} /></Link>
        <div>
          <div className="font-song text-xl text-ink flex items-center gap-2">
            <ShieldCheck size={18} className="text-bamboo" />
            合规与知情同意
          </div>
          <div className="text-xs text-ink-light mt-0.5">隐私政策 · 免责声明 · 数据删除</div>
        </div>
      </header>

      <Card className="mb-4">
        <div className="font-song text-lg text-ink mb-2">隐私政策摘要</div>
        <div className="space-y-2 text-sm text-ink-light leading-relaxed">
          <p>本原型会保存手机号、昵称、情绪记录、睡眠记录、日记、量表结果、格言互动和危机提示日志。</p>
          <p>这些数据仅用于个人自助记录、产品演示、申报材料中的功能验证说明；未经你同意，不用于商业广告或无关画像。</p>
          <p>心理健康、量表、日记和危机表达属于高度敏感信息。正式部署前，项目单位应补充伦理审批、数据最小化、访问审计、备份加密、数据出境和人工转介制度。</p>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="font-song text-lg text-ink mb-2">免责声明</div>
        <div className="space-y-2 text-sm text-ink-light leading-relaxed">
          <p>「心语」是心理健康辅助工具，不提供医学诊断、处方、治疗决策或急救服务。</p>
          <p>PHQ-9、GAD-7、ISI 结果仅为筛查和随访参考，不能替代精神科医生、心理治疗师或临床访谈。</p>
          <p>如出现自伤、自杀、伤人或无法保证安全的风险，请立即联系专业热线、当地急救或最近医院急诊。</p>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="font-song text-lg text-ink mb-3">记录知情同意</div>
        <label className="flex gap-2 text-sm text-ink mb-2">
          <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />
          我已阅读隐私政策摘要，知晓系统会处理心理健康相关敏感信息。
        </label>
        <label className="flex gap-2 text-sm text-ink mb-2">
          <input type="checkbox" checked={acceptedDisclaimer} onChange={(e) => setAcceptedDisclaimer(e.target.checked)} />
          我理解本工具不能替代医生、心理治疗师或急救服务。
        </label>
        <label className="flex gap-2 text-sm text-ink mb-4">
          <input type="checkbox" checked={acceptedScreening} onChange={(e) => setAcceptedScreening(e.target.checked)} />
          我同意使用标准量表进行自助筛查和随访记录。
        </label>
        <Button onClick={submitConsent} className="w-full">保存知情同意</Button>
        {latest && <div className="text-xs text-ink-light mt-3">最近同意时间：{new Date(latest.acceptedAt).toLocaleString()}</div>}
      </Card>

      <Card className="border-cinnabar/20 bg-cinnabar/5">
        <div className="font-song text-lg text-ink flex items-center gap-2 mb-2">
          <Trash2 size={17} className="text-cinnabar" />
          删除账号与本地数据
        </div>
        <p className="text-sm text-ink-light leading-relaxed mb-3">输入 DELETE_MY_DATA 后将删除账号及其关联记录。演示原型会立即执行级联删除；正式部署应提供可审计的数据删除流程。</p>
        <input
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
          className="w-full h-10 rounded-sm border border-ink/15 px-3 text-sm mb-3"
          placeholder="DELETE_MY_DATA"
        />
        <Button variant="secondary" onClick={deleteAccount} disabled={deleteText !== "DELETE_MY_DATA"} className="w-full">
          确认删除
        </Button>
      </Card>

      {message && <div className="mt-4 text-sm text-cinnabar">{message}</div>}
    </div>
  );
}
