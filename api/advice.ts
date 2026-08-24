import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
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
    return Response.json({ error: "Fehler beim Abrufen der Beratung." }, { status: 500 });
  }
}
