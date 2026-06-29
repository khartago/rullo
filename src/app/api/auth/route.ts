import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createAdminToken,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password, action } = body;

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 3,
    path: "/",
  });
  return res;
}

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json({
    authenticated: Boolean(cookieStore.get(COOKIE_NAME)?.value),
  });
}
