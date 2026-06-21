import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signSession, verifyPassword } from "@/lib/auth";
import { fail, ok, safeJson } from "@/lib/api";

const Body = z.object({
  phone: z.string(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await safeJson<unknown>(req);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return fail("参数错误");

  const { phone, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return fail("手机号或密码错误", 401);

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return fail("手机号或密码错误", 401);

  const token = await signSession({ sub: user.id, nickname: user.nickname });
  await setAuthCookie(token);

  return ok({
    user: { id: user.id, phone: user.phone, nickname: user.nickname },
  });
}
