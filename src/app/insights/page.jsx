"use client";
import { Mic, Send, ChevronDown, SendHorizonalIcon, X } from "lucide-react";
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

        {/* <button
          onClick={() => setIsChatOpen(true)}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Upload Earnings Call Transcripts
        </button> */}

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
