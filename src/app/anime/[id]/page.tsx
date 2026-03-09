import { getAnimeById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Film, MonitorPlay } from "lucide-react";
import { notFound } from "next/navigation";
import WatchlistButton from "@/components/WatchlistButton";

interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;
  const anime = await getAnimeById(id);

  if (!anime) {
    return notFound();
  }

  const imageUrl = anime.images.webp.large_image_url || anime.images.webp.image_url;

  return (
    <main className="min-h-screen bg-lacivert-dark text-foreground pb-24">
      {/* Dynamic Background Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 transform scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-lacivert-dark via-lacivert-dark/80 to-transparent" />
        
        {/* Nav / Back Button */}
        <div className="absolute top-0 left-0 w-full p-6 z-20 max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-300 hover:text-neon-blue transition-colors px-4 py-2 rounded-full bg-lacivert-base/50 backdrop-blur-md border border-white/5"
          >
            <ArrowLeft size={18} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 -mt-32 md:-mt-48 flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Poster Image */}
        <div className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0 shrink-0">
          <div className="bg-lacivert-base p-2 rounded-2xl border border-lacivert-light shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={anime.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-4 bg-lacivert-base rounded-xl p-4 border border-lacivert-light">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                <Star size={12} className="text-neon-pink" /> 
                Skor
              </span>
              <span className="text-2xl font-bold font-mono text-neon-blue">{anime.score || "N/A"}</span>
            </div>
            <div className="w-px h-10 bg-lacivert-light" />
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                <Film size={12} className="text-neon-blue" />
                Yıl
              </span>
              <span className="text-2xl font-bold font-mono text-foreground">{anime.year || "N/A"}</span>
            </div>
             <div className="w-px h-10 bg-lacivert-light" />
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                <MonitorPlay size={12} className="text-neon-pink" />
                Bölüm
              </span>
              <span className="text-2xl font-bold font-mono text-foreground">{anime.episodes || "?"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Trailer */}
        <div className="flex-1 flex flex-col pt-4 md:pt-[10%]">
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres.map((genre) => (
              <span
                key={genre.mal_id}
                className="rounded-md bg-neon-blue/10 px-3 py-1 text-sm font-medium text-neon-blue border border-neon-blue/20"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            {anime.title}
          </h1>

          <div className="mb-8">
            <WatchlistButton 
              malId={anime.mal_id} 
              title={anime.title} 
              imageUrl={imageUrl} 
              score={anime.score} 
            />
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-lg text-gray-300 leading-relaxed">
              {anime.synopsis || "Bu serinin henüz detaylı bir özeti bulunmuyor..."}
            </p>
          </div>

          {anime.trailer?.embed_url && (
            <div className="mt-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-neon-pink rounded-full block"></span>
                Ön İzleme (Fragman)
              </h2>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-lacivert-light bg-black">
                <iframe
                  src={anime.trailer.embed_url}
                  title={`${anime.title} Trailer`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
