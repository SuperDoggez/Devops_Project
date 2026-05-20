"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface VoteButtonsProps {
  attractionId: number;
  likes: number;
  dislikes: number;
  initialVote?: string;
  isLoggedIn: boolean;
}

export function VoteButtons({ attractionId, likes, dislikes, initialVote, isLoggedIn }: VoteButtonsProps) {
  const [vote, setVote] = useState<string | undefined>(initialVote);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const router = useRouter();

  const handleVote = async (type: "like" | "dislike") => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attractionId, type }),
    });

    if (res.ok) {
        // Simple UI update logic
        if (vote === type) {
            setVote(undefined);
            if (type === "like") setLikeCount(prev => prev - 1);
            else setDislikeCount(prev => prev - 1);
        } else {
            if (vote === "like") setLikeCount(prev => prev - 1);
            if (vote === "dislike") setDislikeCount(prev => prev - 1);
            
            setVote(type);
            if (type === "like") setLikeCount(prev => prev + 1);
            else setDislikeCount(prev => prev + 1);
        }
        router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => handleVote("like")}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
          vote === "like" ? "bg-green-100 border-green-500 text-green-700" : "hover:bg-gray-100"
        )}
      >
        <ThumbsUp className={clsx("w-5 h-5", vote === "like" && "fill-current")} />
        <span className="font-bold">{likeCount}</span>
      </button>

      <button
        onClick={() => handleVote("dislike")}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
          vote === "dislike" ? "bg-red-100 border-red-500 text-red-700" : "hover:bg-gray-100"
        )}
      >
        <ThumbsDown className={clsx("w-5 h-5", vote === "dislike" && "fill-current")} />
        <span className="font-bold">{dislikeCount}</span>
      </button>
    </div>
  );
}
