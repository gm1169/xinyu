import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AphorismView } from "@/components/aphorism/AphorismView";

export default async function AphorismDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = (await getSession())!;
  const a = await prisma.aphorism.findUnique({ where: { id: params.id } });
  if (!a) notFound();

  const ua = await prisma.userAphorism.upsert({
    where: {
      userId_aphorismId: { userId: session.sub, aphorismId: a.id },
    },
    update: { readAt: new Date() },
    create: {
      userId: session.sub,
      aphorismId: a.id,
      readAt: new Date(),
    },
  });

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/aphorism/library"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回书架
      </Link>

      <AphorismView
        aphorism={{
          id: a.id,
          content: a.content,
          source: a.source,
          annotations: JSON.parse(a.annotations),
          interpretation: a.interpretation,
          psychologyAnalysis: a.psychologyAnalysis,
          applicationScenarios: JSON.parse(a.applicationScenarios),
          tags: JSON.parse(a.tags),
        }}
        initialFavorite={ua.isFavorite}
        initialReflection={ua.reflection ?? ""}
      />
    </div>
  );
}
