const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function forgePersona(name: string, role: string, traits: string) {
  const res = await fetch(`${BASE_URL}/forge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role, traits }),
  });

  const data = await res.json();
  return data.persona; // ✅ Already structured object from backend
}

export async function getPersonaMemory(personaName: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/memory/${personaName}`);
  const data = await res.json();
  return data.facts || [];
}

export async function chatWithPersona( 
  personaName: string,
  personaPrompt: string,
  userMessage: string
) {
  const [facts, ragResults] = await Promise.all([
    getPersonaMemory(personaName),
    searchMemoryInRAG(personaName, userMessage),
  ]);

  const factText = facts.length
    ? `\n\nKnown facts about the user:\n${facts.map(f => `- ${f}`).join("\n")}`
    : "";

  const ragText = ragResults.length
    ? `\n\nPreviously discussed info:\n${ragResults.map(r => `- ${r}`).join("\n")}`
    : "";

  const finalPrompt = personaPrompt + factText + ragText;

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      persona_name: personaName,
      persona_prompt: finalPrompt,
      user_message: userMessage,
    }),
  });

  const data = await res.json();
  const history = data.history;
  const lastMessage = history?.[history.length - 1];

  return lastMessage?.role === "assistant" ? lastMessage.content : "";
}

export async function saveFactToMemory(personaName: string, fact: string) {
  const res = await fetch(`${BASE_URL}/memory/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona_name: personaName, fact }),
  });
  return res.json();
}

export async function storeMessageInRAG(personaName: string, message: string) {
  await fetch(`${BASE_URL}/rag/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona_name: personaName, message }),
  });
}

export async function searchMemoryInRAG(personaName: string, query: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/rag/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona_name: personaName, query }),
  });

  const data = await res.json();
  return data.results || [];
}

export async function fetchAllPersonaMemories() {
  const res = await fetch(`${BASE_URL}/memory/all`);
  if (!res.ok) throw new Error("Failed to fetch persona memory");
  return res.json(); // returns an object like { "Raven": [facts], "Nova": [facts] }
}
