"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Persona } from "@/data/predefinedPersonas";

interface PersonaGridProps {
  personas: (Persona & { useCase?: string; theme?: string })[];
  id?: string;
}

export default function PersonaGrid({ personas, id }: PersonaGridProps) {
  const router = useRouter();

  return (
    <section
      id={id || "templates"}
      className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 text-white"
    >
      <div className="text-center mb-16">
        <p className="uppercase text-emerald-400 font-semibold text-sm tracking-widest">
          Meet Your Companions
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Meet Your AI Companions
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Discover our pre-built personas designed for different use cases and scenarios.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p) => (
          <div
            key={p.name}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-md"
          >
            <div className={`h-28 ${getPersonaHeaderTheme(p.theme)} flex items-end px-6 py-4`}>
              <h3 className="text-2xl font-bold">{p.name}</h3>
            </div>
            <div className="p-6">
              <p className="text-purple-400 font-semibold mb-2">{p.role}</p>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                {Array.isArray(p.traits) &&
                  p.traits.map((t) => (
                    <span
                      key={t}
                      className="bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
              </div>
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-1">Use Case:</p>
                <p className="text-white font-medium">
                  {p.useCase || "AI-powered conversation"}
                </p>
              </div>
              <button
                onClick={() => router.push(`/chat/${p.name}`)}
                className="w-full bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 text-purple-300 py-2 rounded-xl font-semibold transition"
              >
                Try This Persona →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getPersonaHeaderTheme(theme: string = "") {
  switch (theme) {
    case "raven":
      return "bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500";
    case "sage":
      return "bg-[radial-gradient(circle_at_top_left,_#ffffff1c,_#0000003c)]";
    case "icarus":
      return "bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-500";
    case "zenith":
      return "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500";
    default:
      return "bg-slate-700";
  }
}
