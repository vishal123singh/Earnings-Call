"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Mic,
  SendHorizonalIcon,
  Volume1,
  VolumeOffIcon,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

const ChatStep = ({
  isOpen,
  setIsOpen,
  onExploreMore,
  handleSwitchToVoice,
  isUserLoggedIn,
}) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const chatRef = useRef(null);
  const [hasSentGreeting, setHasSentGreeting] = useState(false);

  let audioInstance = useRef(null);

  // 🎧 Play/Stop Speech Using Web Speech API
  const toggleSpeech = (text, index) => {
    if (currentlyPlaying === index) {
      stopSpeech();
      setCurrentlyPlaying(null);
    } else {
      stopSpeech();
      playSpeech(text, index);
    }
  };

  // 🎙️ Play Speech with Female Voice
  const playSpeech = (text, index) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Google UK English Female") ||
          voice.name.includes("US English Female"),
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        utterance.voice = voices[0];
      }

      utterance.rate = 1;
      utterance.pitch = 1.2;

      synth.speak(utterance);
      setCurrentlyPlaying(index);

      utterance.onend = () => setCurrentlyPlaying(null);
    } else {
      console.error("Speech Synthesis API not supported in this browser.");
    }
  };

  // ⏹️ Stop Speech
  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setCurrentlyPlaying(null);
    }
  };

  // Close chat on outside click
  useEffect(() => {
    if (typeof window != undefined) {
      function handleClickOutside(event) {
        if (chatRef.current && !chatRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasSentGreeting) {
      resetChat();
      // Add greeting message when chat opens
      setMessages([
        {
          type: "bot",
          text: "Hi there! I'm EyeQ, your AI assistant for financial insights. How can I help you today?",
          isTyped: true,
        },
      ]);
      setHasSentGreeting(true);
    }
  }, [isOpen, hasSentGreeting]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetChat = () => {
    setMessages([]);
    setIsGenerating(false);
    stopSpeech();
    setHasSentGreeting(false);
  };

  const handleSend = async (prompt) => {
    if (!prompt || isGenerating) return;

    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      { type: "user", text: prompt, isTyped: true },
    ]);
    setInputText("");

    try {
      const res = await fetch("/api/ai-voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullResponse = "";

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "", isTyped: true },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr !== "[DONE]" && jsonStr) {
              try {
                const data = JSON.parse(jsonStr);
                const chunkText = data.text;
                fullResponse += chunkText;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: fullResponse,
                  };
                  return updated;
                });
                scrollToBottom();
              } catch (err) {
                console.error("Error parsing JSON", err);
              }
            }
          }
        }
      }
      setIsGenerating(false);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setIsGenerating(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeChat = () => {
    resetChat();
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Drawer - Premium Design from InvestorEye */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 z-[5000]"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Header - Enhanced with InvestorEye style */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
                  </div>
                  <div>
                    <span className="font-semibold text-base tracking-tight">
                      InvestorEye AI
                    </span>
                    <p className="text-xs opacity-90">
                      AI-powered financial insights
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <motion.button
                    onClick={handleSwitchToVoice}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                  >
                    🎙️ Voice
                  </motion.button> */}

                  <motion.button
                    onClick={closeChat}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Chat Messages - Enhanced with premium styling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: msg.type === "user" ? 20 : -20 }}
                    transition={{ type: "spring", damping: 20 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%]">
                      <div
                        className={`p-3.5 rounded-2xl shadow-lg ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-br-md shadow-primary/20"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700 shadow-md"
                        }`}
                      >
                        <span className="text-sm leading-relaxed">
                          {msg.text}
                        </span>
                        {msg.isTyped && (
                          <button
                            onClick={() => toggleSpeech(msg.text, index)}
                            className="inline-flex ml-2 align-middle"
                          >
                            {currentlyPlaying === index ? (
                              <VolumeOffIcon className="w-3.5 h-3.5 text-current opacity-70 hover:opacity-100 transition-opacity" />
                            ) : (
                              <Volume1 className="w-3.5 h-3.5 text-current opacity-70 hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        )}
                      </div>
                      <div
                        className={`text-[10px] text-gray-400 mt-1 ${msg.type === "user" ? "text-right" : "text-left"}`}
                      >
                        {msg.type === "user" ? "You" : "InvestorEye AI"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator - Premium */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-5 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Explore More Button - Premium */}
              {messages.length > 0 && !isUserLoggedIn && (
                <motion.div
                  key="explore-container"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="flex justify-center my-4"
                >
                  <motion.button
                    key="explore"
                    onClick={() => {
                      onExploreMore();
                      setIsOpen(false);
                    }}
                    className="py-3 px-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore More →
                  </motion.button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Premium Design */}
            <div className="relative p-5 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !isGenerating &&
                      handleSend(inputText)
                    }
                    placeholder={
                      isGenerating ? "AI is thinking..." : "Ask a question..."
                    }
                    disabled={isGenerating}
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <span className="text-[10px] text-gray-400">⌘K</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => !isGenerating && handleSend(inputText)}
                  disabled={isGenerating}
                  className={`p-2.5 rounded-xl transition-all ${
                    isGenerating
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl"
                  }`}
                  whileHover={!isGenerating ? { scale: 1.02 } : {}}
                  whileTap={!isGenerating ? { scale: 0.98 } : {}}
                >
                  <Mic size={18} />
                </motion.button>

                <motion.button
                  onClick={() => !isGenerating && handleSend(inputText)}
                  disabled={isGenerating}
                  className={`p-2.5 rounded-xl transition-all ${
                    isGenerating
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl"
                  }`}
                  whileHover={!isGenerating ? { scale: 1.02 } : {}}
                  whileTap={!isGenerating ? { scale: 0.98 } : {}}
                >
                  <SendHorizonalIcon size={18} />
                </motion.button>
              </div>

              <div className="flex gap-3 mt-3 text-[10px] text-gray-400 justify-center">
                <span>✨ AI-powered earnings insights</span>
                <span>🔊 Voice enabled</span>
                <span>💡 Real-time analysis</span>
              </div>
            </div>

            {/* Decorative glow effects from InvestorEye */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Icon - Premium Design */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary/30 opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <MessageCircle
            size={26}
            className="group-hover:scale-110 transition-transform relative z-10"
          />
        </div>
      </motion.button>
    </>
  );
};

export default ChatStep;
