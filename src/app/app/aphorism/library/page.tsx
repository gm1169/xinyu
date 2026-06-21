import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LibraryBrowser } from "@/components/aphorism/LibraryBrowser";

export default function LibraryPage() {
  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/aphorism"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <h1 className="font-song text-2xl text-ink">格言书架</h1>
        <p className="text-sm text-ink-light mt-1.5">
          翻翻看，遇见此刻需要的那一句。
        </p>
      </header>

      <LibraryBrowser />
    </div>
  );
}
