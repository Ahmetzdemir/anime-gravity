# 🌌 Anime Gravity

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Google AI](https://img.shields.io/badge/Google_Gemini_AI-enabled-4285F4?style=for-the-badge&logo=google)
![MongoDB](https://img.shields.io/badge/MongoDB-Prisma-47A248?style=for-the-badge&logo=mongodb)

**Kendi yörüngeni keşfet. Yapay zeka destekli kişiselleştirilmiş anime platformu.**

[🚀 Canlı Demo](#) · [🐛 Hata Bildir](https://github.com/Ahmetzdemir/anime-gravity/issues) · [✨ Özellik İste](https://github.com/Ahmetzdemir/anime-gravity/issues)

</div>

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🤖 **Vibe Match** | Google Gemini AI ile kişiliğine göre anime önerisi |
| 🔐 **Kimlik Doğrulama** | NextAuth.js + Google OAuth |
| 📋 **İzleme Listesi** | Favori animelerini kaydet ve yönet |
| 🎯 **Keşif Modu** | Niş ve az bilinen yapımları keşfet |
| ⚡ **Hızlı Yükleme** | Next.js 16 App Router ile optimize edilmiş performans |
| 🐳 **Docker Desteği** | Tek komutla çalıştır |

---

## 🛠️ Teknoloji Yığını

- **Framework:** Next.js 16 (App Router)
- **Dil:** TypeScript 5
- **Stil:** Tailwind CSS v4
- **Yapay Zeka:** Google Gemini AI (`@google/generative-ai`)
- **Auth:** NextAuth.js v5 (Google OAuth)
- **Veritabanı:** MongoDB + Prisma ORM
- **Animasyon:** Framer Motion
- **İkonlar:** Lucide React

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB bağlantı dizesi
- Google Cloud OAuth kimlik bilgileri
- Google Gemini API anahtarı

### 1. Repoyu klonlayın
```bash
git clone https://github.com/Ahmetzdemir/anime-gravity.git
cd anime-gravity
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın
`.env.local` dosyası oluşturun:
```env
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

DATABASE_URL=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key
```

### 4. Prisma'yı ayarlayın
```bash
npx prisma generate
npx prisma db push
```

### 5. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 🐳 Docker ile Çalıştırma

```bash
docker-compose up -d
```

---

## 📁 Proje Yapısı

```
anime-gravity/
├── src/
│   ├── app/
│   │   ├── anime/[id]/     # Anime detay sayfası
│   │   ├── api/            # API route'ları
│   │   │   ├── auth/       # NextAuth handler
│   │   │   ├── vibe/       # AI öneri endpoint'i
│   │   │   └── watchlist/  # İzleme listesi CRUD
│   │   ├── my-orbit/       # Kullanıcı profili
│   │   ├── vibe-match/     # AI eşleştirme sayfası
│   │   └── page.tsx        # Ana sayfa
│   ├── components/         # React bileşenleri
│   ├── lib/                # Yardımcı fonksiyonlar & API
│   └── auth.ts             # NextAuth konfigürasyonu
├── prisma/
│   └── schema.prisma       # Veritabanı şeması
└── docker-compose.yml
```

---

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3. Commit edin (`git commit -m 'feat: harika özellik ekle'`)
4. Push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

---

## 📄 Lisans

MIT © [Ahmetzdemir](https://github.com/Ahmetzdemir)
