import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "GEMINI_API_KEY nicht konfiguriert." }, { status: 500 });
  }

  const { requirementId, title, description } = await req.json();
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const prompt = `Erkläre mir die Anforderung ${requirementId} ("${title}") des IFS Food v8 Standards.
      Die Beschreibung lautet: ${description}

      Was wird hier konkret von einem Unternehmen erwartet? Gib praktische Beispiele für die Umsetzung und Dokumentation.
      Antwort auf Deutsch, professionell und hilfreich für einen Qualitätsmanager. Benutze Markdown für die Formatierung.`;

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
    return Response.json({ error: "Fehler beim Abrufen der Erklärung." }, { status: 500 });
  }
}
