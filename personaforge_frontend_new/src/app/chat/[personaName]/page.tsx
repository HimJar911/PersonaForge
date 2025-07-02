"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import { predefinedPersonas, Persona } from "@/data/predefinedPersonas";
import usePageRefreshOnFocus from "@/hooks/usePageRefreshOnFocus";

export default function ChatPage() {
  const { personaName } = useParams();
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);

  const loadPersona = () => {
    const local = localStorage.getItem("personaforge_saved_personas");
    let localPersonas: Persona[] = [];

    if (local) {
      try {
        localPersonas = JSON.parse(local);
      } catch {
        console.warn("⚠️ Failed to parse saved personas");
      }
    }

    const combined = [...Object.values(predefinedPersonas), ...localPersonas];
    setAllPersonas(combined);

    const match = combined.find((p) => p.name === personaName);
    setPersona(match || null);
  };

  useEffect(() => {
    loadPersona();
  }, [personaName]);

  usePageRefreshOnFocus(loadPersona);

  if (!persona) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1d29] to-[#2d3748] text-white flex items-center justify-center p-6">
        <p className="text-slate-400 text-center">
          Persona not found. Please go back to{" "}
          <a href="/personas" className="underline text-purple-400">
            My Personas
          </a>
          .
        </p>
      </main>
    );
  }

  const prompt = `You are a fictional AI persona named ${persona.name}, with the role of ${persona.role}.
You have the following traits: ${Array.isArray(persona.traits) ? persona.traits.join(", ") : persona.traits}.
Your communication style: ${persona.style}
Your goals: ${persona.goals}
Summary: ${persona.summary}
Respond as yourself, staying in character.`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1d29] to-[#2d3748] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#131622] border-r border-gray-700 p-4 hidden md:block">
        <h2 className="text-lg font-bold mb-4 text-purple-400">🧠 Personas</h2>
        {allPersonas.map((p) => (
          <a
            key={p.name}
            href={`/chat/${p.name}`}
            className={`block px-3 py-2 rounded mb-2 ${
              p.name === persona.name
                ? "bg-purple-700 text-white"
                : "hover:bg-gray-800 text-slate-300"
            }`}
          >
            {p.name}
          </a>
        ))}
      </aside>

      {/* Chat section */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <button
          onClick={() => router.push("/personas")}
          className="text-sm text-slate-300 hover:text-white transition flex items-center gap-2 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to My Personas
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-6">
          🧠 Chatting with {persona.name}
        </h1>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatBox personaName={persona.name} personaPrompt={prompt} />
        </div>
      </main>
    </div>
  );
}
