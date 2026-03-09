"use client";

import { useState } from "react";
import { getRandomAnime } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RandomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRandomLeap = async () => {
    setIsLoading(true);
    const anime = await getRandomAnime();
    if (anime && anime.mal_id) {
      router.push(`/anime/${anime.mal_id}`);
    } else {
      setIsLoading(false);
      alert("Jikan API şu anda yoğun, daha sonra tekrar deneyin.");
    }
  };

  return (
    <button 
      onClick={handleRandomLeap}
      disabled={isLoading}
      className={`flex justify-center items-center gap-2 border border-neon-pink text-neon-pink px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
        isLoading 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(255,0,122,0.3)]"
      }`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-neon-pink" size={20} />
      ) : (
        "Gravity Leap (Rastgele)"
      )}
    </button>
  );
}
