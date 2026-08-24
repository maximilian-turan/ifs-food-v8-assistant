# Betriebsbegehung Foto-Analyse (Claude Vision) — Design

## Problem

Bei einer Betriebsbegehung ("Walkthrough") macht der Nutzer mehrere Fotos vom
begangenen Bereich. Aktuell gibt es dafür keinen Foto-Upload und keine
KI-Unterstützung — das Modul "Begehungen" (`src/components/Walkthroughs.tsx`)
zeigt nur Mock-Daten an; der "Neue Begehung"-Button hat keine Funktion, es gibt
kein Modal, und nichts wird in Supabase gespeichert.

Ziel: Der Nutzer soll mehrere Fotos hochladen können und eine KI-Analyse
bezüglich IFS Food v8 bekommen — was auf den Fotos fehlt oder nicht IFS-konform
aussieht, und was zu tun ist.

## Scope-Entscheidung: KI-Provider

Das Projekt nutzt aktuell Gemini (`@google/genai`) für zwei bestehende
Funktionen (`/api/explain`, `/api/advice`). Für dieses Feature wird auf
**Claude (Anthropic API)** umgestellt — und zwar für **alle drei**
KI-Funktionen, nicht nur die neue Foto-Analyse, damit das Projekt nur einen
KI-Provider hat.

## 1. Provider-Migration (Gemini → Claude)

### `server.ts`

- Ersetzt `import { GoogleGenAI } from "@google/genai"` durch
  `import Anthropic from "@anthropic-ai/sdk"`.
- Client-Init: `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`.
- Modell für alle Aufrufe: `claude-opus-5`.
- `/api/explain` und `/api/advice` bleiben in Request/Response-Form
  unverändert (`{ text: string }`), nur der interne Aufruf wechselt von
  `genAI.models.generateContent(...)` auf
  `client.messages.create({ model: "claude-opus-5", max_tokens: 16000,
  messages: [...] })`, Text aus dem ersten `text`-Content-Block.
- Fehlermeldungen bleiben inhaltlich gleich (deutsch, verständlich), nur
  "GEMINI_API_KEY" → "ANTHROPIC_API_KEY" und "Gemini API Fehler" →
  "Claude API Fehler" im Text.
- Neuer Endpunkt `POST /api/walkthrough-analysis`:
  - Request: `{ area: string, topics: string[], images: { data: string,
    mediaType: string }[] }` (Base64-Bilddaten ohne Data-URL-Prefix).
  - Baut eine Claude-Vision-Anfrage: für jedes Bild ein
    `{ type: "image", source: { type: "base64", media_type, data } }`-Block,
    gefolgt von einem Text-Block mit Prompt (siehe unten).
  - Response: `{ text: string }` — Freitext-Bericht.
  - Gleiches Fehlerverhalten wie die bestehenden Endpunkte: fehlt der Key,
    kommt ein 500 mit klarer deutscher Meldung.

**Analyse-Prompt (sinngemäß):**

```
Du bist ein erfahrener IFS Food v8 Auditor. Ein Nutzer hat gerade eine
Betriebsbegehung im Bereich "{area}" durchgeführt (Themen: {topics}) und
folgende Fotos aufgenommen.

Analysiere die Fotos und beschreibe:
1. Was ist auf den Fotos zu sehen (kurz)?
2. Welche Punkte sind bezüglich IFS Food v8 auffällig — was fehlt, was ist
   nicht konform, was sollte verbessert werden? Beziehe dich wo möglich auf
   das passende IFS-Kapitel: {IFS_CHAPTERS Titel/Beschreibung, v.a. Kap. 3
   Ressourcenmanagement/Hygiene, Kap. 4 Operative Abläufe}.
3. Was sollte konkret getan werden?

Antworte auf Deutsch, als zusammenhängender Freitext-Bericht (kein JSON),
professionell und praxisnah für einen Qualitätsmanager. Falls nichts
Auffälliges zu erkennen ist, sag das auch klar.
```

### `src/services/gemini.ts` → `src/services/ai.ts`

- Datei umbenannt (spiegelt den Providerwechsel wider).
- Bestehende Funktionen `getRequirementExplanation`, `getAuditAdvice`:
  Signatur/Verhalten unverändert, nur Import-Pfad ändert sich an den
  Aufrufstellen (`src/App.tsx`).
- Neue Funktion `analyzeWalkthroughPhotos(area: string, topics: string[],
  images: { data: string, mediaType: string }[]): Promise<string>` — ruft
  `/api/walkthrough-analysis`, gibt Freitext zurück oder eine verständliche
  deutsche Fallback-Fehlermeldung (gleiches Muster wie
  `getRequirementExplanation`).

### Env & Dependencies

- `.env` / `.env.example`: `GEMINI_API_KEY` → `ANTHROPIC_API_KEY`.
- `package.json`: `@google/genai` raus, `@anthropic-ai/sdk` rein.

## 2. Datenmodell & Speicherung (Supabase)

### Neue Tabelle `walkthroughs`

Bisher existiert diese Tabelle nicht — `Walkthroughs.tsx` zeigt nur
`MOCK_WALKTHROUGHS`. Neue Migration legt an:

| Spalte | Typ | Hinweis |
|---|---|---|
| id | text | PK |
| owner_id | text | default `'local-user'` |
| area | text | |
| date | timestamptz | default `now()` |
| shift | text | 'Früh' \| 'Spät' \| 'Nacht' |
| auditor | text | |
| topics | text[] | default `'{}'` |
| findings | text | default `''` |
| action_required | boolean | default `false` |
| action_details | text | default `''` |
| responsible | text | default `''` |
| deadline | date | nullable |
| photo_paths | text[] | default `'{}'` — Pfade im Storage-Bucket |
| created_at | timestamptz | default `now()` |

RLS-Policy nach bestehendem Muster: `owner_id = 'local-user'` für ALL.

### Storage-Bucket `walkthrough-photos`

- Privater Bucket, gleiches permissives Zugriffsmodell wie der Rest der App
  (kein echtes Supabase Auth vorhanden — konsistent mit den bestehenden
  Tabellen-Policies).
- Pfadschema: `{walkthrough_id}/{timestamp}-{filename}`.

### Client-seitige Bildverkleinerung

Vor Upload und vor KI-Analyse werden Fotos im Browser per `<canvas>` auf max.
1568px lange Kante verkleinert (Anthropic-Empfehlung für Vision-Eingaben,
spart nebenbei Storage und Ladezeit bei Handyfotos).

## 3. Frontend-Ablauf (`Walkthroughs.tsx`)

### "Neue Begehung"-Modal (existiert aktuell nicht)

Felder: Bereich (Dropdown aus `BEREICHE`), Datum, Schicht, Themen
(Mehrfachauswahl), Fotos (Datei-Input, `multiple`, `accept="image/*"`,
`capture` für Mobile-Kamera), Befunde (Textarea), Handlungsbedarf (Checkbox,
manuell).

Die Themen-Liste ist bisher nirgends als Konstante definiert (nur als
Freitext in den Mock-Daten). Sie wird direkt aus dem IFS-Anforderungstext zu
5.2.1 in `mockData.ts` abgeleitet, als neue Konstante `WALKTHROUGH_TOPICS` in
`Walkthroughs.tsx`:
`["Baulicher Zustand", "Außenbereiche", "Produktkontrolle während der
Verarbeitung", "Hygiene während der Verarbeitung", "Fremdkörper/-materialien",
"Personalhygiene"]`.

### Foto-Analyse

- Button "Fotos analysieren" (aktiv sobald ≥1 Foto gewählt).
- Alle gewählten Fotos werden verkleinert, als Base64 gesammelt und in
  **einer** Anfrage an `analyzeWalkthroughPhotos(area, topics, images)`
  geschickt (ein zusammenhängender Bericht für alle Fotos, nicht pro Foto).
- Ladezustand während der Anfrage.
- Ergebnis-Text wird **in das Befunde-Textfeld eingesetzt** (überschreibt/
  ergänzt den bisherigen Inhalt) — der Nutzer kann ihn vor dem Speichern noch
  bearbeiten. Kein separates read-only Feld.
- Schlägt die Analyse fehl (z. B. fehlender API Key), erscheint die
  Fehlermeldung an gleicher Stelle, das Speichern der Begehung ist davon
  unabhängig weiter möglich.

### Speichern

- Fotos werden in den Bucket hochgeladen, die resultierenden Pfade in
  `photo_paths` geschrieben.
- Begehung wird per `supabase.from('walkthroughs').insert(...)` angelegt.
- Liste der Begehungen wird aus Supabase geladen (`MOCK_WALKTHROUGHS` entfällt
  als Datenquelle; die Konstante `BEREICHE` bleibt als reine UI-Konfiguration).

## Out of Scope

- Keine automatische Ableitung von "Handlungsbedarf" (ja/nein) aus dem
  KI-Freitext — das bleibt eine manuelle Nutzerentscheidung.
- Keine Einzelanalyse pro Foto — immer ein Bericht pro Begehung.
- Keine Änderungen an der mobilen App (`ifs-food-mobile`) — dieses Feature
  betrifft nur die Web-App (`ifs-food-v8-assistant`).
- Keine automatisierten Tests — das Projekt hat aktuell keine Testinfrastruktur
  (`npm run lint` = `tsc --noEmit` ist die einzige vorhandene Prüfung);
  Verifikation erfolgt manuell im Browser wie bei den bisherigen Features.

## Testing / Verifikation

Manuell im laufenden Dev-Server (wie bereits in dieser Session praktiziert):
1. Neue Begehung anlegen, mehrere Fotos hochladen, "Fotos analysieren"
   klicken, prüfen dass ein sinnvoller Bericht im Befunde-Feld erscheint.
2. Ohne `ANTHROPIC_API_KEY` prüfen, dass eine verständliche Fehlermeldung
   erscheint und das Speichern trotzdem funktioniert.
3. Begehung speichern, Seite neu laden, prüfen dass sie aus Supabase geladen
   wird und die Fotos im Storage-Bucket liegen.
4. Bestehende KI-Funktionen (`?`-Erklärung, Abweichungsberatung) nach der
   Provider-Migration weiterhin gegen Claude testen.
