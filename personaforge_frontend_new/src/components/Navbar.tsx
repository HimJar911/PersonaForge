"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 fixed top-0 left-0 right-0 z-50 backdrop-blur bg-[#1a1d29cc]">
      {/* Logo */}
      <div
        className="flex items-center gap-2 font-semibold text-lg cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
          🧠
        </div>
        <span>PersonaForge™</span>
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 text-slate-300 font-medium text-sm">
        <li>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
        </li>
        <li>
          <a href="#templates" className="hover:text-white transition-colors">
            Templates
          </a>
        </li>
        <li>
          <Link href="/personas" className="hover:text-white transition-colors">
            My Personas
          </Link>
        </li>
      </ul>
      {/* CTA */}
      <button
        onClick={() => router.push("/forge")}
        className="bg-gradient-to-br from-purple-600 to-purple-500 text-white px-5 py-2 rounded-xl font-semibold hover:-translate-y-1 transition"
      >
        Get Started
      </button>
    </nav>
  );
}
