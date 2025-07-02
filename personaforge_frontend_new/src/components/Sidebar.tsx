"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Persona {
  name: string;
  role: string;
  traits: string[] | string;
  style: string;
  goals: string;
  summary: string;
}

export default function Sidebar() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const activePersona = pathname.split("/").pop();

  useEffect(() => {
    const stored = localStorage.getItem("personaforge_saved_personas");
    if (stored) {
      try {
        setPersonas(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse saved personas from sidebar");
      }
    }
  }, []);

  return (
    <aside className="h-screen fixed left-0 top-0 w-60 bg-[#1a1d29] border-r border-slate-800 pt-24 px-4 space-y-4 overflow-y-auto">
      <h2 className="text-purple-400 text-lg font-semibold mb-4 pl-2">
        🧠 My Personas
      </h2>
      {personas.map((p) => (
        <button
          key={p.name}
          onClick={() => router.push(`/chat/${p.name}`)}
          className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
            activePersona === p.name
              ? "bg-purple-700 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {p.name}
        </button>
      ))}
    </aside>
  );
}
