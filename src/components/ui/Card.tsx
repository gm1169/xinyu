import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-xuan rounded-md shadow-card p-5 border border-ink/[0.04]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <div className="font-song text-xl text-ink">{title}</div>
        {subtitle && (
          <div className="text-sm text-ink-light mt-1">{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  );
}
