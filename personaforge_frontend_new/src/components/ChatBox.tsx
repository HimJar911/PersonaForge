"use client";

import React, { useEffect, useState } from "react";
import { chatWithPersona, saveFactToMemory } from "@/lib/api";

interface ChatBoxProps {
  personaName: string;
  personaPrompt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox({ personaName, personaPrompt }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);

  // ✅ Load chat history
  useEffect(() => {
    const stored = localStorage.getItem(`chat_history_${personaName}`);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        console.warn("⚠️ Failed to parse stored history");
        setHistory([]);
      }
    }
  }, [personaName]);

  // ✅ Save updated history
  const persistHistory = (newHistory: Message[]) => {
    setHistory(newHistory);
    localStorage.setItem(`chat_history_${personaName}`, JSON.stringify(newHistory));
  };

  // ✅ Fact extractor (simple regex)
  const extractFacts = (text: string): string[] => {
    const facts: string[] = [];
    const regex = /(?:My name is|I'm|I am|I like|I love|My goal is)\s+[^.\n]+/gi;
    let match;
    while ((match = regex.exec(text))) {
      facts.push(match[0]);
    }
    return facts;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    const updatedHistory = [...history, userMsg];
    persistHistory(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      // 🧠 Extract and save facts before sending
      const facts = extractFacts(input);
      for (const fact of facts) {
        await saveFactToMemory(personaName, fact);
      }

      const reply = await chatWithPersona(personaName, personaPrompt, input);
      const assistantMsg: Message = { role: "assistant", content: reply };
      persistHistory([...updatedHistory, assistantMsg]);
    } catch (err) {
      console.error("❌ Error during chat:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      {/* ✅ Message History */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              msg.role === "user"
                ? "bg-gray-800 border-gray-600 text-white text-right"
                : "bg-purple-900/30 border-purple-700 text-purple-200 text-left"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* ✅ Chat Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-600"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
