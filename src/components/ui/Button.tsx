import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bamboo/40";

const variants: Record<Variant, string> = {
  primary: "bg-bamboo text-white hover:bg-bamboo/90 shadow-card",
  secondary: "bg-xuan text-ink border border-ink/10 hover:border-bamboo/40",
  ghost: "text-ink-light hover:text-ink hover:bg-black/5",
  danger: "bg-cinnabar text-white hover:bg-cinnabar/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
