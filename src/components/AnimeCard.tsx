"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, PlayCircle } from "lucide-react";
import { Anime } from "@/lib/api";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`} className="block">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col overflow-hidden rounded-xl bg-lacivert-light border border-lacivert-light/50 shadow-lg cursor-pointer transition-all hover:border-neon-blue/50 hover:shadow-neon-blue/20"
      >
      {/* Resim Alanı */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-lacivert-dark">
        <Image
          src={anime.images.webp.large_image_url || anime.images.webp.image_url}
          alt={anime.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-lacivert-dark via-lacivert-dark/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Hover İçerik (Sadece Hover Durumunda Görünür) */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-wrap gap-2 mb-3">
            {anime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.mal_id}
                className="rounded-full bg-lacivert-base/80 px-2 py-1 text-xs font-semibold text-neon-blue backdrop-blur-sm border border-neon-blue/20"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="line-clamp-3 text-sm text-gray-300 shadow-black drop-shadow-md">
            {anime.synopsis || "Özet bulunmuyor..."}
          </p>
          
          {anime.trailer?.youtube_id && (
            <div className="mt-4 flex items-center gap-2 text-neon-pink text-sm font-semibold">
              <PlayCircle size={16} />
              <span>Fragmanı İzle</span>
            </div>
          )}
        </div>
      </div>

      {/* Daima Görünür Alt Bilgi */}
      <div className="flex flex-col justify-between flex-1 p-4 bg-lacivert-light relative z-10 border-t border-lacivert-base group-hover:bg-lacivert-base/50 transition-colors">
        <h3 className="line-clamp-2 font-bold text-foreground group-hover:text-neon-blue transition-colors">
          {anime.title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center gap-1 font-mono text-neon-pink">
            <Star size={14} fill="currentColor" />
            {anime.score || "N/A"}
          </span>
          <span>{anime.year || "Bilinmiyor"}</span>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
