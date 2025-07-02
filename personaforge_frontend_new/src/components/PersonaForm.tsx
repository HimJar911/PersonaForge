"use client";

import React, { useEffect, useState } from "react";
import { forgePersona, chatWithPersona } from "@/lib/api";
import ChatBox from "@/components/ChatBox";

interface Persona {
  name: string;
  role: string;
  traits: string[] | string;
  style: string;
  goals: string;
  summary: string;
}

export default function PersonaForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [traits, setTraits] = useState("");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedPersonas, setSavedPersonas] = useState<Persona[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("personaforge_saved_personas");
    if (data) setSavedPersonas(JSON.parse(data));
  }, []);

  // Save new persona to localStorage
  const savePersona = (p: Persona) => {
    const updated = [...savedPersonas, p];
    localStorage.setItem("personaforge_saved_personas", JSON.stringify(updated));
    setSavedPersonas(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await forgePersona(name, role, traits);
      setPersona(result);
      savePersona(result);
    } catch (error) {
      console.error("Error forging persona:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPersona = (p: Persona) => {
    setPersona(p);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 text-white">
      <div>
        <label className="block font-medium">Persona Name</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Persona Role</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Traits</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Forging..." : "Forge Persona"}
      </button>

      {persona && (
        <>
          <div className="mt-6 bg-gray-900 p-4 rounded-xl border border-purple-700 space-y-2">
            <h2 className="text-xl font-bold text-purple-400">{persona.name}</h2>
            <p><strong>Role:</strong> {persona.role}</p>
            <p><strong>Traits:</strong>{" "}
              {Array.isArray(persona.traits) ? persona.traits.join(", ") : persona.traits}</p>
            <p><strong>Style:</strong> {persona.style}</p>
            <p><strong>Goals:</strong> {persona.goals}</p>
            <p><strong>Summary:</strong> {persona.summary}</p>
          </div>

          <ChatBox
            personaName={persona.name}
            personaPrompt={`You are a fictional AI persona named ${persona.name}, with the role of ${persona.role}.
You have the following traits: ${Array.isArray(persona.traits) ? persona.traits.join(", ") : persona.traits}.
Your communication style: ${persona.style}
Your goals: ${persona.goals}
Summary: ${persona.summary}
Respond to the user as yourself, staying in character.`}
          />
        </>
      )}

      {savedPersonas.length > 0 && (
        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-bold text-purple-300">🧠 Previously Forged Personas</h3>
          {savedPersonas.map((p, i) => (
            <button
              key={i}
              className="block w-full text-left bg-gray-800 border border-gray-700 px-4 py-2 rounded hover:bg-purple-800 transition"
              onClick={() => loadPersona(p)}
            >
              {p.name} — <span className="text-sm text-slate-400">{p.role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
