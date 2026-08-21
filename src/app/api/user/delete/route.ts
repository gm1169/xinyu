import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession, clearAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";

const Body = z.object({
  confirmation: z.literal("DELETE_MY_DATA"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) {
    return fail("请输入 DELETE_MY_DATA 确认删除账号与全部本地数据");
  }

  await prisma.user.delete({ where: { id: session.sub } });
  await clearAuthCookie();
  return ok({ deleted: true });
}
