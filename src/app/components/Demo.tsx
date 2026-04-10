"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Sparkles } from "lucide-react";

const SAMPLE_RESPONSE =
  "JPM reported strong earnings driven by investment banking (+23%) and record net interest income of $24.5B. Sentiment is positive with strong forward guidance.";

export function DemoModal({ open, setOpen }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: input },
      { type: "ai", text: SAMPLE_RESPONSE },
    ]);

    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-3xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-primary to-secondary text-white">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4" />
                AI Earnings Terminal (Demo)
              </div>

              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHAT */}
            <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Try: “Summarize JPM earnings” or “What are risks?”
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                      m.type === "user" ? "bg-primary text-white" : "bg-muted"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t p-4 flex gap-2 bg-muted/30">
              <button className="p-2 rounded-lg hover:bg-muted">
                <Mic className="w-5 h-5 text-muted-foreground" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about earnings..."
                className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm"
              />

              <button
                onClick={send}
                className="btn-premium px-4 py-2 flex gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
