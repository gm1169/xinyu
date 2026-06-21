import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";

const Body = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "新密码至少 8 位"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();
  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return unauthorized();

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return fail("当前密码错误", 401);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return ok({ updated: true });
}
