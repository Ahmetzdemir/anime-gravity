"use client";

import { useState } from "react";
import AnimeCard from "@/components/AnimeCard";
import { Sparkles, Send, Loader2, Bot } from "lucide-react";
import { Anime } from "@/lib/api";

export default function VibeMatchPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Anime[] | null>(null);

  const handleVibeMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResults(null);

    try {
      // API çağrısını burada simüle edebiliriz ya da gerçek api router'a bağlayacağız
      const response = await fetch("/api/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Vibe Match API failed");
      }

      const data = await response.json();
      if (data.animes) {
        setResults(data.animes);
      }
    } catch (error) {
      console.error(error);
      alert("Anime evrenine bağlanırken bir sorun oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-lacivert-dark text-foreground pt-32 pb-24 flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full px-6 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/30 bg-neon-pink/10 text-neon-pink text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(255,0,122,0.2)]">
            <Sparkles size={16} />
            Yapay Zeka Destekli
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Vibe <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-pink">Matching</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Nasıl hissediyorsun? Veya ne tür bir macera arıyorsun? İçinden geçeni yaz, yapay zeka sana en uygun animeleri bulsun.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVibeMatch} className="w-full max-w-3xl relative mb-16">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-neon-blue to-neon-pink rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center bg-lacivert-base rounded-2xl overflow-hidden border border-lacivert-light p-2">
              <div className="pl-4 text-neon-blue hidden sm:block">
                <Bot size={24} />
              </div>
              <input
                type="text"
                placeholder="Örn: Bugün yağmurlu, kahvemi aldım, sürükleyici ve gizemli bir şeyler izlemek istiyorum..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-4 focus:outline-none disabled:opacity-50 text-base md:text-lg"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="shrink-0 flex items-center justify-center gap-2 bg-linear-to-r from-neon-blue to-neon-pink text-lacivert-dark font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} />
                    <span className="hidden sm:inline">Gönder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Results Area */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-neon-blue space-y-4">
            <Loader2 className="animate-spin w-12 h-12" />
            <p className="animate-pulse font-medium">Yapay zeka analiz ediyor ve veriler eşleştiriliyor...</p>
          </div>
        )}

        {!isLoading && results && results.length > 0 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-2 h-6 bg-neon-pink rounded-full block"></span>
                Ruh Haline Uygun Eşleşmeler
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && results && results.length === 0 && (
          <div className="text-center py-20 text-gray-400 border border-lacivert-light rounded-2xl bg-lacivert-base w-full">
            <Sparkles size={32} className="mx-auto mb-4 opacity-50" />
            <p>Ruh halinize uygun anime bulunamadı. Belki farklı kelimelerle tarif etmelisiniz?</p>
          </div>
        )}
      </div>
    </main>
  );
}
