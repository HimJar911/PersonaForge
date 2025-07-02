"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 text-white">
      {/* Left: Content */}
      <div className="flex-1">
        <div className="inline-block bg-purple-800/20 text-purple-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
          ✨ AI-Powered Personas
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Forge Emotionally Intelligent AI Personas
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          Create unique AI personas with distinct traits, expertise, and communication styles that think, write, and evolve like real human minds.
        </p>
        <button
          onClick={() => router.push("/forge")}
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Start Creating Personas →
        </button>
      </div>

      {/* Right: Brain Orb Animation */}
      <div className="flex-1 flex justify-center items-center mt-12 md:mt-0">
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          {/* Orbit Rings */}
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border-2 border-dashed border-white/20 rounded-full animate-spin-reverse-slower -translate-x-1/2 -translate-y-1/2"></div>

          {/* Orbit Dots */}
          <div className="absolute w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white text-lg top-0 left-1/2 -translate-x-1/2">
            💬
          </div>
          <div className="absolute w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white text-lg right-0 top-1/2 -translate-y-1/2">
            ✨
          </div>

          {/* Brain Core */}
          <div className="absolute w-72 h-72 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-5xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            🧠
          </div>
        </div>
      </div>
    </section>
  );
}
