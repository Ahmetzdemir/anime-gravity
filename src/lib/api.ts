// src/lib/api.ts

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// Jikan API Rate Limiting: 3 requests per second, 60 requests per minute.
// We should implement basic error handling for 429 Too Many Requests down the line.

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
      small_image_url: string;
    };
  };
  synopsis: string;
  score: number;
  genres: Array<{ mal_id: number; name: string }>;
  year: number;
  episodes: number;
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export async function getTopAnime(limit: number = 24): Promise<Anime[]> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?limit=${limit}`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
}

export async function getRandomAnime(): Promise<Anime | null> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/random/anime`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Anime> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return null;
  }
}

export async function searchAnime(query: string, limit: number = 10): Promise<Anime[]> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Anime[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
}

export async function getAnimeById(id: number | string): Promise<Anime | null> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Anime> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime ${id}:`, error);
    return null;
  }
}
