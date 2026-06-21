import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";

const Body = z.object({
  nickname: z.string().min(1).max(20).optional(),
  aphorismReminder: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  emotionReminder: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  sleepReminder: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      phone: true,
      nickname: true,
      avatarUrl: true,
      aphorismReminder: true,
      emotionReminder: true,
      sleepReminder: true,
    },
  });
  if (!user) return unauthorized();
  return ok(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();
  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const updated = await prisma.user.update({
    where: { id: session.sub },
    data: parsed.data,
    select: {
      id: true,
      phone: true,
      nickname: true,
      avatarUrl: true,
      aphorismReminder: true,
      emotionReminder: true,
      sleepReminder: true,
    },
  });
  return ok(updated);
}
