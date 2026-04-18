import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error: { message, code } },
    { status },
  );
}

export function unauthorized(msg = "请先登录") {
  return fail(msg, 401, "UNAUTHORIZED");
}

export async function safeJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
