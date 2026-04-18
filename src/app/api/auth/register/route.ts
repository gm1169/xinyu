import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setAuthCookie } from "@/lib/auth";
import { fail, ok, safeJson } from "@/lib/api";

const Body = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效手机号"),
  password: z.string().min(8, "密码至少 8 位"),
  nickname: z.string().min(1).max(20),
});

export async function POST(req: NextRequest) {
  const body = await safeJson<unknown>(req);
  const parsed = Body.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const { phone, password, nickname } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { phone } });
  if (exists) return fail("该手机号已注册", 409);

  const user = await prisma.user.create({
    data: {
      phone,
      nickname,
      passwordHash: await hashPassword(password),
    },
  });

  const token = await signSession({ sub: user.id, nickname: user.nickname });
  await setAuthCookie(token);

  return ok({
    user: { id: user.id, phone: user.phone, nickname: user.nickname },
  });
}
