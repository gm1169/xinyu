import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-4">
        <Link href="/" className="font-song text-lg text-bamboo">
          心语
        </Link>
      </header>
      <div className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  );
}
