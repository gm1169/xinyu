import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-please-override-in-env",
);
const AUTH_COOKIE = "xinyu_auth";
const ISSUER = "xinyu";

export type SessionPayload = {
  sub: string; // user id
  nickname: string;
};

export async function hashPassword(pwd: string) {
  return bcrypt.hash(pwd, 10);
}

export async function verifyPassword(pwd: string, hash: string) {
  return bcrypt.compare(pwd, hash);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: ISSUER });
    return { sub: payload.sub as string, nickname: payload.nickname as string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  cookies().delete(AUTH_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getSessionFromRequest(
  req: NextRequest,
): Promise<SessionPayload | null> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
