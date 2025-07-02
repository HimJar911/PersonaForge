"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAllPersonaMemories } from "@/lib/api";
import { predefinedPersonas } from "@/data/predefinedPersonas";

interface Persona {
  name: string;
  role: string;
  traits: string[] | string;
  style: string;
  goals: string;
  summary: string;
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPersonas = async () => {
      try {
        // Backend memory
        const backendData = await fetchAllPersonaMemories();
        const backendFormatted: Persona[] = Object.entries(backendData).map(
          ([name, traits]) => ({
            name,
            role: "Unknown",
            traits: traits as string[] | string,
            style: "default",
            goals: "",
            summary: "",
          })
        );

        // Local storage
        let localFormatted: Persona[] = [];
        const localData = localStorage.getItem("personaforge_saved_personas");
        if (localData) {
          try {
            localFormatted = JSON.parse(localData);
          } catch {
            console.warn("⚠️ Could not parse localStorage");
          }
        }

        // Predefined personas
        const predefinedFormatted: Persona[] = [
          {
            ...predefinedPersonas.Raven,
            style: "strategic",
            goals: "Business mastery",
            summary: "Sharp, tactical advisor for decision-making",
          },
          {
            ...predefinedPersonas.Sage,
            style: "wise",
            goals: "Empathic life coaching",
            summary: "A calm voice through emotional storms",
          },
          {
            ...predefinedPersonas.Icarus,
            style: "creative",
            goals: "Push boundaries and explore ideas",
            summary: "A visionary spark for creators and builders",
          },
          {
            ...predefinedPersonas.Zenith,
            style: "analytic",
            goals: "Investigate, analyze, and conquer complexity",
            summary: "Your research and strategy partner",
          },
        ];

        // Merge all without duplicates
        const all = [
          ...predefinedFormatted,
          ...localFormatted.filter(
            (l) => !predefinedFormatted.find((p) => p.name === l.name)
          ),
          ...backendFormatted.filter(
            (b) =>
              !predefinedFormatted.find((p) => p.name === b.name) &&
              !localFormatted.find((l) => l.name === b.name)
          ),
        ];

        console.log("✅ Loaded predefined:", predefinedFormatted);

        setPersonas(all);
        if (!localStorage.getItem("personaforge_saved_personas")) {
          localStorage.setItem("personaforge_saved_personas", JSON.stringify(all));
        }
      } catch (err) {
        console.error("❌ Failed to load personas:", err);
      }
    };

    loadPersonas();
  }, []);

  const deletePersona = (name: string) => {
    const updated = personas.filter((p) => p.name !== name);
    setPersonas(updated);
    localStorage.setItem("personaforge_saved_personas", JSON.stringify(updated));
    localStorage.removeItem(`chat_history_${name}`);
  };

  const openChat = (name: string) => {
    router.push(`/chat/${encodeURIComponent(name)}`);
  };

  return (
    <main className="bg-gradient-to-br from-[#1a1d29] to-[#2d3748] min-h-screen text-white pt-32 px-6 md:px-12 lg:px-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 mb-12 text-center flex items-center justify-center gap-3">
        <span>🧠</span> My Personas
      </h1>

      {personas.length === 0 ? (
        <p className="text-slate-400 text-center">No personas found. Forge one first!</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => (
            <div
              key={p.name}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl space-y-3 transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-purple-300">{p.name}</h2>
              <p className="text-purple-400 font-medium">{p.role}</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {Array.isArray(p.traits) ? p.traits.join(", ") : p.traits}
              </p>

              <div className="flex gap-2 mt-6">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
                  onClick={() => openChat(p.name)}
                >
                  Open Chat
                </button>
                <button
                  className="bg-red-600/60 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
                  onClick={() => deletePersona(p.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
