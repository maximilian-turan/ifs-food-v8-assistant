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
      max_tokens: 16000,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    return Response.json({ text: textBlock?.text || "" });
  } catch (error) {
    console.error("Claude Error:", error);
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API Fehler: Key ungültig oder Zugriff verweigert." }, { status: 500 });
    }
    return Response.json({ error: "Fehler beim Abrufen der Erklärung." }, { status: 500 });
  }
}
