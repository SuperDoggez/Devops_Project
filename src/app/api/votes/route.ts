import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { attractionId, type } = await req.json();

    if (!attractionId || !type || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [session.user?.email]);
    const userId = userRes.rows[0]?.id;

    // Check if vote exists
    const existingVote = await pool.query(
      "SELECT id, type FROM votes WHERE attraction_id = $1 AND user_id = $2",
      [attractionId, userId]
    );

    if (existingVote.rows.length > 0) {
      if (existingVote.rows[0].type === type) {
        // Toggle off
        await pool.query("DELETE FROM votes WHERE id = $1", [existingVote.rows[0].id]);
        return NextResponse.json({ message: "Vote removed" });
      } else {
        // Change vote type
        await pool.query("UPDATE votes SET type = $1 WHERE id = $2", [type, existingVote.rows[0].id]);
        return NextResponse.json({ message: "Vote updated" });
      }
    } else {
      // New vote
      await pool.query(
        "INSERT INTO votes (attraction_id, user_id, type) VALUES ($1, $2, $3)",
        [attractionId, userId, type]
      );
      return NextResponse.json({ message: "Vote added" }, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
