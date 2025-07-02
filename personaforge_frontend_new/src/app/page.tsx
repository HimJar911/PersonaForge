"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PersonaGrid from "@/components/PersonaGrid";
import Footer from "@/components/Footer";
import { predefinedPersonas } from "@/data/predefinedPersonas";

const extendedPersonas = [
  {
    ...predefinedPersonas.Raven,
    useCase: "Business strategy & decision making",
    theme: "raven",
  },
  {
    ...predefinedPersonas.Sage,
    useCase: "Personal development & guidance",
    theme: "sage",
  },
  {
    ...predefinedPersonas.Icarus,
    useCase: "Creative projects & ideation",
    theme: "icarus",
  },
  {
    ...predefinedPersonas.Zenith,
    useCase: "Analysis & research",
    theme: "zenith",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-gradient-to-br from-[#1a1d29] to-[#2d3748] text-white">
      <Navbar />
      <Hero />
      <Features id="features" />

      {/* ✅ Templates section */}
      <PersonaGrid id="templates" personas={extendedPersonas} />

      {/* ✅ CTA to forge page */}
      <div className="text-center mt-20">
      </div>

      <Footer />
    </main>
  );
}
