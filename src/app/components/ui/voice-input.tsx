"use client";

import { Mic, StopCircle } from "lucide-react";
import { useState, useRef } from "react";

interface VoiceRecorderProps {
  onVoiceInput?: (transcript: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoiceRecorder = ({ onVoiceInput }: VoiceRecorderProps) => {
  const [listening, setListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = (): void => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent): void => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      onVoiceInput?.(transcript);
    };

    recognition.onend = (): void => {
      setListening(false);
    };

    recognition.onerror = (err: SpeechRecognitionErrorEvent): void => {
      console.error("Speech error:", err);
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);
  };

  const stopListening = (): void => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`rounded-full p-2 sm:p-3 shadow-lg transition-all active:scale-95 ${
          listening
            ? "bg-red-100 hover:bg-red-200 active:bg-red-300"
            : "bg-blue-100 hover:bg-blue-200 active:bg-blue-300"
        }`}
      >
        {listening ? (
          <StopCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
        ) : (
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        )}
      </button>

      <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
        {listening ? "Listening..." : "Click to speak"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
