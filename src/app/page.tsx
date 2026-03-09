import AnimeCard from "@/components/AnimeCard";
import RandomButton from "@/components/RandomButton";
import { getTopAnime } from "@/lib/api";
import { Sparkles, Compass } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const topAnimeList = await getTopAnime(12);

  return (
    <main className="min-h-screen bg-lacivert-dark text-foreground flex flex-col pt-20">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center py-24 px-6 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(0,255,204,0.2)]">
            <Sparkles size={16} />
            Yepyeni Bir Animasyon Deneyimi
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Kendi Yörüngeni
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-pink">
              Keşfet.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
            Sadece popüler olanları değil, kendi zevkine en uygun niş yapımları bulabileceğin kişiselleştirilmiş anime sığınağın.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/vibe-match" className="flex items-center gap-2 bg-neon-blue text-lacivert-dark px-8 py-4 rounded-lg font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,204,0.5)] transition-all duration-300">
              <Sparkles size={20} />
              Vibe Match (Yapay Zeka)
            </Link>
            <RandomButton />
          </div>
        </div>
      </section>

      {/* Top Anime Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 w-full relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-8 bg-neon-blue rounded-full block"></span>
            Popüler Keşifler
          </h2>
        </div>

        {topAnimeList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {topAnimeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-20 text-gray-400 border border-lacivert-light rounded-2xl bg-lacivert-base/50">
            <span className="text-xl mb-2">📡</span>
            <p>API'ye şu an ulaşılamıyor veya veri bulunamadı.</p>
          </div>
        )}
      </section>
    </main>
  );
}
