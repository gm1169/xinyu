import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-sm border border-ink/15 bg-white px-3 text-[15px] text-ink placeholder:text-ink-light/60",
      "focus:outline-none focus:border-bamboo focus:ring-2 focus:ring-bamboo/20",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-ink/15 bg-white p-3 text-[15px] text-ink placeholder:text-ink-light/60 min-h-[96px]",
      "focus:outline-none focus:border-bamboo focus:ring-2 focus:ring-bamboo/20",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm text-ink mb-1.5 font-medium"
    >
      {children}
      {required && <span className="text-cinnabar ml-0.5">*</span>}
    </label>
  );
}
