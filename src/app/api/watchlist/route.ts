import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ isAdded: false });
    }

    const { searchParams } = new URL(req.url);
    const malId = searchParams.get("malId");

    if (!malId) {
      return new NextResponse("Missing malId", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ isAdded: false });

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_malId: {
          userId: user.id,
          malId: Number(malId)
        }
      }
    });

    return NextResponse.json({ isAdded: !!existing });
  } catch (error) {
    console.error("Watchlist GET Error:", error);
    return NextResponse.json({ isAdded: false });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const { malId, title, imageUrl, score } = body;

    if (!malId || !title) {
      return new NextResponse("Missing data", { status: 400 });
    }

    // Check if already in watchlist
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_malId: {
          userId: user.id,
          malId: Number(malId)
        }
      }
    });

    if (existing) {
      // Remove from watchlist
      await prisma.watchlist.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: "Yörüngeden çıkarıldı.", isAdded: false });
    }

    // Add to watchlist
    await prisma.watchlist.create({
      data: {
        userId: user.id,
        malId: Number(malId),
        title,
        imageUrl,
        score: score ? Number(score) : null,
      }
    });

    return NextResponse.json({ message: "Yörüngeye eklendi!", isAdded: true });

  } catch (error) {
    console.error("Watchlist POST Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
