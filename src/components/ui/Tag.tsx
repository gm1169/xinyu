import * as React from "react";
import { cn } from "@/lib/cn";

export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "bamboo" | "cinnabar" | "amber" | "pine";
}) {
  const toneClass = {
    default: "bg-ink/5 text-ink-light",
    bamboo: "bg-bamboo/10 text-bamboo",
    cinnabar: "bg-cinnabar/10 text-cinnabar",
    amber: "bg-amber/15 text-amber",
    pine: "bg-pine/10 text-pine",
  }[tone];
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-sm text-xs font-medium",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}
