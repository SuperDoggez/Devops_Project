import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { attractionId, text } = await req.json();

    if (!attractionId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [session.user?.email]);
    const userId = userRes.rows[0]?.id;

    const result = await pool.query(
      "INSERT INTO comments (attraction_id, user_id, text) VALUES ($1, $2, $3) RETURNING *",
      [attractionId, userId, text]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to post comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
