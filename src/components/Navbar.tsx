"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Compass, Loader2, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { searchAnime, Anime } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        const data = await searchAnime(query, 5);
        setResults(data);
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-lacivert-dark/80 backdrop-blur-md border-b border-lacivert-light/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-neon-blue to-neon-pink flex items-center justify-center text-lacivert-dark shadow-[0_0_15px_rgba(0,255,204,0.3)] group-hover:scale-105 transition-transform">
            <Compass size={24} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xl tracking-wide hidden sm:block">
            Anime<span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-pink">Gravity</span>
          </span>
        </Link>

        {/* Vibe Match Navigation */}
        <Link 
          href="/vibe-match" 
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-pink/10 border border-neon-pink/30 text-neon-pink hover:text-white rounded-full font-medium text-sm transition-all hover:bg-neon-pink/20 hover:shadow-[0_0_15px_rgba(255,0,122,0.3)] ml-4 mr-auto"
        >
          <Sparkles size={16} />
          Vibe Match
        </Link>

        {/* Live Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Seri, film veya karakter ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setShowDropdown(true);
              }}
              onBlur={() => {
                // Delay so that click on result items triggers before hiding
                setTimeout(() => setShowDropdown(false), 200);
              }}
              className="w-full bg-lacivert-base border border-lacivert-light text-foreground pl-12 pr-10 py-3 rounded-full focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all placeholder:text-gray-500"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 text-neon-blue animate-spin" size={18} />
            )}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 p-2 bg-lacivert-base border border-lacivert-light rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-1 overflow-hidden"
              >
                {results.map((anime) => (
                  <Link
                    key={anime.mal_id}
                    href={`/anime/${anime.mal_id}`}
                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-lacivert-light group transition-colors"
                  >
                    <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-lacivert-dark">
                      <Image
                        src={anime.images.webp.small_image_url || anime.images.webp.image_url}
                        alt={anime.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-sm truncate group-hover:text-neon-blue transition-colors">
                        {anime.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {anime.year || "Yıl Bilinmiyor"} <span className="text-lacivert-light mx-1">•</span> ⭐ {anime.score || "N/A"}
                      </span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-4 shrink-0">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-semibold truncate max-w-[100px]">{session.user.name?.split(" ")[0]}</span>
                <span className="text-xs text-neon-blue">Yörüngede</span>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neon-blue/50 cursor-pointer bg-lacivert-base">
                  {session.user.image ? (
                    <Image src={session.user.image} alt="Avatar" width={40} height={40} className="object-cover" />
                  ) : (
                    <UserIcon className="p-2 w-full h-full text-gray-300" />
                  )}
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-lacivert-base border border-lacivert-light rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1">
                  <Link 
                    href="/my-orbit"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors w-full text-left"
                  >
                    <UserIcon size={16} />
                    Yörüngem (Profil)
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-5 py-2 rounded-full font-semibold text-sm bg-lacivert-light hover:bg-white hover:text-lacivert-dark transition-all border border-gray-700 hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hidden sm:block"
            >
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
