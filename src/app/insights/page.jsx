"use client";
import { Mic, Send, ChevronDown } from "lucide-react";
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
    <div className="flex flex-col h-full bg-white text-gray-800">
      <Head>
        <title>Aggregate Business Insights</title>
      </Head>

      <div className="container mx-auto p-6">
        <div className="mt-6 mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Category
          </label>
          <SelectWithSubmenu
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            handleCategoryChange={handleCategoryChange}
            handleButtonClick={handleButtonClick}
          />
        </div>

        <div className="h-[55vh] overflow-y-auto bg-purple-50 shadow-md rounded-2xl p-6 space-y-4 border border-purple-200">
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`w-full p-4 rounded-xl shadow-sm border transition-transform duration-300 ${
                chat.role === "user"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-white text-gray-700"
              }`}
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
              <div className="animate-spin h-10 w-10 border-t-4 border-purple-500 rounded-full"></div>
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
      </div>
    </div>
  );
}

function FetchUploadPopUp({ isOpen, setIsOpen, chats, setChats }) {
  const [inputText, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/fetch-upload`;

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

  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>Aggregate Business Insights</title>
      </Head>

      <main className="container mx-auto p-6 bg-gradient-to-br from-[#1e1e2f] to-[#121212] text-white rounded-xl shadow-2xl">
        <div className="backdrop-blur-xl bg-white/5 p-6 w-full h-full shadow-2xl rounded-2xl border border-gray-700">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">
                Category
              </label>
              <SelectWithSubmenu className="w-full border border-gray-600 bg-[#1e1e2f] text-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 p-3 transition-transform duration-300 hover:scale-105" />
            </div>
          </div>

          {/* Chat Window */}
          <div className="h-[60vh] overflow-y-auto bg-[#1b1b2b] shadow-inner p-6 space-y-4 rounded-lg border border-gray-700">
            {chats?.map((m, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-md ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-800 text-gray-300"
                } shadow-md`}
              >
                <span
                  className={`font-medium ${
                    m.role === "user" ? "text-blue-300" : "text-green-400"
                  }`}
                >
                  {m.role === "user" ? "User: " : "AI: "}
                </span>
                <div className="prose ml-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                <div className="mt-4">
                  {m.role === "assistant" &&
                    chartData?.chartData?.length > 0 && (
                      <DynamicChart
                        data={chartData?.chartData}
                        chartType={chartData?.chartType}
                      />
                    )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50" />
                <p className="text-sm text-gray-500 mt-2">
                  Generating response...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedCompanies.length) {
                return alert("Please select at least one company");
              }
              getAgentResponse();
            }}
            className="mt-4 flex items-center bg-[#1e1e2f] border border-gray-700 rounded-lg shadow-md"
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChangeWithCompany}
              placeholder="Type your question..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-r-lg transition-transform duration-300 hover:scale-105 hover:from-purple-600 hover:to-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      </main>
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
          className={`${className} px-5 py-2 rounded-md bg-purple-100 text-purple-700 border border-purple-300 shadow-sm hover:bg-purple-200 transition duration-200 outline-none focus:ring-0 focus:ring-purple-400`}
        >
          <div className="flex items-center justify-between">
            <span className="w-[12.5rem] truncate">
              {selected || "Select a question"}
            </span>
            <ChevronDown size={20} className="text-purple-500" />
          </div>
        </MenuButton>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-64 rounded-lg bg-white shadow-lg border border-purple-200 overflow-hidden">
            <div className="max-h-[55vh] overflow-y-auto">
              {options?.map((option) => (
                <div key={option.value} className="relative">
                  {option.submenu ? (
                    <>
                      {/* Main Option */}
                      <button
                        ref={(el) =>
                          (parentOptionRef.current[option.value] = el)
                        }
                        onMouseEnter={() => openSubmenuWithDelay(option.value)}
                        onMouseLeave={closeSubmenuWithDelay}
                        className="w-full text-left px-4 py-2 hover:bg-purple-100 font-medium text-purple-700 transition duration-150 text-sm"
                        title={option.label}
                      >
                        {option.label}
                      </button>

                      {/* Submenu */}
                      {openSubmenu === option.value &&
                        createPortal(
                          <div
                            ref={submenuRef}
                            className="absolute z-50 bg-white border border-purple-300 rounded-lg shadow-md overflow-y-auto max-w-[60vw] text-sm"
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
                            }}
                            onMouseEnter={() =>
                              openSubmenuWithDelay(option.value)
                            }
                            onMouseLeave={closeSubmenuWithDelay}
                          >
                            {option?.submenu?.map((subOption) => (
                              <button
                                key={subOption.value}
                                onClick={() => {
                                  handleSelect(option.value);
                                  handleCategoryChange(option.value);
                                  handleButtonClick(subOption.value);
                                }}
                                className="block w-full px-4 py-3 text-left text-purple-700 hover:bg-purple-100 transition duration-150"
                                title={subOption.label}
                              >
                                {subOption.label}
                              </button>
                            ))}
                          </div>,
                          document.body,
                        )}
                    </>
                  ) : (
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => handleSelect(option.value)}
                          className={`${
                            active ? "bg-purple-100" : ""
                          } block w-full px-4 py-3 text-left text-purple-700 hover:bg-purple-100 transition duration-150`}
                          title={option.label}
                        >
                          {option.label}
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
      className="mt-6 flex items-center bg-white rounded-full border border-gray-300 shadow-md focus-within:border-purple-600 transition-all"
    >
      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        placeholder="Ask about business insights..."
        className="flex-1 px-4 py-3 bg-transparent text-gray-800 outline-none placeholder-gray-400 rounded-l-full"
      />

      {/* Mic Button */}

      <VoiceRecorder onVoiceInput={onVoiceInput}></VoiceRecorder>

      {/* Send Button */}
      <button
        type="submit"
        className="p-3 bg-purple-800 hover:bg-purple-600 transition duration-300 rounded-full text-white"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

