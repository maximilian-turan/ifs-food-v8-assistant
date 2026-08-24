# Betriebsbegehung Foto-Analyse (Claude Vision) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the app's AI features from Gemini to Claude, and add a photo-upload + Claude-vision-analysis flow to the (currently mock-only) "Begehungen" (walkthroughs) module, persisting everything in Supabase.

**Architecture:** `server.ts` (Express, used by `npm run dev` locally) exposes three `POST` JSON endpoints backed by the Anthropic SDK (`claude-opus-5`): the two existing `/api/explain` and `/api/advice` (migrated from Gemini) and a new `/api/walkthrough-analysis` (vision). **This project also deploys to Vercel** (`vercel.json` present) with a *separate, parallel* implementation of the same two existing endpoints as Vercel Serverless Functions under `api/explain.ts` and `api/advice.ts` (Web Fetch `Request`/`Response` handlers, not Express) — these currently also import `@google/genai` and must be migrated too, and a new `api/walkthrough-analysis.ts` must be added alongside them so the photo-analysis feature works in the Vercel-deployed production build, not just local dev. The frontend's `src/services/ai.ts` (renamed from `gemini.ts`) wraps all three logical operations with fetch calls — from the browser's perspective there is one `/api/*` surface; which backend (`server.ts` locally vs `api/*.ts` on Vercel) serves it is a deployment-time concern the frontend doesn't need to know about. `Walkthroughs.tsx` becomes self-contained: it loads/saves directly against Supabase (table `walkthroughs`, storage bucket `walkthrough-photos`), the same way `Dashboard`'s parent (`App.tsx`) does for audits — except Walkthroughs owns its own data instead of routing through `App.tsx`, since it has no cross-cutting state dependency on the audit editor.

**Plan amendment (discovered during Task 1 review):** the original plan only accounted for `server.ts` and missed the parallel `api/*.ts` Vercel functions. Task 3 below now covers both.

**Tech Stack:** React 19 + Vite + Express (existing), `@anthropic-ai/sdk` (new), Supabase JS client + Storage (existing pattern), Tailwind (existing).

**No test framework exists in this project** (`npm run lint` = `tsc --noEmit` is the only automated check). Per the approved spec, verification is manual: `tsc --noEmit` after each code change, plus browser/curl checks — the same approach already used successfully earlier in this session (Playwright via a headless Chromium binary, `chromium-1234`, launched directly since `chromium-cli` isn't installed).

---

### Task 1: Swap the Gemini SDK dependency for the Anthropic SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Uninstall Gemini SDK, install Anthropic SDK**

Run:
```bash
cd /Users/maximilianturan/.config/superpowers/worktrees/ifs-food-v8-assistant/walkthrough-photo-analysis
npm uninstall @google/genai
npm install @anthropic-ai/sdk@^0.120.0
```

Expected: `package.json` now lists `"@anthropic-ai/sdk": "^0.120.0"` under `dependencies` and no longer lists `@google/genai`. `package-lock.json` and `node_modules/@anthropic-ai` are updated accordingly.

- [ ] **Step 2: Verify**

Run: `grep -n "genai\|anthropic" package.json`
Expected: only `"@anthropic-ai/sdk": "^0.120.0"` appears; no `@google/genai` line.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Replace Gemini SDK with Anthropic SDK dependency"
```

---

### Task 2: Point env var docs at ANTHROPIC_API_KEY instead of GEMINI_API_KEY

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Edit `.env.example`**

Current content:
```
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

Replace with:
```
# ANTHROPIC_API_KEY: Required for Claude AI API calls (explanations, advice, photo analysis).
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
ANTHROPIC_API_KEY="MY_ANTHROPIC_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "Point env var docs at ANTHROPIC_API_KEY"
```

(Note: `.env` itself currently has no Gemini key set — nothing to migrate there. The user will add `ANTHROPIC_API_KEY=...` to `.env` themselves.)

---

### Task 3: Migrate server.ts and the Vercel api/*.ts functions to Claude, add photo-analysis to both

**Files:**
- Modify: `server.ts` (full rewrite of AI-related sections) — used by `npm run dev` locally
- Modify: `api/explain.ts` (full rewrite) — used when deployed to Vercel
- Modify: `api/advice.ts` (full rewrite) — used when deployed to Vercel
- Create: `api/walkthrough-analysis.ts` — used when deployed to Vercel

This project deploys to Vercel (see `vercel.json`), which routes `/api/*` requests to the matching file under `api/` as a standalone serverless function — **not** through `server.ts` (that file only runs the local Express dev server via `npm run dev`). Both code paths currently call Gemini and must be migrated together, or the feature will work locally but break (or stay on Gemini) once deployed.

- [ ] **Step 1: Replace the entire content of `server.ts`**

Replace all of `server.ts` with:

```typescript

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
```

Note: `express.json({ limit: "25mb" })` replaces the previous default 100kb body limit — necessary because a walkthrough with several resized (~1568px) JPEG photos as base64 can exceed the default.

- [ ] **Step 2: Replace the entire content of `api/explain.ts`**

Current content uses `GoogleGenAI` with the Web Fetch `Request`/`Response` handler shape (Vercel function convention — different from Express, no `req.body`/`res.json`). Replace all of `api/explain.ts` with:

```typescript
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert." }, { status: 500 });
  }

  const { requirementId, title, description } = await req.json();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return Response.json({ text: textBlock?.text || "" });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler beim Abrufen der Erklärung." }, { status: 500 });
  }
}
```

- [ ] **Step 3: Replace the entire content of `api/advice.ts`**

Replace all of `api/advice.ts` with:

```typescript
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert." }, { status: 500 });
  }

  const { findings } = await req.json();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return Response.json({ text: textBlock?.text || "" });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler beim Abrufen der Beratung." }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create `api/walkthrough-analysis.ts`**

Same logic as the `server.ts` `/api/walkthrough-analysis` route (Step 1 above), ported to the Vercel handler shape:

```typescript
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
      max_tokens: 4096,
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return Response.json({ text: textBlock?.text || "" });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler bei der Fotoanalyse." }, { status: 500 });
  }
}
```

Known limitation, not solved here (out of scope — note it in the final report): Vercel Serverless Functions have a request body size limit (platform-dependent, historically ~4.5MB). Several resized (~1568px) JPEG photos as base64 in one request could approach this on the Vercel deployment even though the local Express server (`server.ts`, `limit: "25mb"`) has more headroom. If this becomes a problem in practice, the fix is capping the number of photos per analysis or switching to individual per-photo requests — not needed now.

- [ ] **Step 5: Typecheck**

Run: `npm run lint` (from the worktree root)
Expected: no errors related to `server.ts`, `api/explain.ts`, `api/advice.ts`, or `api/walkthrough-analysis.ts`. (Errors from files not yet touched by this plan, e.g. `Walkthroughs.tsx` referencing `photoPaths`, are expected until later tasks — ignore those for now. The pre-existing `src/lib/supabase.ts` `ImportMeta.env` errors are also expected — pre-existing baseline noise, unrelated to this plan.)

- [ ] **Step 6: Commit**

```bash
git add server.ts api/explain.ts api/advice.ts api/walkthrough-analysis.ts
git commit -m "Migrate AI endpoints (server.ts and Vercel api/*.ts) from Gemini to Claude, add walkthrough-analysis endpoint to both"
```

---

### Task 4: Rename gemini.ts to ai.ts and migrate its error text; add analyzeWalkthroughPhotos

**Files:**
- Rename: `src/services/gemini.ts` → `src/services/ai.ts`

- [ ] **Step 1: Rename the file**

```bash
cd /Users/maximilianturan/.config/superpowers/worktrees/ifs-food-v8-assistant/walkthrough-photo-analysis
git mv src/services/gemini.ts src/services/ai.ts
```

- [ ] **Step 2: Replace its content**

Replace all of `src/services/ai.ts` with:

```typescript

import { STATIC_INTERPRETATIONS } from "../interpretations";

export async function getRequirementExplanation(requirementId: string, title: string, description: string) {
  const cleanId = requirementId.trim();
  console.log("Looking up interpretation for ID:", cleanId);

  // Check for static fallback first (for KO criteria)
  if (STATIC_INTERPRETATIONS[cleanId]) {
    console.log("Found static interpretation for:", cleanId);
    return STATIC_INTERPRETATIONS[cleanId];
  }

  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requirementId, title, description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch explanation");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Fetch Error:", error);
    // Provide a more helpful generic message if API fails
    return "💡 **Hinweis:** Die KI-Erklärung ist derzeit nicht verfügbar, da der Claude API Key nicht konfiguriert ist (siehe 'Settings > Secrets').\n\n**Anforderungstext:** " + description;
  }
}

export async function getAuditAdvice(findings: string) {
  try {
    const response = await fetch("/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ findings }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch advice");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Fehler beim Abrufen der Beratung.";
  }
}

export interface WalkthroughPhoto {
  data: string; // base64, no data: URL prefix
  mediaType: "image/jpeg";
}

export async function analyzeWalkthroughPhotos(area: string, topics: string[], images: WalkthroughPhoto[]) {
  const response = await fetch("/api/walkthrough-analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ area, topics, images }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Fehler bei der Fotoanalyse.");
  }

  const data = await response.json();
  return data.text as string;
}
```

Note: `analyzeWalkthroughPhotos` throws on failure (unlike the other two, which swallow errors into a fallback string) — the caller (`Walkthroughs.tsx`, Task 11) needs to distinguish "analysis failed" from "analysis succeeded with this text" so it can show an error instead of overwriting the findings field with an error string.

- [ ] **Step 3: Commit**

```bash
git add src/services/ai.ts
git commit -m "Rename AI service to ai.ts, migrate error text to Claude, add photo analysis"
```

---

### Task 5: Update App.tsx's import of the renamed service

**Files:**
- Modify: `src/App.tsx:36`

- [ ] **Step 1: Edit the import**

Change:
```typescript
import { getRequirementExplanation } from './services/gemini';
```
to:
```typescript
import { getRequirementExplanation } from './services/ai';
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: no errors about `./services/gemini` or `./services/ai`.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "Update App.tsx import for renamed ai service"
```

---

### Task 6: Verify the AI provider migration

**Files:** none (verification only)

- [ ] **Step 1: Start the worktree's dev server on a separate port**

The main repo (not this worktree) may already have its own `npm run dev` running on port 3001 — do NOT kill port 3001 or touch anything outside this worktree. Use port 3002 for this worktree instead:

```bash
cd /Users/maximilianturan/.config/superpowers/worktrees/ifs-food-v8-assistant/walkthrough-photo-analysis
lsof -ti:3002 -sTCP:LISTEN | xargs -r kill
PORT=3002 npm run dev
```
(Run in background; wait for `Server running on http://localhost:3002` in its output before continuing.)

- [ ] **Step 2: Confirm the server no longer references Gemini**

Run: `curl -s -X POST http://localhost:3002/api/explain -H "Content-Type: application/json" -d '{"requirementId":"1.1.1","title":"Test","description":"Test"}'`

Expected (no `ANTHROPIC_API_KEY` set yet, since the user will add it later): HTTP 500 body containing `"ANTHROPIC_API_KEY"`, NOT `"GEMINI_API_KEY"`.

- [ ] **Step 3: If a real ANTHROPIC_API_KEY is available, re-run with it set**

If the user has added `ANTHROPIC_API_KEY` to `.env` by this point, restart the dev server and re-run the same `curl` command — expect HTTP 200 with a non-empty German `text` field explaining IFS requirement 1.1.1. If no key is available yet, skip this step and note it in the final report — this is expected per the approved spec (feature ships, key added later by the user).

- [ ] **Step 4: No commit** (verification only, no file changes)

---

### Task 7: Add photoPaths to IFSWalkthrough and a mapWalkthrough helper

**Files:**
- Modify: `src/types.ts:57-69`
- Modify: `src/lib/supabase.ts`

- [ ] **Step 1: Extend the `IFSWalkthrough` interface**

In `src/types.ts`, change:
```typescript
export interface IFSWalkthrough {
  id: string;
  area: string;
  date: string;
  shift: 'Früh' | 'Spät' | 'Nacht';
  auditor: string;
  topics: string[];
  findings: string;
  actionRequired: boolean;
  actionDetails?: string;
  responsible?: string;
  deadline?: string;
}
```
to:
```typescript
export interface IFSWalkthrough {
  id: string;
  area: string;
  date: string;
  shift: 'Früh' | 'Spät' | 'Nacht';
  auditor: string;
  topics: string[];
  findings: string;
  actionRequired: boolean;
  actionDetails?: string;
  responsible?: string;
  deadline?: string;
  photoPaths: string[];
}
```

- [ ] **Step 2: Add `mapWalkthrough` to `src/lib/supabase.ts`**

Current full file content:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const mapAudit = (row: any) => ({
  id: row.id,
  companyName: row.company_name,
  auditorName: row.auditor_name,
  date: row.date,
  status: row.status,
  ownerId: row.owner_id,
});
```

Append at the end of the file:
```typescript

export const mapWalkthrough = (row: any) => ({
  id: row.id,
  area: row.area,
  date: row.date,
  shift: row.shift,
  auditor: row.auditor,
  topics: row.topics || [],
  findings: row.findings || '',
  actionRequired: row.action_required,
  actionDetails: row.action_details || '',
  responsible: row.responsible || '',
  deadline: row.deadline || undefined,
  photoPaths: row.photo_paths || [],
});
```

- [ ] **Step 3: Typecheck**

Run: `npm run lint`
Expected: no new errors (existing `Walkthroughs.tsx` still uses its own local `MOCK_WALKTHROUGHS: IFSWalkthrough[]` without `photoPaths` — this WILL now fail to typecheck. That's expected and gets fixed in Task 11; confirm the only new error is in `Walkthroughs.tsx` about missing `photoPaths`).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/lib/supabase.ts
git commit -m "Add photoPaths to IFSWalkthrough and mapWalkthrough helper"
```

---

### Task 8: Add the client-side image resize helper

**Files:**
- Create: `src/lib/imageResize.ts`

- [ ] **Step 1: Write the file**

```typescript

export interface ResizedImage {
  base64: string; // no data: URL prefix
  mediaType: "image/jpeg";
}

export async function resizeImageFile(file: File, maxDim = 1568): Promise<ResizedImage> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${file.name}`));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D Context nicht verfügbar');
  ctx.drawImage(img, 0, 0, width, height);

  const outputDataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const base64 = outputDataUrl.split(',')[1];
  return { base64, mediaType: 'image/jpeg' };
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: no errors in `src/lib/imageResize.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/imageResize.ts
git commit -m "Add client-side image resize helper for photo uploads"
```

---

### Task 9: Create the walkthroughs table in Supabase

**Files:** none (Supabase migration, applied via MCP tool, not a repo file)

- [ ] **Step 1: Apply the migration**

Use the `mcp__claude_ai_Supabase__apply_migration` tool with `project_id: "ndkihnroxpcqvpzkrpwj"`, `name: "create_walkthroughs_table"`, and this `query`:

```sql
create table walkthroughs (
  id text primary key,
  owner_id text not null default 'local-user',
  area text not null,
  date timestamptz not null default now(),
  shift text not null default 'Früh',
  auditor text not null default '',
  topics text[] not null default '{}',
  findings text not null default '',
  action_required boolean not null default false,
  action_details text not null default '',
  responsible text not null default '',
  deadline date,
  photo_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table walkthroughs enable row level security;

create policy "owner_walkthroughs" on walkthroughs
  for all
  using (owner_id = 'local-user')
  with check (owner_id = 'local-user');
```

- [ ] **Step 2: Verify**

Use `mcp__claude_ai_Supabase__execute_sql` with `project_id: "ndkihnroxpcqvpzkrpwj"` and query:
```sql
select column_name, data_type from information_schema.columns where table_name = 'walkthroughs' order by ordinal_position;
```
Expected: rows for `id`, `owner_id`, `area`, `date`, `shift`, `auditor`, `topics`, `findings`, `action_required`, `action_details`, `responsible`, `deadline`, `photo_paths`, `created_at`.

- [ ] **Step 3: No repo commit** (this is a database-side change, not a file in the repo — nothing to commit)

---

### Task 10: Create the walkthrough-photos storage bucket in Supabase

**Files:** none (Supabase migration, applied via MCP tool)

- [ ] **Step 1: Apply the migration**

Use `mcp__claude_ai_Supabase__apply_migration` with `project_id: "ndkihnroxpcqvpzkrpwj"`, `name: "create_walkthrough_photos_bucket"`, and this `query`:

```sql
insert into storage.buckets (id, name, public)
values ('walkthrough-photos', 'walkthrough-photos', false)
on conflict (id) do nothing;

create policy "walkthrough_photos_access" on storage.objects
  for all
  using (bucket_id = 'walkthrough-photos')
  with check (bucket_id = 'walkthrough-photos');
```

- [ ] **Step 2: Verify**

Use `mcp__claude_ai_Supabase__execute_sql` with `project_id: "ndkihnroxpcqvpzkrpwj"` and query:
```sql
select id, public from storage.buckets where id = 'walkthrough-photos';
```
Expected: one row, `public = false`.

- [ ] **Step 3: No repo commit**

---

### Task 11: Rewrite Walkthroughs.tsx with persistence, photo upload, and AI analysis

**Files:**
- Modify: `src/components/Walkthroughs.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire file content**

```tsx

import { Footprints, Plus, CheckCircle2, AlertCircle, User, ChevronRight, X, Camera, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { IFSWalkthrough } from '../types';
import { supabase, mapWalkthrough } from '../lib/supabase';
import { resizeImageFile } from '../lib/imageResize';
import { analyzeWalkthroughPhotos } from '../services/ai';

const BEREICHE = [
  "Produktion Linie 1 (Frischbrot)",
  "Produktion Linie 2 (Gemischt)",
  "Produktion Linie 3 (TK-Produkte)",
  "Produktion Linie 4 (Bio)",
  "Wareneingang / Lager",
  "Verpackung",
  "Sozialräume / Umkleide",
  "Außenbereiche"
];

const WALKTHROUGH_TOPICS = [
  'Baulicher Zustand',
  'Außenbereiche',
  'Produktkontrolle während der Verarbeitung',
  'Hygiene während der Verarbeitung',
  'Fremdkörper/-materialien',
  'Personalhygiene',
];

const SHIFTS: IFSWalkthrough['shift'][] = ['Früh', 'Spät', 'Nacht'];

interface PhotoDraft {
  file: File;
  previewUrl: string;
}

interface WalkthroughForm {
  area: string;
  date: string;
  shift: IFSWalkthrough['shift'];
  auditor: string;
  topics: string[];
  findings: string;
  actionRequired: boolean;
  actionDetails: string;
  responsible: string;
  deadline: string;
}

function emptyForm(): WalkthroughForm {
  return {
    area: BEREICHE[0],
    date: new Date().toISOString().slice(0, 10),
    shift: 'Früh',
    auditor: 'Lokaler Nutzer',
    topics: [],
    findings: '',
    actionRequired: false,
    actionDetails: '',
    responsible: '',
    deadline: '',
  };
}

export default function Walkthroughs() {
  const [walkthroughs, setWalkthroughs] = useState<IFSWalkthrough[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({});

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<WalkthroughForm>(emptyForm());
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('walkthroughs')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        setWalkthroughs((data || []).map(mapWalkthrough));
        setIsLoadingList(false);
      });
  }, []);

  useEffect(() => {
    const allPaths = walkthroughs.flatMap(w => w.photoPaths);
    if (allPaths.length === 0) {
      setPhotoUrls({});
      return;
    }
    supabase.storage
      .from('walkthrough-photos')
      .createSignedUrls(allPaths, 3600)
      .then(({ data }) => {
        if (!data) return;
        const urlByPath: Record<string, string> = {};
        data.forEach(entry => {
          if (entry.signedUrl && entry.path) urlByPath[entry.path] = entry.signedUrl;
        });
        const grouped: Record<string, string[]> = {};
        walkthroughs.forEach(w => {
          grouped[w.id] = w.photoPaths.map(p => urlByPath[p]).filter((u): u is string => Boolean(u));
        });
        setPhotoUrls(grouped);
      });
  }, [walkthroughs]);

  const lastWalkthroughs = useMemo(() => {
    const map: Record<string, string> = {};
    walkthroughs.forEach(w => {
      if (!map[w.area] || new Date(w.date) > new Date(map[w.area])) {
        map[w.area] = w.date;
      }
    });
    return map;
  }, [walkthroughs]);

  function toggleTopic(topic: string) {
    setForm(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) ? prev.topics.filter(t => t !== topic) : [...prev.topics, topic],
    }));
  }

  function addPhotos(fileList: FileList | null) {
    const files = Array.from(fileList || []);
    const drafts = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...drafts]);
  }

  function removePhoto(index: number) {
    setPhotos(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  }

  function closeModal() {
    photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setShowModal(false);
    setForm(emptyForm());
    setPhotos([]);
    setAnalysisError(null);
  }

  async function analyzePhotos() {
    if (photos.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const images = await Promise.all(photos.map(p => resizeImageFile(p.file)));
      const report = await analyzeWalkthroughPhotos(form.area, form.topics, images);
      setForm(prev => ({ ...prev, findings: report }));
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Fehler bei der Fotoanalyse.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function saveWalkthrough() {
    if (!form.area || isSaving) return;
    setIsSaving(true);
    const id = `walkthrough_${Date.now()}`;

    const photoPaths: string[] = [];
    for (const draft of photos) {
      const path = `${id}/${Date.now()}-${draft.file.name}`;
      const { error } = await supabase.storage.from('walkthrough-photos').upload(path, draft.file);
      if (!error) photoPaths.push(path);
    }

    const { data, error } = await supabase
      .from('walkthroughs')
      .insert({
        id,
        area: form.area,
        date: new Date(form.date).toISOString(),
        shift: form.shift,
        auditor: form.auditor,
        topics: form.topics,
        findings: form.findings,
        action_required: form.actionRequired,
        action_details: form.actionDetails,
        responsible: form.responsible,
        deadline: form.deadline || null,
        photo_paths: photoPaths,
      })
      .select()
      .single();

    if (!error && data) {
      setWalkthroughs(prev => [mapWalkthrough(data), ...prev]);
      closeModal();
    }
    setIsSaving(false);
  }

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Begehungen</h2>
          <p className="micro-label">Regelmäßige Betriebsbegehungen &bull; IFS §5.2.1</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          NEUE BEGEHUNG
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEREICHE.slice(0, 4).map(area => {
          const lastDate = lastWalkthroughs[area];
          const daysSince = lastDate ? Math.floor((new Date().getTime() - new Date(lastDate).getTime()) / 86400000) : 999;
          const isCritical = daysSince > 30;

          return (
            <div key={area} className={`p-8 rounded-[32px] border ${isCritical ? 'bg-red-50 border-red-100' : 'bg-surface-50 border-surface-100'} space-y-4`}>
              <p className="micro-label !text-surface-400 leading-tight h-8 line-clamp-2">{area}</p>
              <div>
                 <p className={`text-2xl font-display font-black ${isCritical ? 'text-red-600' : 'text-surface-900'}`}>
                   {lastDate ? `${daysSince} Tage` : 'NIE'}
                 </p>
                 <p className="micro-label !text-surface-400">Seit letzter Begehung</p>
              </div>
              {isCritical && (
                <div className="flex items-center gap-2 text-red-600 font-black text-[9px] uppercase animate-pulse">
                  <AlertCircle size={12} />
                  Handlungsbedarf
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <h3 className="text-xl font-display font-black uppercase tracking-tight text-surface-900">Letzte Befunde</h3>
           <div className="h-px flex-1 bg-surface-200"></div>
        </div>

        {isLoadingList && (
          <p className="text-sm font-bold text-surface-400">Lädt...</p>
        )}

        {!isLoadingList && walkthroughs.length === 0 && (
          <p className="text-sm font-bold text-surface-400">Noch keine Begehungen erfasst.</p>
        )}

        <div className="grid gap-6">
          {walkthroughs.map(w => (
            <div key={w.id} className="bg-white border border-surface-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-10">
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono font-bold text-surface-400">{new Date(w.date).toLocaleDateString()}</span>
                     <span className="bg-surface-100 text-surface-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{w.shift}schicht</span>
                     <h4 className="font-display font-bold text-lg text-surface-900 uppercase tracking-tight">{w.area}</h4>
                  </div>

                  <div className="space-y-4">
                     <p className="text-sm font-medium text-surface-600 leading-relaxed italic border-l-2 border-surface-100 pl-4 whitespace-pre-line">
                       {w.findings || 'Keine Befunde erfasst.'}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {w.topics.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{t}</span>
                        ))}
                     </div>
                  </div>

                  {photoUrls[w.id] && photoUrls[w.id].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {photoUrls[w.id].map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-surface-200 hover:ring-2 hover:ring-primary-500 transition-all">
                          <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-10">
                     <div className="flex items-center gap-2">
                        <User size={14} className="text-surface-300" />
                        <span className="text-xs font-bold text-surface-500">{w.auditor}</span>
                     </div>
                     {w.actionRequired && (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-xl ring-1 ring-orange-200">
                           <AlertCircle size={14} />
                           <span className="text-[10px] font-black uppercase">Maßnahme erfasst</span>
                        </div>
                     )}
                     {!w.actionRequired && (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                           <CheckCircle2 size={14} />
                           <span className="text-[10px] font-black uppercase">Konform</span>
                        </div>
                     )}
                  </div>
               </div>
               <div className="flex items-center">
                  <button className="p-4 bg-surface-50 hover:bg-primary-600 hover:text-white rounded-2xl transition-all">
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Walkthrough Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000]/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-surface-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight text-surface-900">Neue Begehung</h2>
                  <p className="micro-label !text-surface-400">Bereich, Fotos und Befunde erfassen</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 hover:bg-surface-50 rounded-2xl transition-all text-surface-300 hover:text-surface-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="micro-label block mb-4 ml-1">BEREICH</label>
                    <select
                      value={form.area}
                      onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    >
                      {BEREICHE.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">SCHICHT</label>
                    <select
                      value={form.shift}
                      onChange={e => setForm(prev => ({ ...prev, shift: e.target.value as IFSWalkthrough['shift'] }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    >
                      {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">DATUM</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">PRÜFER</label>
                    <input
                      type="text"
                      value={form.auditor}
                      onChange={e => setForm(prev => ({ ...prev, auditor: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">THEMEN</label>
                  <div className="flex flex-wrap gap-2">
                    {WALKTHROUGH_TOPICS.map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                          form.topics.includes(topic)
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-50 text-surface-500 hover:bg-surface-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">FOTOS</label>
                  <label className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-surface-200 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-surface-50 transition-all">
                    <Camera size={20} className="text-surface-400" />
                    <span className="text-sm font-bold text-surface-500">Fotos auswählen oder aufnehmen</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={e => { addPhotos(e.target.files); e.target.value = ''; }}
                      className="hidden"
                    />
                  </label>

                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-surface-200 group">
                          <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length > 0 && (
                    <button
                      type="button"
                      onClick={analyzePhotos}
                      disabled={isAnalyzing}
                      className="mt-4 flex items-center gap-2 px-6 py-3 bg-surface-900 text-white rounded-2xl micro-label hover:bg-black transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      FOTOS ANALYSIEREN
                    </button>
                  )}

                  {analysisError && (
                    <p className="mt-3 text-xs font-bold text-red-600">{analysisError}</p>
                  )}
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">BEFUNDE</label>
                  <textarea
                    value={form.findings}
                    onChange={e => setForm(prev => ({ ...prev, findings: e.target.value }))}
                    rows={5}
                    placeholder="Befunde eintragen oder Fotos analysieren lassen..."
                    className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.actionRequired}
                    onChange={e => setForm(prev => ({ ...prev, actionRequired: e.target.checked }))}
                    className="w-5 h-5 rounded accent-primary-600"
                  />
                  <span className="text-sm font-bold text-surface-700">Handlungsbedarf</span>
                </label>

                {form.actionRequired && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="micro-label block mb-4 ml-1">MASSNAHME</label>
                      <input
                        type="text"
                        value={form.actionDetails}
                        onChange={e => setForm(prev => ({ ...prev, actionDetails: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="micro-label block mb-4 ml-1">VERANTWORTLICH</label>
                      <input
                        type="text"
                        value={form.responsible}
                        onChange={e => setForm(prev => ({ ...prev, responsible: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="micro-label block mb-4 ml-1">FRIST</label>
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-8 py-5 rounded-2xl micro-label text-surface-400 hover:bg-surface-50 transition-all font-bold"
                  >
                    ABBRECHEN
                  </button>
                  <button
                    disabled={!form.area || isSaving}
                    onClick={saveWalkthrough}
                    className="flex-[2] bg-primary-600 text-white px-8 py-5 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'BEGEHUNG SPEICHERN'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

Note: `Footprints` is imported but not referenced in JSX — it matches the original file's import list (used by the sidebar nav icon in `App.tsx`, not here); TypeScript's default config (`noUnusedLocals` not set) won't fail on this, but if it bothers a future reader it's safe to drop. Kept for minimal diff parity with the original import line.

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Walkthroughs.tsx
git commit -m "Add real persistence, photo upload, and Claude photo analysis to Begehungen"
```

---

### Task 12: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the worktree's dev server on a separate port**

The main repo (not this worktree) may already have its own `npm run dev` running on port 3001 — do NOT kill port 3001 or touch anything outside this worktree. Use port 3002 for this worktree instead:

```bash
cd /Users/maximilianturan/.config/superpowers/worktrees/ifs-food-v8-assistant/walkthrough-photo-analysis
lsof -ti:3002 -sTCP:LISTEN | xargs -r kill
PORT=3002 npm run dev
```
Wait for `Server running on http://localhost:3002`.

- [ ] **Step 2: Drive the app with a headless browser**

Use the same approach as earlier in this session (chromium-cli is not installed; use the Playwright package cached under `~/.npm/_npx/9833c18b2d85bc59/node_modules` together with the `Google Chrome for Testing` binary under `~/Library/Caches/ms-playwright/chromium-1234/...`, as already proven to work). Script:

1. Navigate to `http://localhost:3002`, click "Begehungen" in the sidebar.
2. Click "NEUE BEGEHUNG" — confirm the modal opens with all fields (Bereich, Schicht, Datum, Prüfer, Themen, Fotos, Befunde, Handlungsbedarf).
3. Select 1-2 small test images for the photo input.
4. Click "FOTOS ANALYSIEREN" — confirm either (a) with a real `ANTHROPIC_API_KEY` set, the Befunde textarea fills with a German report referencing IFS chapters, or (b) without a key, `analysisError` displays a clear German message and the rest of the form stays usable.
5. Click "BEGEHUNG SPEICHERN" — confirm the modal closes and the new entry appears at the top of "Letzte Befunde" with its photo thumbnails visible.
6. Reload the page — confirm the entry and its photos persist (loaded from Supabase, not lost).
7. Run `page.on('console', ...)` / `page.on('response', ...)` capture as done earlier this session — confirm no unexpected 400/500 responses from `/api/walkthrough-analysis`, `walkthroughs`, or `walkthrough-photos` storage calls (a 500 from `/api/walkthrough-analysis` due to a missing `ANTHROPIC_API_KEY` is expected and acceptable if no key is configured — the check here is against errors unrelated to that documented cause).
8. Separately, re-verify the pre-existing "?" requirement explanation button and any advice flow in the Audit view still work against the migrated `/api/explain` endpoint (same missing-key caveat applies).

- [ ] **Step 3: Clean up test data**

If a test walkthrough was created against the real Supabase project during verification, delete it via `mcp__claude_ai_Supabase__execute_sql`:
```sql
delete from walkthroughs where id = '<the test id>';
```
And remove its uploaded photos from the `walkthrough-photos` bucket via the Supabase Storage API (list objects under the walkthrough's id prefix, then remove them) so the project isn't left with test clutter — matching how the earlier `audit_...` test row was cleaned up in this session.

- [ ] **Step 4: No commit** (verification only)

---

## Self-Review Notes

- **Spec coverage:** Provider migration (§1) → Tasks 1-6. Data model & storage (§2) → Tasks 7, 9, 10. Frontend flow (§3) → Tasks 8, 11. Testing/Verification section → Task 12 mirrors the spec's four manual checks. `WALKTHROUGH_TOPICS` ambiguity resolved during spec self-review is included in Task 11.
- **Placeholder scan:** no TBD/TODO; every step has complete, runnable code or exact commands.
- **Type consistency:** `IFSWalkthrough.photoPaths` (Task 7) matches `mapWalkthrough`'s `photoPaths` field (Task 7) matches its usage in `Walkthroughs.tsx` (Task 11, `w.photoPaths`). `WalkthroughPhoto` (Task 4, `src/services/ai.ts`) matches `ResizedImage` (Task 8, `src/lib/imageResize.ts`) matches the `images` param shape expected by `/api/walkthrough-analysis` (Task 3, `server.ts`) — all three agree on `{ data: string; mediaType: "image/jpeg" }`.
