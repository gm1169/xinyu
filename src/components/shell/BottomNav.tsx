"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Home, BookOpen, GraduationCap, Moon, UserCircle2 } from "lucide-react";

const tabs = [
  { href: "/app", label: "首页", Icon: Home, match: (p: string) => p === "/app" },
  {
    href: "/app/aphorism",
    label: "格言",
    Icon: BookOpen,
    match: (p: string) => p.startsWith("/app/aphorism"),
  },
  {
    href: "/app/training",
    label: "训练",
    Icon: GraduationCap,
    match: (p: string) => p.startsWith("/app/training"),
  },
  {
    href: "/app/sleep",
    label: "睡眠",
    Icon: Moon,
    match: (p: string) => p.startsWith("/app/sleep"),
  },
  {
    href: "/app/profile",
    label: "我的",
    Icon: UserCircle2,
    match: (p: string) => p.startsWith("/app/profile") || p.startsWith("/app/value"),
  },
];

export function BottomNav() {
  const pathname = usePathname() || "";
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-xuan/95 backdrop-blur border-t border-ink/[0.06]">
      <ul className="mx-auto max-w-screen-sm grid grid-cols-5">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors",
                  active ? "text-bamboo" : "text-ink-light",
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[11px]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
