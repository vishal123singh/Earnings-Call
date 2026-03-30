"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, SpeakerIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { ParentContext } from "@/layout";

const AIVoiceAssistant: React.FC = () => {
    const { isVoiceAssistantOpen, setIsVoiceAssistantOpen } = useContext(ParentContext)
  
  const [isResponseOpen, setIsResponseOpen] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messageEndRef=useRef(null);

   // Correctly type the state with RootState
   const selectedCompanies = useSelector(
    (state: any) => state.sidebar.selectedCompanies
  );
  const selectedYear = useSelector(
    (state: any) => state.sidebar.selectedYear
  );
  const selectedQuarter = useSelector(
    (state: any) => state.sidebar.selectedQuarter
  );

  const selectedPersona = useSelector(
    (state: any) => state.sidebar.persona
  );

  const selectedModal = useSelector(
    (state: any) => state.sidebar.foundationModel
  );

useEffect(()=>{
if(messageEndRef.current){
  (messageEndRef.current as any).scrollIntoView({behavior:"smooth"})
}
},[response])
  // 🎙️ Load voices and greet when the modal opens
  useEffect(() => {
    if (isVoiceAssistantOpen) {
      loadVoicesAndGreet();
    } else {
      resetChat();
    }
    
  }, [isVoiceAssistantOpen]);
  // 🎙️ Load available voices and greet
  const loadVoicesAndGreet = () => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find((v) =>
          ["female", "Google UK English Female", "Google US English"].some(
            (name) => v.name.includes(name)
          )
        ) || voices[0];

      setVoice(femaleVoice);
      greetUser(femaleVoice);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  };

  // 🎤 Initial greeting
  const greetUser = (voice: SpeechSynthesisVoice) => {
    const greeting = "Hey there! I’m your voice assistant. How can I help you?";
    setResponse(greeting);
    speakResponse(greeting, voice);
  };

  // 🎙️ Start/Stop Voice Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      fetchAIResponse(transcript);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening]);

  // 🤖 Stream AI Response from Server
  const fetchAIResponse = async (query: string) => {
    try {
      setResponse(""); // Reset response before new query
      setIsResponseOpen(true); // Open Response Modal
      setIsLoading(true);

      const response = await fetch("/api/ai-voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query ,selectedCompanies,selectedYear,selectedQuarter,selectedPersona}),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let isDone = false;

        while (!isDone) {
          const { value, done } = await reader.read();
          if (done) {
            isDone = true;
            setIsLoading(false);
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk
            .split("\n")
            .filter((line) => line.startsWith("data:"));

          for (const line of lines) {
            const data = JSON.parse(line.replace("data: ", ""));
            setResponse((prev) => prev + data.text);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Oops! Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // 🔊 Text-to-Speech (Speak AI Response)
  const speakResponse = (text: string, selectedVoice: SpeechSynthesisVoice | null) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.voice = selectedVoice || window.speechSynthesis.getVoices()[0];
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // 🎛️ Toggle Voice Modal
  const toggleModal = () => {
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
    resetChat();
  };

  // 🧹 Reset Chat State
  const resetChat = () => {
    setTranscript("");
    setResponse("");
    setIsListening(false);
    setIsSpeaking(false);
    setIsResponseOpen(false);
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
     
      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isVoiceAssistantOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal}
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-10 right-10 bg-white rounded-2xl shadow-2xl z-[9999] p-6 w-80"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  🎙️ Voice Assistant
                </h3>
                <X
                  size={24}
                  className="text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={toggleModal}
                />
              </div>

              {/* Transcript */}
              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 min-h-[60px] mb-4">
                {transcript || "Tap mic to start speaking..."}
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-4 rounded-full bg-gradient-to-r ${
                    isListening
                      ? "from-pink-500 to-purple-500"
                      : "from-gray-300 to-gray-400"
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {isListening ? <X size={24} /> : <Mic size={24} />}
                </button>

                {isSpeaking && (
                  <SpeakerIcon
                    size={24}
                    className="text-purple-500 animate-bounce"
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

     {/* AI Response Modal with Streaming */}
     <AnimatePresence>
        {isResponseOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border border-gray-300 fixed bottom-10 right-[25rem] bg-white rounded-2xl shadow-2xl z-[9999] p-6 w-[500px] h-[500px]"
          >
            <div className="flex justify-between items-center mb-4">
              {/* <h3 className="text-lg font-semibold text-gray-800">
                📄 AI Response
              </h3> */}
              <X
                size={24}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={() => setIsResponseOpen(false)}
              />
            </div>

            {/* Markdown Response Streaming */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 min-h-[60px] mb-4 max-h-[420px] overflow-y-auto">
              {isLoading && response === "" ? (
                <div className="flex items-center justify-center text-purple-500">
                  <div className="animate-spin h-5 w-5 border-t-2 border-purple-500 rounded-full mr-2"></div>
                  <span>Waiting for response...</span>
                </div>
              ) : (
                <ReactMarkdown>{response || "No response yet."}</ReactMarkdown>
              )}
              <div ref={messageEndRef}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIVoiceAssistant;
