"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { MessageCircle, MicIcon, SendHorizonalIcon, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { companies } from "../../../../public/data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import VoiceRecorder from "./voice-input";
import { ParentContext } from "@/clientLayout";

interface Chat {
  content: any;
  role: "user" | "assistant";
}

interface ChatBoxProps {
  isOpen: boolean;
  toggleChat: () => void;
  chats: any;
  setChats: any;
  showChat1?: boolean;
  showChat2?: boolean;
  chartId?: string;
  userPrompts?: any;
  setUserPrompts?: any;
}

function ChatBox({
  isOpen,
  toggleChat,
  chats,
  setChats,
  showChat1 = true,
  showChat2 = false,
  chartId,
  userPrompts,
  setUserPrompts,
}: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [greetingShown, setGreetingShown] = useState(false);
  const { isVoiceAssistantOpen, setIsVoiceAssistantOpen } =
    useContext(ParentContext);

  const selectedCompanies = useSelector(
    (state: any) => state?.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state: any) => state?.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state?.sidebar.selectedQuarter,
  );
  const selectedModel = useSelector(
    (state: any) => state?.sidebar.foundationModel,
  );
  const selectedPersona = useSelector((state: any) => state?.sidebar.persona);

  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/common-chat`;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  // Show greeting when chatbox is opened for the first time
  useEffect(() => {
    if (isOpen && !greetingShown && !chats.length && showChat1) {
      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "👋 Hi there! How can I assist you today?",
        },
      ]);
      setGreetingShown(true);
    }
  }, [isOpen, greetingShown]);

  const handleOpenChat = () => {
    toggleChat();
  };

  // Close chatbox when clicking outside
  useEffect(() => {
    if (typeof window != undefined) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          chatBoxRef.current &&
          !chatBoxRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          toggleChat(); // Close chatbox if click is outside
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, toggleChat]);

  const getAgentResponse = async () => {
    try {
      if (!selectedCompanies?.length) {
        alert("Please select at least one company.");
        return;
      }
      if (!selectedYear) {
        alert("Please select a year.");
        return;
      }
      if (!selectedQuarter) {
        alert("Please select a quarter.");
        return;
      }

      setLoading(true);
      let length = chats.length;

      if (showChat1) {
        setChats((prev: Chat[]) => [
          ...prev,
          {
            role: "user",
            content: input,
          },
        ]);
        setInput("");
        if (messagesEndRef.current) {
          (messagesEndRef.current as any).scrollIntoView({
            behavior: "smooth",
          });
        }
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputText: input,
            chats: chats,
            context: "",
            persona: selectedPersona,
            foundationModel: selectedModel,
            previousPrompts,
            selectedCompanies,
            selectedQuarter,
            selectedYear,
          }),
        });

        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let resultText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setLoading(false);
            setPreviousPrompts((prev: string[]) => [...prev, input]);
            break;
          }
          resultText += decoder.decode(value, { stream: true });
          const sanitizedMarkdown = DOMPurify.sanitize(resultText);
          setChats((prev) => {
            let temp = [...prev];
            temp[length + 1] = {
              role: "assistant",
              content: sanitizedMarkdown,
            };
            return temp;
          });
          if (messagesEndRef.current) {
            (messagesEndRef.current as any).scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      } else {
        await handleGenerateChart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitchToVoice = () => {
    toggleChat();
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  const handleGenerateChart = async () => {
    try {
      if (!input.trim()) return;
      if (!selectedCompanies?.length) {
        alert("Please select at least one company.");
        return;
      }
      if (!selectedYear) {
        alert("Please select a year.");
        return;
      }
      if (!selectedQuarter) {
        alert("Please select a quarter.");
        return;
      }
      let length = chats.length;
      console.log("input", input);
      setChats((prev) => [
        ...prev,
        {
          role: "user",
          content: input,
        },
      ]);
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      //setIsLoading(true);
      const response = await fetch("/api/charts-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          companies: selectedCompanies,
          chartData: chats,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      // setChats((prev) => {
      //   let temp = [];
      //   // if (prev.length > 0) {
      //   //   temp = [...prev];
      //   // }
      //   if (Array.isArray(data.data)) {
      //     temp.unshift(...data.data); // Spread array items
      //   } else {
      //     temp.unshift(data.data); // Add single object
      //   }
      //   return temp;
      // });
      setChats((prev) => {
        let temp = [...prev];
        temp[data.data.chartId != null ? data.data.chartId : length + 1] = {
          role: "assistant",
          content: data.data,
        };
        return temp;
      });
      if (messagesEndRef.current) {
        (messagesEndRef.current as any).scrollIntoView({
          behavior: "smooth",
        });
      }
      return data;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {showChat1 ? (
        <>
          {!isOpen && (
            <motion.button
              ref={buttonRef}
              onClick={handleOpenChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-4 right-4 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
            >
              <MessageCircle size={28} />
            </motion.button>
          )}

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 w-[350px] sm:w-[400px] md:w-[450px] h-full bg-white dark:bg-gray-900 shadow-2xl z-[10000] flex flex-col overflow-hidden"
              >
                {/* Premium Header - Enhanced from first design */}
                <div className="relative px-5 py-4 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white">
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
                          Real-time financial intelligence
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={handleSwitchToVoice}
                        whileHover={{ scale: 1.05, backgroundColor: "#8E44AD" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md border border-purple-400 transition-all duration-300"
                      >
                        🎙️ Voice
                      </motion.button>
                      <button
                        onClick={toggleChat}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Area - Enhanced with first design styling */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 scroll-smooth">
                  <AnimatePresence mode="popLayout">
                    {chats.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: msg.role === "user" ? 20 : -20,
                          scale: 0.95,
                        }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        transition={{ type: "spring", damping: 20 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[85%] sm:max-w-[75%]">
                          <div
                            className={`text-sm p-3.5 rounded-2xl shadow-md ${
                              msg.role === "user"
                                ? "rounded-br-md bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
                                : "rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            }`}
                          >
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                              >
                                {msg.role === "user"
                                  ? msg.content
                                  : msg.content.insights || msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <div
                            className={`text-[10px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : ""}`}
                          >
                            {msg.role === "user"
                              ? "Just now"
                              : "InvestorEye AI"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading Indicator - Enhanced */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                        <div className="flex gap-1.5">
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Enhanced from first design */}
                <div className="relative p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 relative">
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                        placeholder="Ask InvestorEye about markets, earnings, or trends..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && getAgentResponse()
                        }
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] text-gray-400">⌘K</span>
                      </div>
                    </div>
                    <VoiceRecorder
                      onVoiceInput={(text: string) => setInput(text)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={getAgentResponse}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                    >
                      <SendHorizonalIcon size={20} />
                    </motion.button>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px] text-gray-400 justify-center">
                    <span>💡 Try: "Compare with Goldman Sachs"</span>
                    <span>⚡ "Risk analysis"</span>
                  </div>
                </div>

                {/* Decorative glow effects from first design */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="h-full bg-white dark:bg-gray-900 shadow-lg flex flex-col overflow-hidden">
          {/* Premium Header */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
                </div>
                <div>
                  <span className="font-semibold text-base tracking-tight">
                    AI Assistant
                  </span>
                  <p className="text-xs opacity-90">Powered by InvestorEye</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area - Enhanced */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <AnimatePresence mode="popLayout">
              {chats.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: msg.role === "user" ? 20 : -20,
                    scale: 0.95,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%] sm:max-w-[75%]">
                    <div
                      className={`text-sm p-3.5 rounded-2xl shadow-md ${
                        msg.role === "user"
                          ? "rounded-br-md bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
                          : "rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {msg.role === "user"
                            ? msg.content
                            : msg.content.insights || msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div
                      className={`text-[10px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : ""}`}
                    >
                      {msg.role === "user" ? "Just now" : "InvestorEye AI"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Enhanced */}
          <div className="relative p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && getAgentResponse()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <span className="text-[10px] text-gray-400">⌘K</span>
                </div>
              </div>
              <VoiceRecorder onVoiceInput={(text: string) => setInput(text)} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getAgentResponse}
                className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
              >
                <SendHorizonalIcon size={20} />
              </motion.button>
            </div>
            <div className="flex gap-3 mt-2 text-[10px] text-gray-400 justify-center">
              <span>💡 Try: "Compare with Goldman Sachs"</span>
              <span>⚡ "Risk analysis"</span>
            </div>
          </div>

          {/* Decorative glow effects */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}
    </>
  );
}

export default ChatBox;
