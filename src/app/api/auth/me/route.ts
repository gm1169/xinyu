import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, phone: true, nickname: true, avatarUrl: true },
  });
  if (!user) return unauthorized();
  return ok({ user });
}
