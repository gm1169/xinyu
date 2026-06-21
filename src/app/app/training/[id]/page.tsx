import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrainingUnitRunner } from "@/components/training/TrainingUnitRunner";
import { ArrowLeft } from "lucide-react";

export default async function TrainingUnitPage({
  params,
}: {
  params: { id: string };
}) {
  const session = (await getSession())!;
  const unit = await prisma.trainingUnit.findUnique({
    where: { id: params.id },
  });
  if (!unit) notFound();

  await prisma.userTrainingProgress.upsert({
    where: {
      userId_unitId: { userId: session.sub, unitId: unit.id },
    },
    update: {},
    create: {
      userId: session.sub,
      unitId: unit.id,
      status: "in_progress",
      startedAt: new Date(),
    },
  });

  const progress = await prisma.userTrainingProgress.findUnique({
    where: {
      userId_unitId: { userId: session.sub, unitId: unit.id },
    },
  });

  const nextUnit = await prisma.trainingUnit.findFirst({
    where: { module: unit.module, order: { gt: unit.order } },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/training"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回训练营
      </Link>

      <header className="mb-5">
        <div className="text-xs text-bamboo">第 {unit.order} 单元</div>
        <h1 className="font-song text-2xl text-ink mt-1">{unit.title}</h1>
        <p className="text-sm text-ink-light mt-1.5 leading-relaxed">
          {unit.description}
        </p>
      </header>

      <TrainingUnitRunner
        unit={{
          id: unit.id,
          title: unit.title,
          theoryContent: JSON.parse(unit.theoryContent),
          exercises: JSON.parse(unit.exercises),
          caseStudy: JSON.parse(unit.caseStudy),
        }}
        initialStatus={progress?.status ?? "in_progress"}
        nextUnit={nextUnit}
      />
    </div>
  );
}
