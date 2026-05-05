"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

type Initial = {
  id: string;
  phone: string;
  nickname: string;
  aphorismReminder: string | null;
  emotionReminder: string | null;
  sleepReminder: string | null;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(initial.nickname);
  const [aphorismReminder, setAphorism] = useState(initial.aphorismReminder ?? "");
  const [emotionReminder, setEmotion] = useState(initial.emotionReminder ?? "");
  const [sleepReminder, setSleep] = useState(initial.sleepReminder ?? "");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname,
        aphorismReminder: aphorismReminder || null,
        emotionReminder: emotionReminder || null,
        sleepReminder: sleepReminder || null,
      }),
    });
    const data = await res.json();
    setSavingProfile(false);
    if (data.success) {
      setProfileMsg("已保存 ✓");
      setTimeout(() => setProfileMsg(null), 1500);
      router.refresh();
    } else {
      setProfileMsg(data.error?.message || "保存失败");
    }
  }

  async function savePwd(e: React.FormEvent) {
    e.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);
    const res = await fetch("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
    });
    const data = await res.json();
    setSavingPwd(false);
    if (data.success) {
      setPwdMsg({ kind: "ok", text: "密码已更新 ✓" });
      setCurrentPwd("");
      setNewPwd("");
      setTimeout(() => setPwdMsg(null), 1800);
    } else {
      setPwdMsg({ kind: "err", text: data.error?.message || "更新失败" });
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={saveProfile} className="space-y-4">
        <Card>
          <Label htmlFor="nick">昵称</Label>
          <Input
            id="nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            required
          />
          <div className="mt-3">
            <Label>手机号</Label>
            <Input value={initial.phone} disabled />
          </div>
        </Card>

        <Card>
          <div className="font-song text-base text-ink mb-1">提醒时间</div>
          <p className="text-xs text-ink-light mb-3">
            目前为偏好记录，移动端集成后会触发本地推送。
          </p>
          <ReminderRow
            label="每日格言"
            value={aphorismReminder}
            onChange={setAphorism}
            hint="例如 08:00"
          />
          <ReminderRow
            label="情绪记录"
            value={emotionReminder}
            onChange={setEmotion}
            hint="例如 20:00"
          />
          <ReminderRow
            label="睡眠提醒"
            value={sleepReminder}
            onChange={setSleep}
            hint="例如 22:30"
          />
        </Card>

        <div className="flex items-center justify-end gap-3">
          {profileMsg && (
            <span
              className={`text-xs ${
                profileMsg.includes("✓") ? "text-pine" : "text-cinnabar"
              }`}
            >
              {profileMsg}
            </span>
          )}
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? "保存中…" : "保存"}
          </Button>
        </div>
      </form>

      <form onSubmit={savePwd}>
        <Card>
          <div className="font-song text-base text-ink mb-3">修改密码</div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cur">当前密码</Label>
              <Input
                id="cur"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="new">新密码（至少 8 位）</Label>
              <Input
                id="new"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            {pwdMsg && (
              <span
                className={`text-xs ${
                  pwdMsg.kind === "ok" ? "text-pine" : "text-cinnabar"
                }`}
              >
                {pwdMsg.text}
              </span>
            )}
            <Button
              type="submit"
              variant="secondary"
              disabled={savingPwd || !currentPwd || newPwd.length < 8}
            >
              {savingPwd ? "更新中…" : "更新密码"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

function ReminderRow({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-t border-ink/[0.06] first:border-t-0">
      <div className="flex-1">
        <div className="text-[15px] text-ink">{label}</div>
        <div className="text-xs text-ink-light">{hint}</div>
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-sm border border-ink/15 bg-white px-2 text-sm text-ink focus:outline-none focus:border-bamboo"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-ink-light hover:text-cinnabar px-1"
        >
          关闭
        </button>
      )}
    </div>
  );
}
