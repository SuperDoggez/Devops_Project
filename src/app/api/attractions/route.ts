import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, location, image_url } = await req.json();

    if (!name || !description || !location) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get user id from session (we store it in token.sub in NextAuth callback)
    // Actually getServerSession returns user object with name/email/image by default.
    // We added 'id' in the session callback, so we need to access it.
    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [session.user?.email]);
    const userId = userRes.rows[0]?.id;

    const result = await pool.query(
      "INSERT INTO attractions (name, description, location, image_url, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, location, image_url, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create attraction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
    try {
        const res = await pool.query("SELECT * FROM attractions ORDER BY created_at DESC");
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
