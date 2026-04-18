import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, unauthorized } from "@/lib/api";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const value = await prisma.valueExploration.findUnique({
    where: { id: params.id },
  });
  if (!value || value.userId !== session.sub) return fail("不存在", 404);

  await prisma.valueExploration.delete({ where: { id: params.id } });
  return ok({ deleted: true });
}
