"use client";

import { Mic, StopCircle } from "lucide-react";
import { useState, useRef } from "react";

const VoiceRecorder = ({ onVoiceInput }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      onVoiceInput?.(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`rounded-full p-3 shadow-lg transition-all ${
          listening
            ? "bg-red-100 hover:bg-red-200"
            : "bg-blue-100 hover:bg-blue-200"
        }`}
      >
        {listening ? (
          <StopCircle className="w-6 h-6 text-red-600" />
        ) : (
          <Mic className="w-6 h-6 text-blue-600" />
        )}
      </button>

      <p className="text-xs text-gray-500">
        {listening ? "Listening..." : "Click to speak"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
