"use client";
import {
  Mic,
  Send,
  ChevronDown,
  SendHorizonalIcon,
  X,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import {
  companies,
  quarters,
  suggestedQuestions,
  years,
} from "../../../public/data";
import { Menu, MenuButton, MenuItem } from "@headlessui/react";
import { setFilterConfig } from "../../../store/sidebarSlice";
import VoiceRecorder from "@/components/ui/voice-input";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import TranscriptSearch from "@/components/SearchTranscripts";

const options = Object.entries(suggestedQuestions).map(([category, data]) => ({
  label: category,
  value: category,
  submenu: Object.entries(data).flatMap(([_, questions]) =>
    questions.map((q) => ({ label: q, value: q })),
  ),
}));

export default function AggregateDashboard() {
  const dispatch = useDispatch();

  const [chats, setChats] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(suggestedQuestions)[0],
  );
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [fetchUploadChats, setFetchUploadChats] = useState([]);
  const [previousPrompts, setPreviousPrompts] = useState([]);

  const messagesEndRef = useRef(null);

  const foundationModel = useSelector((state) => state.sidebar.foundationModel);
  const fmTemperature = useSelector((state) => state.sidebar.fmTemperature);
  const fmMaxTokens = useSelector((state) => state.sidebar.fmMaxTokens);
  const context = useSelector((state) => state.sidebar.context);
  const persona = useSelector((state) => state.sidebar.persona);
  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/open-router`;

  useEffect(() => {
    dispatch(
      setFilterConfig({
        companies,
        years,
        quarters,
        selectProps: {
          companies: {
            isMulti: true,
            maxSelected: 5,
            placeholder: "Select companies",
          },
          years: { isMulti: false, placeholder: "Select a year" },
          quarters: { isMulti: false, placeholder: "Select a quarter" },
          persona: { isMulti: false, placeholder: "Select persona" },
          model: { isMulti: false, placeholder: "Select model" },
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (!chats.length) {
      setChats([
        {
          role: "assistant",
          content: "👋 Hi there! How can I assist you today?",
        },
      ]);
    }
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setInputText(
      `${inputValue} ${
        selectedCompanies.length ? "for " + selectedCompanies.join(", ") : ""
      } ${selectedQuarter ? "for the " + selectedQuarter + " quarter" : ""} ${
        selectedYear ? "of " + selectedYear : ""
      }`,
    );
  }, [inputValue, selectedCompanies, selectedQuarter, selectedYear]);

  const getAgentResponse = async () => {
    try {
      setLoading(true);
      setInputText("");
      setInputValue("");

      const updatedChats = [...chats, { role: "user", content: inputValue }];
      setChats(updatedChats);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          inputValue,
          chats,
          context,
          persona,
          foundationModel,
          fmTemperature,
          fmMaxTokens,
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
        if (done) break;
        resultText += decoder.decode(value, { stream: true });
        const sanitized = DOMPurify.sanitize(resultText);
        setChats((prev) => [
          ...prev.slice(0, updatedChats.length),
          { role: "assistant", content: sanitized },
        ]);
      }

      setPreviousPrompts((prev) => [...prev, inputText]);
    } catch (error) {
      console.error("Error fetching agent response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => setSelectedCategory(value);
  const handleButtonClick = (question) => {
    setInputValue(question);
    setSelectedQuestion(question);
  };
  const onPromptSubmit = (e) => {
    e.preventDefault();
    if (!selectedCompanies.length)
      return alert("Please select at least one company");
    if (!inputValue.trim()) return alert("Please provide some input");
    getAgentResponse();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Head>
        <title>Aggregate Business Insights</title>
      </Head>

      <div className="container mx-auto p-6">
        <div className="mt-6 mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Category
          </label>
          <SelectWithSubmenu
            className="w-full rounded-lg p-2 focus:ring-2 transition-all"
            style={{
              border: `1px solid var(--border)`,
              background: "var(--background)",
              color: "var(--foreground)",
            }}
            handleCategoryChange={handleCategoryChange}
            handleButtonClick={handleButtonClick}
          />
        </div>

        {/* <TranscriptSearch /> */}

        {/* Commented out button - kept for reference */}
        {/* <button
          onClick={() => setIsChatOpen(true)}
          className="mb-4 px-4 py-2 rounded-lg transition duration-300"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            color: "var(--primary-foreground)",
          }}
        >
          Upload Earnings Call Transcripts
        </button> */}

        <div
          className="h-[55vh] overflow-y-auto shadow-md rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--muted)",
            border: `1px solid var(--border)`,
          }}
        >
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`w-full p-4 rounded-xl shadow-sm border transition-transform duration-300 ${
                chat.role === "user"
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10"
                  : "bg-card"
              }`}
              style={{
                borderColor: "var(--border)",
                color:
                  chat.role === "user" ? "var(--primary)" : "var(--foreground)",
              }}
            >
              <div className="prose ml-4 leading-relaxed font-medium break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {chat.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div
                className="animate-spin h-10 w-10 rounded-full border-t-4"
                style={{ borderTopColor: "var(--primary)" }}
              ></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <BusinessInsightsForm
          inputValue={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={onPromptSubmit}
          onVoiceInput={(input) => setInputValue(input)}
        />
        <FetchUploadPopUp
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          chats={fetchUploadChats}
          setChats={setFetchUploadChats}
        />
      </div>
    </div>
  );
}

function FetchUploadPopUp({ isOpen, setIsOpen, chats, setChats }) {
  const [inputText, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/fetch-upload-v2`;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollViewRef.current]);

  const getAgentResponse = async () => {
    try {
      setLoading(true);
      setInput("");
      let length = chats.length;
      setChats((prev) => {
        let temp = [
          ...prev,
          {
            id: length + 1,
            text: inputText,
            sender: "user",
          },
        ];

        return temp;
      });
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: inputText,
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
          break;
        }
        resultText += decoder.decode(value, { stream: true });

        setChats((prev) => {
          let temp = [...prev];
          temp[length + 1] = { ...temp[length + 1], text: resultText };
          return temp;
        });
      }
    } catch (error) {
      setChats((prev) => {
        prev.pop();
        return prev;
      });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission (if inside a form)
      getAgentResponse();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-[9999]">
      <div
        style={{
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
          border: 2,
          borderColor: "blue",
        }}
        className="bg-white shadow-2xl rounded-2xl p-4 m-4 mb-8 h-[500px] w-[800px] flex flex-col"
      >
        <div className="flex justify-center items-center pb-0">
          <h3 className="text-lg font-medium text-gray-700">
            Upload Earnings Calls Transcripts To Get Insights
          </h3>
          <Button
            className="absolute r-0"
            onClick={() => {
              setIsOpen(false);
              setLoading(false);
              setInput("");
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <section className="mt-3 p-4 text-gray-600 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-sm">
              <span className="font-semibold">Prompt type 1:&nbsp;</span>
              Ticker=<span className="text-blue-600">SOFI</span>, Year=
              <span className="text-blue-600">2024</span>, Quarters=
              <span className="text-blue-600">4</span>
            </p>
            <p className="text-sm mt-2">
              <span className="font-semibold">Prompt type 2:&nbsp;</span>
              Ticker=<span className="text-blue-600">[SOFI, JPM, MS]</span>,
              Year=<span className="text-blue-600">2024</span>, Quarters=
              <span className="text-blue-600">4</span>
            </p>
          </section>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex-1 overflow-y-auto">
            {chats.map((msg, index) => (
              <section
                style={{ marginBottom: msg.id % 2 === 0 ? "60px" : "30px" }}
                key={index}
                className={`flex-1 overflow-y-auto p-[20px] rounded text-sm-200 ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                <div className="prose ml-6 custom-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </section>
            ))}
          </div>

          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Uploading transcripts...</p>
            </div>
          )}

          <div ref={scrollViewRef}></div>
        </div>
        <div className="border-t pt-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border-none outline-none px-3 py-2 rounded-lg bg-gray-200"
            onChange={(e) => setInput(e.target.value)}
            value={inputText}
            onKeyDown={handleKeyDown}
          />
          <SendHorizonalIcon
            onClick={getAgentResponse}
            className="w-5 h-5 ml-2"
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}

const SelectWithSubmenu = ({
  className,
  handleCategoryChange,
  handleButtonClick,
}) => {
  const [selected, setSelected] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const submenuRef = useRef(null);
  const parentOptionRef = useRef({});
  let closeTimeout = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    setOpenSubmenu(null);
    setIsOpen(false);
  };

  useEffect(() => {
    if (typeof window != undefined) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          (!submenuRef.current || !submenuRef.current.contains(event.target))
        ) {
          setIsOpen(false);
          setOpenSubmenu(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const openSubmenuWithDelay = (value) => {
    clearTimeout(closeTimeout.current);
    setOpenSubmenu(value);
  };

  const closeSubmenuWithDelay = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 100);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Menu as="div" className="relative" open={isOpen} onChange={setIsOpen}>
        <MenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={`${className} px-5 py-2.5 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-0 group`}
          style={{
            background: isOpen
              ? "rgba(37, 99, 235, 0.15)"
              : "rgba(37, 99, 235, 0.08)",
            color: "var(--primary)",
            border: `1px solid ${isOpen ? "var(--primary)" : "rgba(37, 99, 235, 0.3)"}`,
            boxShadow: isOpen ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="max-w-[12rem] truncate text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              {selected || "Select a question"}
            </span>
            <ChevronDown
              size={18}
              style={{ color: "var(--primary)" }}
              className={`transition-all duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </MenuButton>

        {isOpen && (
          <div
            className="absolute z-50 mt-2 min-w-[16rem] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: "var(--background)",
              border: `1px solid var(--border)`,
            }}
          >
            <div className="max-h-[55vh] overflow-y-auto py-1">
              {options?.map((option) => (
                <div key={option.value} className="relative">
                  {option.submenu ? (
                    <>
                      {/* Main Option with Submenu Indicator */}
                      <button
                        ref={(el) =>
                          (parentOptionRef.current[option.value] = el)
                        }
                        onMouseEnter={() => openSubmenuWithDelay(option.value)}
                        onMouseLeave={closeSubmenuWithDelay}
                        className="w-full text-left px-4 py-2.5 font-medium transition-all duration-150 text-sm flex items-center justify-between group"
                        style={{
                          color: "var(--foreground)",
                        }}
                        title={option.label}
                      >
                        <span>{option.label}</span>
                        <ChevronRight
                          size={14}
                          style={{ color: "var(--muted-foreground)" }}
                          className="group-hover:translate-x-0.5 transition-transform duration-200"
                        />
                      </button>

                      {/* Submenu */}
                      {openSubmenu === option.value &&
                        createPortal(
                          <div
                            ref={submenuRef}
                            className="absolute z-50 rounded-xl shadow-xl overflow-y-auto max-w-[80vw] min-w-[14rem] animate-in fade-in zoom-in-95 duration-150"
                            style={{
                              position: "fixed",
                              top:
                                parentOptionRef.current[
                                  option.value
                                ]?.getBoundingClientRect().top || 0,
                              left:
                                parentOptionRef.current[
                                  option.value
                                ]?.getBoundingClientRect().right || 0,
                              background: "var(--background)",
                              border: `1px solid var(--border)`,
                            }}
                            onMouseEnter={() =>
                              openSubmenuWithDelay(option.value)
                            }
                            onMouseLeave={closeSubmenuWithDelay}
                          >
                            <div className="py-1">
                              {option?.submenu?.map((subOption) => (
                                <button
                                  key={subOption.value}
                                  onClick={() => {
                                    handleSelect(option.value);
                                    handleCategoryChange(option.value);
                                    handleButtonClick(subOption.value);
                                    setIsOpen(false);
                                  }}
                                  className="block w-full px-4 py-2.5 text-left transition-all duration-150 hover:scale-[1.02] text-sm"
                                  style={{
                                    color: "var(--foreground)",
                                    background: "transparent",
                                  }}
                                  title={subOption.label}
                                >
                                  {subOption.label}
                                </button>
                              ))}
                            </div>
                          </div>,
                          document.body,
                        )}
                    </>
                  ) : (
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            handleSelect(option.value);
                            setIsOpen(false);
                          }}
                          className={`block w-full px-4 py-2.5 text-left transition-all duration-150 text-sm ${
                            active ? "scale-[1.02]" : ""
                          }`}
                          style={{
                            background: active
                              ? "rgba(37, 99, 235, 0.08)"
                              : "transparent",
                            color: active
                              ? "var(--primary)"
                              : "var(--foreground)",
                          }}
                          title={option.label}
                        >
                          <div className="flex items-center gap-2">
                            {option.icon && (
                              <span style={{ color: "var(--primary)" }}>
                                {option.icon}
                              </span>
                            )}
                            <span>{option.label}</span>
                          </div>
                        </button>
                      )}
                    </MenuItem>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Menu>
    </div>
  );
};

function BusinessInsightsForm({
  inputValue,
  onChange,
  onSubmit,
  onVoiceInput,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 flex items-center rounded-full shadow-lg transition-all duration-300 focus-within:shadow-xl relative group"
      style={{
        background: "var(--background)",
        border: `1px solid var(--border)`,
      }}
    >
      {/* Animated border gradient on focus */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--secondary), var(--tertiary))",
          padding: "2px",
          borderRadius: "9999px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        placeholder="Ask about business insights..."
        className="flex-1 px-5 py-3.5 bg-transparent outline-none rounded-l-full text-sm relative z-10"
        style={{
          color: "var(--foreground)",
        }}
      />

      {/* Character Counter (Optional) */}
      {inputValue.length > 0 && (
        <div
          className="text-xs px-2 relative z-10"
          style={{ color: "var(--muted-foreground)" }}
        >
          {inputValue.length}/500
        </div>
      )}

      {/* Mic Button */}
      <div className="relative z-10">
        <VoiceRecorder onVoiceInput={onVoiceInput} />
      </div>

      {/* Divider */}
      <div
        className="w-px h-6 mx-1 relative z-10"
        style={{ background: "var(--border)" }}
      />

      {/* Send Button */}
      <button
        type="submit"
        className="p-2.5 mr-1.5 transition-all duration-300 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        style={{
          background: inputValue.trim()
            ? "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)"
            : "var(--muted)",
          color: inputValue.trim()
            ? "var(--primary-foreground)"
            : "var(--muted-foreground)",
          boxShadow: inputValue.trim()
            ? "0 4px 12px rgba(37, 99, 235, 0.3)"
            : "none",
        }}
        disabled={!inputValue.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
