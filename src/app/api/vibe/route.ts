import { NextResponse } from "next/server";
import { searchAnime } from "@/lib/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Lütfen bir ruh hali belirtin." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Sunucuda GEMINI_API_KEY bulunamadı. Lütfen .env.local dosyanıza API anahtarını ekleyin ve projeyi yeniden başlatın." },
        { status: 500 }
      );
    }

    // Initialize Gemini (using gemini-2.5-flash as the fast multimodal model)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Neural Link: Retrieve User History
    const session = await auth();
    let userContext = "";
    let userId = null;

    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { vibeHistories: { orderBy: { createdAt: "desc" }, take: 5 } }
      });

      if (dbUser) {
        userId = dbUser.id;
        if (dbUser.vibeHistories.length > 0) {
          const pastPrompts = dbUser.vibeHistories.map(h => h.prompt).join(", ");
          userContext = `\n[Sistem Notu - Neural Link Aktif: Kullanıcının son aradığı ruh halleri şu şekilde: ${pastPrompts}. Bu geçmiş bilgisini yeni önerilerin için ilham almak veya kaçınmak üzere zekice kullanabilirsin. Ancak her zaman kullanıcının "ŞU ANKİ GİRDİSİNE" en yüksek önceliği ver.]\n`;
        }
      }
    }

    // Prompt Engineering
    const systemPrompt = `
Sen "Anime Gravity" isimli modern ve cyberpunk temalı bir web sitesinin arka planındaki zeki anime önerme asistanısın. 
Kullanıcının girdiği ruh haline, duruma veya aradığı atmosfere tam olarak uyan en iyi 4 animeyi bulmalısın.

Kullanıcının girdisi: "${prompt}"

Kural 1: SADECE animelerin orijinal ve en bilinen İngilizce/Romaji isimlerini virgülle ayırarak ver. (Örn: Cyberpunk: Edgerunners, Steins;Gate, Serial Experiments Lain, Psycho-Pass)
Kural 2: Başka hiçbir açıklama, madde işareti, numaralandırma, tırnak veya onaylama kelimesi YAZMA.
Kural 3: MyAnimeList (Jikan API) aramalarında en iyi sonucu verecek kesin isimleri seç. Tam olarak 4 anime ver.${userContext}
`;

    console.log(`[Gemini] İstek gönderiliyor... Prompt: "${prompt}"`);
    const result = await model.generateContent(systemPrompt);
    const aiResponseText = result.response.text();
    console.log(`[Gemini] Saf Yanıt:`, aiResponseText);

    // Extract names from comma separated response
    const animeNames = aiResponseText.split(',').map(name => name.trim()).filter(Boolean);

    // Fetch the detailed info from Jikan API by searching each name and picking the top match
    const searchPromises = animeNames.map((name) => searchAnime(name, 1));
    const searchResults = await Promise.all(searchPromises);
    
    // Extract the first anime object from each search result
    const animes = searchResults.map(res => res[0]).filter(Boolean);

    // Save VibeHistory to MongoDB
    if (userId) {
      await prisma.vibeHistory.create({
        data: {
          userId,
          prompt,
          resultIds: animes.map(a => Number(a.mal_id))
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Gemini'nin senin için bulduğu yörüngeler hazır!`,
      animes 
    });

  } catch (error) {
    console.error("Vibe API Error:", error);
    return NextResponse.json({ error: "Gemini AI ile bağlantı kurulamadı. API limitlerine takılmış olabilirsiniz." }, { status: 500 });
  }
}
