import { getSession } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api";
import { computeStreak } from "@/lib/streak";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  const streak = await computeStreak(session.sub);
  return ok(streak);
}
