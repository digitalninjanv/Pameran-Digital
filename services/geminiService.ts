import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getArtCritique = async (title: string, artist: string, description: string): Promise<string> => {
  if (!API_KEY) {
    return "Layanan analisis AURA saat ini tidak tersedia. Konfigurasi API tidak ditemukan.";
  }

  try {
    const prompt = `Anda adalah AURA (Analis Respon Universal Artistik), seorang kritikus seni AI dengan kepekaan yang mendalam dan gaya bahasa yang puitis. Berikan kritik singkat (2-3 kalimat) untuk karya seni berikut. Fokus pada bagaimana karya tersebut membangkitkan emosi, penggunaan komposisi, warna, dan cahaya. Hindari klise. Sampaikan analisis yang mendalam dan elegan.

Karya Seni: "${title}"
Oleh: ${artist}
Deskripsi Konseptual: "${description}"

Analisis AURA:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating art critique:", error);
    return "AURA mengalami gangguan dalam perenungannya. Analisis tidak dapat diselesaikan.";
  }
};