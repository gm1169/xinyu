"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  label,
  leftHint,
  rightHint,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  leftHint?: string;
  rightHint?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink">{label}</span>
          <span className="text-sm font-medium text-bamboo">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-bamboo"
      />
      {(leftHint || rightHint) && (
        <div className="flex items-center justify-between text-xs text-ink-light mt-1">
          <span>{leftHint}</span>
          <span>{rightHint}</span>
        </div>
      )}
    </div>
  );
}
