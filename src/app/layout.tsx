import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心语 · 格言智慧心理干预系统",
  description:
    "以中华传统智慧为魂，以认知行为疗法为骨——可随身携带的「心理药箱」。",
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
