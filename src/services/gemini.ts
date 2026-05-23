
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
    return "💡 **Hinweis:** Die KI-Erklärung ist derzeit nicht verfügbar, da der Gemini API Key nicht konfiguriert ist (siehe 'Settings > Secrets').\n\n**Anforderungstext:** " + description;
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
