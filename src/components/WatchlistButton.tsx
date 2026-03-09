"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookmarkPlus, BookmarkCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface WatchlistButtonProps {
  malId: number;
  title: string;
  imageUrl: string;
  score?: number | null;
}

export default function WatchlistButton({ malId, title, imageUrl, score }: WatchlistButtonProps) {
  const { data: session, status } = useSession();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsLoading(false);
      return;
    }
    
    if (status === "authenticated") {
      fetch(`/api/watchlist?malId=${malId}`)
        .then(res => res.json())
        .then(data => {
          setIsAdded(data.isAdded);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [malId, status]);

  const toggleWatchlist = async () => {
    if (status === "unauthenticated") {
      toast.error("Yörüngeye eklemek için giriş yapmalısın!", {
        style: {
          background: "#1e1e2f",
          color: "#fff",
          border: "1px solid #FF007A"
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ malId, title, imageUrl, score })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsAdded(data.isAdded);
        if (data.isAdded) {
          toast.success("Yörüngene eklendi!", {
            icon: '✨',
            style: { background: "#1e1e2f", color: "#00FFCC", border: "1px solid #00FFCC" }
          });
        } else {
          toast.success("Yörüngenden çıkarıldı.", {
            icon: '🗑️',
            style: { background: "#1e1e2f", color: "#FF007A", border: "1px solid #FF007A" }
          });
        }
      } else {
        toast.error("Bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") return <div className="w-40 h-12 animate-pulse bg-lacivert-light rounded-xl"></div>;

  return (
    <button
      onClick={toggleWatchlist}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
        isAdded 
          ? "bg-neon-pink/10 text-neon-pink border border-neon-pink hover:bg-neon-pink/20 hover:shadow-[0_0_20px_rgba(255,0,122,0.4)]" 
          : "bg-lacivert-base text-gray-300 border border-gray-600 hover:border-white hover:text-white"
      }`}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : isAdded ? (
        <BookmarkCheck size={20} />
      ) : (
        <BookmarkPlus size={20} />
      )}
      {isAdded ? "Yörüngende" : "Yörüngeye Ekle"}
    </button>
  );
}
