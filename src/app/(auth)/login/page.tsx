"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) {
      setErr(data.error?.message || "登录失败");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-song text-2xl text-ink">欢迎回来</h1>
      <p className="text-sm text-ink-light mt-1">安静片刻，与自己相见。</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="phone" required>
            手机号
          </Label>
          <Input
            id="phone"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
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
            placeholder="请输入密码"
            required
          />
        </div>

        {err && <div className="text-sm text-cinnabar">{err}</div>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "正在登录…" : "登录"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-ink-light text-center">
        还没有账号？{" "}
        <Link href="/register" className="text-bamboo">
          去注册
        </Link>
      </div>
    </div>
  );
}
