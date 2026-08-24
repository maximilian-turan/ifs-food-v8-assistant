
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Anthropic from "@anthropic-ai/sdk";
import { IFS_CHAPTERS } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json({ limit: "25mb" }));

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  });

  function claudeErrorMessage(error: unknown, fallback: string): string {
    console.error("Claude Error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return "Claude API Fehler: Zugriff verweigert oder Key ungültig. Bitte prüfe den Schlüssel unter 'Settings > Secrets'.";
    }
    return fallback;
  }

  function firstTextBlock(content: Anthropic.ContentBlock[]): string {
    const block = content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return block?.text || "";
  }

  // API routes
  app.post("/api/explain", async (req, res) => {
    const { requirementId, title, description } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "IFS Experte Hinweis: Bitte hinterlegen Sie Ihren 'ANTHROPIC_API_KEY' oben rechts unter 'Settings' (Zahnrad ⚙️) -> 'Secrets' -> 'Add Secret'. Solange kein Key hinterlegt ist, stehen nur für ausgewählte Anforderungen (wie KO-Kriterien) statische Interpretationshilfen zur Verfügung." });
    }

    try {
      const prompt = `Erkläre mir die Anforderung ${requirementId} ("${title}") des IFS Food v8 Standards.
        Die Beschreibung lautet: ${description}

        Was wird hier konkret von einem Unternehmen erwartet? Gib praktische Beispiele für die Umsetzung und Dokumentation.
        Antwort auf Deutsch, professionell und hilfreich für einen Qualitätsmanager. Benutze Markdown für die Formatierung.`;

      const response = await anthropic.messages.create({
        model: "claude-opus-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      res.json({ text: firstTextBlock(response.content) });
    } catch (error) {
      res.status(500).json({ error: claudeErrorMessage(error, "Fehler beim Abrufen der Erklärung. Bitte versuchen Sie es in Kürze erneut.") });
    }
  });

  app.post("/api/advice", async (req, res) => {
    const { findings } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Berater Hinweis: Bitte hinterlegen Sie Ihren 'ANTHROPIC_API_KEY' oben rechts unter 'Settings' (Zahnrad ⚙️) -> 'Secrets' -> 'Add Secret', um die KI-Beratung zu nutzen." });
    }

    try {
      const prompt = `Ich habe folgende Feststellungen bei einem IFS Food v8 Audit gemacht:
        "${findings}"

        Wie würdest du diese Abweichung bewerten (A, B, C, D, Major, KO)?
        Welche Korrekturmaßnahmen schlägst du vor?
        Antwort auf Deutsch. Benutze Markdown.`;

      const response = await anthropic.messages.create({
        model: "claude-opus-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      res.json({ text: firstTextBlock(response.content) });
    } catch (error) {
      res.status(500).json({ error: claudeErrorMessage(error, "Fehler beim Abrufen der Beratung.") });
    }
  });

  app.post("/api/walkthrough-analysis", async (req, res) => {
    const { area, topics, images } = req.body as {
      area: string;
      topics: string[];
      images: { data: string; mediaType: "image/jpeg" }[];
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Foto-Analyse Hinweis: Bitte hinterlegen Sie Ihren 'ANTHROPIC_API_KEY' oben rechts unter 'Settings' (Zahnrad ⚙️) -> 'Secrets' -> 'Add Secret', um die KI-Fotoanalyse zu nutzen." });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "Keine Fotos übermittelt." });
    }

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
        max_tokens: 4096,
        messages: [{ role: "user", content }],
      });

      res.json({ text: firstTextBlock(response.content) });
    } catch (error) {
      res.status(500).json({ error: claudeErrorMessage(error, "Fehler bei der Fotoanalyse. Bitte versuchen Sie es in Kürze erneut.") });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
