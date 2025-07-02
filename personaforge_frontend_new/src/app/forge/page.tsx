"use client";

import { useEffect, useState } from "react";
import { forgePersona } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Brain, User, Briefcase, Wand2 } from "lucide-react";
import usePageRefreshOnFocus from "@/hooks/usePageRefreshOnFocus"; // ✅ imported

interface Persona {
  name: string;
  role: string;
  traits: string[] | string;
  style: string;
  goals: string;
  summary: string;
}

export default function ForgePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [traits, setTraits] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Persona | null>(null);
  const [savedPersonas, setSavedPersonas] = useState<Persona[]>([]);

  const loadPersonas = () => {
    const local = localStorage.getItem("personaforge_saved_personas");
    if (local) {
      try {
        setSavedPersonas(JSON.parse(local));
      } catch {
        console.warn("⚠️ Failed to parse local storage personas");
      }
    }
  };

  useEffect(loadPersonas, []);
  usePageRefreshOnFocus(loadPersonas); // ✅ applied the hook

  const handleSubmit = async () => {
    if (!name || !role || !traits) return;
    setLoading(true);
    try {
      const result = await forgePersona(name, role, traits);
      const updated = [...savedPersonas, result];
      localStorage.setItem("personaforge_saved_personas", JSON.stringify(updated));
      setSavedPersonas(updated);
      setPreview(result);
    } catch (err) {
      console.error("❌ Failed to forge persona:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1d29] to-[#2d3748] text-white pt-32 px-6 md:px-12 lg:px-20 overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text"
      >
        🛠️ Forge Your AI Persona
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto"
      >
        {/* Left: Form */}
        <div className="bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10 space-y-6 backdrop-blur-sm">
          <LabeledInput
            label="Persona Name"
            placeholder="e.g. Aurora"
            icon={<User size={18} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <LabeledInput
            label="Persona Role"
            placeholder="e.g. Emotional Support AI"
            icon={<Briefcase size={18} />}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <LabeledInput
            label="Traits (comma-separated)"
            placeholder="Kind, Logical, Curious"
            icon={<Wand2 size={18} />}
            value={traits}
            onChange={(e) => setTraits(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-purple-500/50"
          >
            {loading ? "Forging..." : "✨ Forge Persona"}
          </button>
        </div>

        {/* Right: Live Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 p-6 rounded-2xl shadow-2xl border border-white/10 min-h-[300px] backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
            <Brain size={20} /> Live Preview
          </h2>
          {preview ? (
            <div className="space-y-4 text-sm text-slate-300">
              <div className="space-y-2">
                <p><span className="font-semibold text-purple-400">Name:</span> {preview.name}</p>
                <p><span className="font-semibold text-purple-400">Role:</span> {preview.role}</p>
                <p><span className="font-semibold text-purple-400">Traits:</span> {Array.isArray(preview.traits) ? preview.traits.join(", ") : preview.traits}</p>
                <p><span className="font-semibold text-purple-400">Style:</span> {preview.style}</p>
                <p><span className="font-semibold text-purple-400">Goals:</span> {preview.goals}</p>
                <p><span className="font-semibold text-purple-400">Summary:</span> {preview.summary}</p>
              </div>

              <button
                onClick={() => router.push(`/chat/${preview.name}`)}
                className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-semibold transition hover:-translate-y-1 shadow-lg"
              >
                💬 Start Chat with {preview.name}
              </button>
            </div>
          ) : (
            <p className="text-slate-400">Fill the form to preview your persona here.</p>
          )}
        </motion.div>
      </motion.div>

      <div className="text-center mt-12">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-slate-400 hover:text-white transition underline underline-offset-2"
        >
          ← Back to Homepage
        </button>
      </div>
    </main>
  );
}

function LabeledInput({
  label,
  icon,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block font-medium text-sm text-purple-300">{label}</label>
      <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 transition">
        <span className="text-purple-400 mr-2">{icon}</span>
        <input
          {...props}
          className="bg-transparent w-full outline-none text-white placeholder-slate-500"
        />
      </div>
    </div>
  );
}
