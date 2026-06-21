"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password, nickname }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setErr(data.error?.message || "注册失败");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-song text-2xl text-ink">开始你的心语旅程</h1>
      <p className="text-sm text-ink-light mt-1">
        此心安处，即是吾乡。
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="nickname" required>
            昵称
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="想怎么被叫？"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" required>
            手机号
          </Label>
          <Input
            id="phone"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="11 位手机号"
            required
          />
        </div>
        <div>
          <Label htmlFor="pwd" required>
            密码
          </Label>
          <Input
            id="pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 8 位"
            required
          />
        </div>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "正在创建…" : "创建账户"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-ink-light text-center">
        已有账号？{" "}
        <Link href="/login" className="text-bamboo">
          去登录
        </Link>
      </div>
    </div>
  );
}
