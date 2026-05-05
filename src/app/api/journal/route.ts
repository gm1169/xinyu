import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import { toDateOnly } from "@/lib/date";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "30"), 90);

  const items = await prisma.journalEntry.findMany({
    where: { userId: session.sub },
    orderBy: { entryDate: "desc" },
    take: limit,
  });
  return ok(items);
}

const Body = z.object({
  entryDate: z.string().optional(),
  content: z.string().min(1).max(8000),
  mood: z.number().int().min(1).max(10).nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const date = toDateOnly(parsed.data.entryDate ?? new Date().toISOString());

  const entry = await prisma.journalEntry.upsert({
    where: { userId_entryDate: { userId: session.sub, entryDate: date } },
    update: {
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
    },
    create: {
      userId: session.sub,
      entryDate: date,
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
    },
  });
  return ok(entry);
}
