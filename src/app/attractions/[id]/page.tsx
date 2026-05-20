import Image from "next/image";
import pool from "@/lib/db";
import { Attraction } from "@/types";
import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { VoteButtons } from "@/components/VoteButtons";
import { CommentForm } from "@/components/CommentForm";

interface AttractionDetail extends Attraction {
  likes: number;
  dislikes: number;
  user_vote?: string;
}

async function getAttractionDetail(id: string, userId?: string): Promise<AttractionDetail | null> {
  try {
    const attractionRes = await pool.query("SELECT * FROM attractions WHERE id = $1", [id]);
    if (attractionRes.rows.length === 0) return null;

    const votesRes = await pool.query(
      "SELECT type, COUNT(*) FROM votes WHERE attraction_id = $1 GROUP BY type",
      [id]
    );

    let likes = 0;
    let dislikes = 0;
    votesRes.rows.forEach((row) => {
      if (row.type === "like") likes = parseInt(row.count);
      if (row.type === "dislike") dislikes = parseInt(row.count);
    });

    let userVote = undefined;
    if (userId) {
        const userVoteRes = await pool.query(
            "SELECT type FROM votes WHERE attraction_id = $1 AND user_id = $2",
            [id, userId]
        );
        userVote = userVoteRes.rows[0]?.type;
    }

    return { ...attractionRes.rows[0], likes, dislikes, user_vote: userVote };
  } catch (error) {
    console.error("Failed to fetch attraction detail:", error);
    return null;
  }
}

async function getComments(id: string): Promise<any[]> {
  try {
    const res = await pool.query(
      "SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.attraction_id = $1 ORDER BY c.created_at DESC",
      [id]
    );
    return res.rows;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

export default async function AttractionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession();
  
  let userId = undefined;
  if (session?.user?.email) {
      const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [session.user.email]);
      userId = userRes.rows[0]?.id;
  }

  const attraction = await getAttractionDetail(params.id, userId);
  if (!attraction) return redirect("/");

  const comments = await getComments(params.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-blue-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96 w-full">
            <Image
              src={attraction.image_url || "/placeholder.jpg"}
              alt={attraction.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{attraction.name}</h1>
                <p className="text-lg text-gray-500">{attraction.location}</p>
              </div>
              <div className="flex items-center text-yellow-500 text-2xl font-bold">
                <Star className="w-8 h-8 fill-current mr-2" />
                {attraction.rating || 0}
              </div>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">{attraction.description}</p>

            <div className="flex items-center gap-8 border-t border-b py-6">
              <VoteButtons 
                attractionId={attraction.id} 
                likes={attraction.likes} 
                dislikes={attraction.dislikes} 
                initialVote={attraction.user_vote}
                isLoggedIn={!!session}
              />
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            ความคิดเห็น ({comments.length})
          </h2>

          {session ? (
            <CommentForm attractionId={attraction.id} />
          ) : (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-8">
              กรุณา <Link href="/auth/signin" className="font-bold underline">เข้าสู่ระบบ</Link> เพื่อแสดงความคิดเห็น
            </div>
          )}

          <div className="space-y-6 mt-8">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">{comment.user_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">ยังไม่มีความคิดเห็น มาเป็นคนแรกกันเถอะ!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
