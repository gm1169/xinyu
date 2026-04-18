"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function onClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={onClick}
      className="text-ink-light hover:text-cinnabar p-2"
      aria-label="退出登录"
      title="退出登录"
    >
      <LogOut size={18} />
    </button>
  );
}
