import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "GEMINI_API_KEY nicht konfiguriert." }, { status: 500 });
  }

  const { findings } = await req.json();
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const prompt = `Ich habe folgende Feststellungen bei einem IFS Food v8 Audit gemacht:
      "${findings}"

      Wie würdest du diese Abweichung bewerten (A, B, C, D, Major, KO)?
      Welche Korrekturmaßnahmen schlägst du vor?
      Antwort auf Deutsch. Benutze Markdown.`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return Response.json({ text: response.text });
  } catch (error: any) {
    const msg = error?.message || "";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("API_KEY_INVALID") || msg.includes("403")) {
      return Response.json({ error: "Gemini API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler beim Abrufen der Beratung." }, { status: 500 });
  }
}
