
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json());

  // Initialize Gemini client with user-agent
  const genAI = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API routes
  app.post("/api/explain", async (req, res) => {
    const { requirementId, title, description } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "IFS Experte Hinweis: Bitte hinterlegen Sie Ihren 'GEMINI_API_KEY' oben rechts unter 'Settings' (Zahnrad ⚙️) -> 'Secrets' -> 'Add Secret'. Solange kein Key hinterlegt ist, stehen nur für ausgewählte Anforderungen (wie KO-Kriterien) statische Interpretationshilfen zur Verfügung." });
    }

    try {
      const prompt = `Erkläre mir die Anforderung ${requirementId} ("${title}") des IFS Food v8 Standards. 
        Die Beschreibung lautet: ${description}
        
        Was wird hier konkret von einem Unternehmen erwartet? Gib praktische Beispiele für die Umsetzung und Dokumentation.
        Antwort auf Deutsch, professionell und hilfreich für einen Qualitätsmanager. Benutze Markdown für die Formatierung.`;

      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorMessage = error?.message || "";
      if (errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("403")) {
        res.status(500).json({ error: "Gemini API Fehler: Zugriff verweigert oder Key ungültig. Bitte prüfe den Schlüssel unter 'Settings > Secrets'." });
      } else {
        res.status(500).json({ error: "Fehler beim Abrufen der Erklärung. Bitte versuchen Sie es in Kürze erneut." });
      }
    }
  });

  app.post("/api/advice", async (req, res) => {
    const { findings } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Berater Hinweis: Bitte hinterlegen Sie Ihren 'GEMINI_API_KEY' oben rechts unter 'Settings' (Zahnrad ⚙️) -> 'Secrets' -> 'Add Secret', um die KI-Beratung zu nutzen." });
    }
    
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

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorMessage = error?.message || "";
      if (errorMessage.includes("PERMISSION_DENIED") || errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("403")) {
        res.status(500).json({ error: "Gemini API Fehler: Zugriff verweigert oder Key ungültig. Bitte prüfe den Schlüssel unter 'Settings > Secrets'." });
      } else {
        res.status(500).json({ error: "Fehler beim Abrufen der Beratung." });
      }
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
