import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心语 · 文化适配数字心理健康筛查与微干预支持工具",
  description:
    "整合标准化筛查、情绪睡眠记录、格言式微干预、人工智能支持性对话和人工转介建议。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6B8E6B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bamboo-shadow">{children}</body>
    </html>
  );
}
