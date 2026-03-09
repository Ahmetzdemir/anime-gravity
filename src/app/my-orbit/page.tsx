import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Star, Sparkles } from "lucide-react";

export default async function MyOrbitPage() {
  const session = await auth();

  // If the user isn't logged in, redirect them to the home page or a login prompt
  if (!session?.user?.email) {
    redirect("/");
  }

  // Fetch the user along with their Watchlist entries
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      watchlists: {
        orderBy: { createdAt: "desc" },
      },
      vibeHistories: {
        orderBy: { createdAt: "desc" },
        take: 3, // Show last 3 vibes for now
      }
    },
  });

  if (!user) {
    return <div className="min-h-screen text-center pt-32 text-white">Yörünge bulunamadı.</div>;
  }

  return (
    <main className="min-h-screen bg-lacivert-dark text-foreground pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-16 bg-lacivert-base border border-lacivert-light rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-neon-blue to-neon-pink"></div>
          
          <div className="w-24 h-24 shrink-0 rounded-full border-4 border-lacivert-dark overflow-hidden bg-lacivert-dark relative">
            <Image 
              src={session.user.image || "/placeholder.jpg"} 
              alt={session.user.name || "User Avatar"} 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-2">{session.user.name}</h1>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
              Yörüngede Aktif
            </p>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="text-center">
              <span className="block text-2xl font-bold font-mono text-neon-pink">{user.watchlists.length}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Kayıtlı</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold font-mono text-neon-blue">{user.vibeHistories.length}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Vibe Sorgusu</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Columns */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Watchlist Section */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Bookmark className="text-neon-pink" size={24} />
              Kişisel Yörüngem (İzleme Listesi)
            </h2>

            {user.watchlists.length === 0 ? (
              <div className="bg-lacivert-base border border-lacivert-light rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <Bookmark className="text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-300 mb-2">Yörüngede Hiç Anime Yok!</h3>
                <p className="text-gray-500 max-w-sm mb-6">Etrafta dolaşıp ilgini çeken animeleri yörüngene eklemeye başla.</p>
                <Link href="/" className="px-6 py-3 rounded-full bg-neon-pink/10 text-neon-pink border border-neon-pink/50 hover:bg-neon-pink hover:text-white transition-all font-semibold">
                  Keşfetmeye Başla
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {user.watchlists.map((entry) => (
                  <Link 
                    href={`/anime/${entry.malId}`} 
                    key={entry.malId}
                    className="group relative rounded-2xl overflow-hidden aspect-3/4 bg-lacivert-base border border-lacivert-light hover:border-neon-pink transition-colors"
                  >
                    {entry.imageUrl ? (
                      <Image 
                        src={entry.imageUrl} 
                        alt={entry.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lacivert-dark">Görsel Yok</div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-neon-pink transition-colors">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-xs font-mono text-gray-300">
                        <Star size={12} className="text-neon-blue" />
                        {entry.score || "N/A"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Vibe History (Neural Link Memory) Section */}
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="text-neon-blue" size={24} />
              Geçmiş Vibe Aramaları
            </h2>
            <div className="flex flex-col gap-4">
              {user.vibeHistories.length === 0 ? (
                <div className="bg-lacivert-base border border-lacivert-light rounded-xl p-6 text-center text-gray-500">
                  <p>Henüz AI asistanı ile konuşmadın.</p>
                  <Link href="/vibe-match" className="text-neon-blue font-semibold mt-2 inline-block hover:underline">
                    Vibe Match'i Dene
                  </Link>
                </div>
              ) : (
                user.vibeHistories.map(vibe => (
                  <div key={vibe.id} className="bg-lacivert-base border border-lacivert-light rounded-xl p-5 hover:border-neon-blue/50 transition-colors">
                    <p className="text-sm italic text-gray-300 mb-3 border-l-2 border-neon-blue pl-3">"{vibe.prompt}"</p>
                    <div className="text-xs text-gray-500 flex justify-between items-center">
                      <span>{vibe.createdAt.toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
