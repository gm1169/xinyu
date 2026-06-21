import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JournalEditor } from "@/components/profile/JournalEditor";
import { Card } from "@/components/ui/Card";
import { format } from "date-fns";
import { startOfDay } from "date-fns";

export default async function JournalPage() {
  const session = (await getSession())!;
  const todayStart = startOfDay(new Date());

  const [today, recent] = await Promise.all([
    prisma.journalEntry.findUnique({
      where: {
        userId_entryDate: { userId: session.sub, entryDate: todayStart },
      },
    }),
    prisma.journalEntry.findMany({
      where: { userId: session.sub, entryDate: { lt: todayStart } },
      orderBy: { entryDate: "desc" },
      take: 14,
    }),
  ]);

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/profile"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <header className="mb-5">
        <h1 className="font-song text-2xl text-ink">心语日记</h1>
        <p className="text-sm text-ink-light mt-1.5">
          自由地写——一句、一段，都可以。
        </p>
      </header>

      <JournalEditor
        initialContent={today?.content ?? ""}
        initialMood={today?.mood ?? null}
      />

      {recent.length > 0 && (
        <section className="mt-6">
          <h2 className="font-song text-base text-ink mb-3">回顾</h2>
          <ul className="space-y-3">
            {recent.map((e) => (
              <li key={e.id}>
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-ink-light">
                      {format(e.entryDate, "yyyy-MM-dd")}
                    </div>
                    {e.mood !== null && (
                      <div className="text-xs text-bamboo">心情 {e.mood}</div>
                    )}
                  </div>
                  <p className="text-[15px] text-ink whitespace-pre-wrap leading-relaxed">
                    {e.content}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
