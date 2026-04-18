import Link from "next/link";
import { notFound } from "next/navigation";
import { sleepLessons, categoryLabels } from "@/lib/sleep-content";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft } from "lucide-react";

export default function SleepLessonPage({
  params,
}: {
  params: { id: string };
}) {
  const lesson = sleepLessons.find((l) => l.id === params.id);
  if (!lesson) notFound();

  return (
    <div className="p-5 pt-6 animate-fade-in">
      <Link
        href="/app/sleep"
        className="inline-flex items-center gap-1 text-sm text-ink-light mb-4"
      >
        <ArrowLeft size={14} />
        返回
      </Link>

      <Tag tone="bamboo">{categoryLabels[lesson.category]}</Tag>
      <h1 className="font-song text-2xl text-ink mt-3">{lesson.title}</h1>
      <p className="text-sm text-ink-light mt-1.5">{lesson.summary}</p>

      <Card className="mt-5">
        <div className="space-y-4 text-[15px] text-ink leading-loose">
          {lesson.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {lesson.keyPoints && (
          <ul className="mt-6 space-y-2 pt-4 border-t border-ink/[0.06]">
            {lesson.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="text-bamboo">◆</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {lesson.aphorism && (
        <Card className="mt-4 text-center py-8 bg-gradient-to-b from-xuan to-moonlit border-bamboo/10">
          <p className="aphorism-text text-2xl text-ink">
            {lesson.aphorism.content}
          </p>
          <div className="text-sm text-ink-light mt-3">
            — {lesson.aphorism.source}
          </div>
        </Card>
      )}
    </div>
  );
}
