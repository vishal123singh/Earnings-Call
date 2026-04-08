"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Mic,
  SendHorizonalIcon,
  SpeakerIcon,
  Volume,
  Volume1,
  VolumeIcon,
  VolumeOffIcon,
  VolumeX,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const ChatStep = ({
  isOpen,
  setIsOpen,
  onExploreMore,
  handleSwitchToVoice,
}) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResponseDone, setIsResponseDone] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isFinalResponseDone, setIsFinalResponseDone] = useState(false);
  const chatRef = useRef(null); // Create a ref for the chat container

  let audioInstance = useRef(null);

  // 🎧 Play/Stop Speech Using Web Speech API
  const toggleSpeech = (text, index) => {
    if (currentlyPlaying === index) {
      stopSpeech(); // Stop if already playing
      setCurrentlyPlaying(null);
    } else {
      stopSpeech(); // Stop any existing speech
      playSpeech(text, index); // Play new text
    }
  };

  // 🎙️ Play Speech with Female Voice
  const playSpeech = (text, index) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      // Get available voices and select a female voice
      const voices = synth.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Google UK English Female") ||
          voice.name.includes("US English Female"),
      );

      // Use the selected female voice if available, otherwise fallback
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        utterance.voice = voices[0]; // Fallback to default if no female voice found
      }

      utterance.rate = 1; // Adjust speed (1 is normal speed)
      utterance.pitch = 1.2; // Slightly higher pitch for natural effect

      // Play and handle completion
      synth.speak(utterance);
      setCurrentlyPlaying(index);

      utterance.onend = () => setCurrentlyPlaying(null); // Reset after speech ends
    } else {
      console.error("Speech Synthesis API not supported in this browser.");
    }
  };

  // ⏹️ Stop Speech
  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
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
    if (isOpen) {
      resetChat();
      typeResponse(
        `Hi there! I'm Earnings Assistant, your AI assistant for earnings calls. How can I help you today?`,
        true,
      );
    }
    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [isFinalResponseDone]);

  const resetChat = () => {
    setMessages([]);
    setIsGenerating(false);
    setIsResponseDone(false);
    clearInterval(intervalRef.current);
    setIsFinalResponseDone(false);
    stopSpeech();
  };

  const autoTypePrompt = (text) => {
    let i = 0;
    let generatedPrompt = "";

    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        generatedPrompt += text.charAt(i);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.type === "user") {
            return [
              ...prev.slice(0, -1),
              {
                type: "user",
                text: generatedPrompt,
                isTyped: i === text.length,
              },
            ];
          }
          return [
            ...prev,
            { type: "user", text: generatedPrompt, isTyped: i === text.length },
          ];
        });

        i++;
        scrollToBottom();
      } else {
        clearInterval(intervalRef.current);
        handleSend2(text);
      }
    }, 20);
  };

  const handleSend2 = (prompt) => {
    if (!prompt || isGenerating) return;
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      typeResponse(
        `Here are the most common themes and questions that emerged:
  1. Wealth Management Business  
  - Questions about client onboarding processes and regulatory focus  
  - Inquiries on non-U.S. wealth management business size  
  - Interest in growth prospects and ability to onboard new clients...`,
      );
    }, 300);
  };

  const typeResponse = async (text, startPrompt = false) => {
    let i = 0;
    let generatedResponse = "";

    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        generatedResponse += text.charAt(i);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.type === "bot") {
            return [
              ...prev.slice(0, -1),
              {
                type: "bot",
                text: generatedResponse,
                isTyped: i === text.length,
              },
            ];
          }
          return [
            ...prev,
            {
              type: "bot",
              text: generatedResponse,
              isTyped: i === text.length,
            },
          ];
        });

        i++;
        scrollToBottom();
      } else {
        clearInterval(intervalRef.current);
        setIsGenerating(false);
        setIsResponseDone(true);
        if (startPrompt) {
          autoTypePrompt(
            `What are the most common questions asked during the Q&A portion of earnings calls?`,
          );
        } else {
          setIsFinalResponseDone(true);
        }
      }
    }, 20);
  };

  const handleSend = async (prompt) => {
    if (!prompt || isGenerating) return;
    setIsGenerating(true);
    // Add the user's message to the chat and clear the input
    setMessages((prev) => [
      ...prev,
      { type: "user", text: prompt, isTyped: true },
    ]);
    setInputText("");

    try {
      // Call the API endpoint with the user input. Additional parameters can be added as needed.
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

      // Add an empty bot message which we will update as we receive data.
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
                // Update the last message with the accumulated text.
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
      setIsResponseDone(true);
      setIsFinalResponseDone(true);
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
      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed top-0 right-0 w-[360px] h-screen bg-background shadow-2xl flex flex-col border-l border-border z-[5000]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
              {/* Switch to Voice Assistant Button */}
              <motion.button
                onClick={handleSwitchToVoice}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "var(--accent)",
                  boxShadow: "0px 4px 15px rgba(26, 77, 140, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary/80 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg shadow-md border border-primary-foreground/20 transition-all duration-300"
              >
                🎙️ Switch to Voice Assistant
              </motion.button>

              <button
                onClick={closeChat}
                className="ml-2 hover:opacity-80 transition-opacity"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/30">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 shadow-sm rounded-md max-w-[75%] text-sm ${
                    msg.type === "user"
                      ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
                      : "bg-card text-card-foreground mr-auto rounded-bl-none border border-border"
                  }`}
                >
                  {msg.text}
                  {msg.isTyped &&
                    (currentlyPlaying === index ? (
                      <VolumeOffIcon
                        onClick={() => stopSpeech()}
                        className="inline-block ml-2 cursor-pointer text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      />
                    ) : (
                      <Volume1
                        onClick={() => toggleSpeech(msg.text, index)}
                        className="inline-block ml-2 cursor-pointer text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      />
                    ))}
                </motion.div>
              ))}

              {isFinalResponseDone && (
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
                    className="py-3 px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore More
                  </motion.button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Typing Input */}
            <div className="p-4 border-t border-border bg-card">
              <AnimatePresence mode="popLayout">
                <div className="flex flex-row gap-2">
                  <motion.input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSend(inputText)
                    }
                    placeholder="Ask a question..."
                    disabled={isGenerating}
                    className="flex-1 py-2 px-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    onClick={() => handleSend(inputText)}
                    disabled={isGenerating}
                    className={`p-2 rounded-lg transition-all ${
                      isGenerating
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:bg-primary/10"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mic size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleSend(inputText)}
                    disabled={isGenerating}
                    className={`p-2 rounded-lg transition-all ${
                      isGenerating
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:bg-primary/10"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SendHorizonalIcon size={20} />
                  </motion.button>
                </div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Icon */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle
          size={28}
          className="group-hover:scale-110 transition-transform"
        />
      </motion.button>
    </>
  );
};

export default ChatStep;
