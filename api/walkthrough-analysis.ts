import Anthropic from "@anthropic-ai/sdk";
import { IFS_CHAPTERS } from "../src/types";

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert." }, { status: 500 });
  }

  const { area, topics, images } = await req.json() as {
    area: string;
    topics: string[];
    images: { data: string; mediaType: "image/jpeg" }[];
  };

  if (!images || images.length === 0) {
    return Response.json({ error: "Keine Fotos übermittelt." }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const chapterContext = IFS_CHAPTERS.map(c => `Kapitel ${c.id}: ${c.title} — ${c.description}`).join("\n");

    const prompt = `Du bist ein erfahrener IFS Food v8 Auditor. Ein Nutzer hat gerade eine Betriebsbegehung im Bereich "${area}" durchgeführt (Themen: ${topics.length ? topics.join(", ") : "keine Angabe"}) und folgende Fotos aufgenommen.

IFS Food v8 Kapitelstruktur zur Orientierung:
${chapterContext}

Analysiere die Fotos und beschreibe:
1. Was ist auf den Fotos zu sehen (kurz)?
2. Welche Punkte sind bezüglich IFS Food v8 auffällig — was fehlt, was ist nicht konform, was sollte verbessert werden? Beziehe dich wo möglich auf das passende IFS-Kapitel.
3. Was sollte konkret getan werden?

Antworte auf Deutsch, als zusammenhängender Freitext-Bericht (kein JSON), professionell und praxisnah für einen Qualitätsmanager. Falls nichts Auffälliges zu erkennen ist, sag das auch klar.`;

    const content: Anthropic.ContentBlockParam[] = images.map((img): Anthropic.ImageBlockParam => ({
      type: "image",
      source: { type: "base64", media_type: img.mediaType, data: img.data },
    }));
    content.push({ type: "text", text: prompt });

    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return Response.json({ text: textBlock?.text || "" });
  } catch (error) {
    console.error("Claude Error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler bei der Fotoanalyse." }, { status: 500 });
  }
}
