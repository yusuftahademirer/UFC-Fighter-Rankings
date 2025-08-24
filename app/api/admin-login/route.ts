import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gizliAnahtar"; // .env.local'a ekle!

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // JWT oluştur
    const token = jwt.sign(
      { username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_auth", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2, // 2 saat
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}