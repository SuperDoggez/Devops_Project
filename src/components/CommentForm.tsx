"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CommentForm({ attractionId }: { attractionId: number }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attractionId, text }),
    });

    if (res.ok) {
      setText("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        required
        placeholder="เพิ่มความคิดเห็นของคุณ..."
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {loading ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </button>
    </form>
  );
}
