// components/VoiceRecorder.js
import { Mic, StopCircle } from "lucide-react";
import { useState, useRef } from "react";

const VoiceRecorder = ({ onVoiceInput }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      audioChunks.current = [];
      uploadAudio(audioBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Upload audio to API
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
      const response = await fetch("/api/voice-input", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        onVoiceInput(data.text);
      } else {
        console.error("Transcription failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="flex items-center justify-center">
        {recording ? (
          <button type="button"
            onClick={stopRecording}
            className="rounded-full bg-red-100 hover:bg-red-200 transition-all shadow-lg"
          >
            <StopCircle className="w-6 h-6 text-red-600" />
          </button>
        ) : (
            <button type="button"
            onClick={startRecording}
            className="rounded-full bg-purple-100 hover:bg-purple-200 transition-all shadow-lg p-2"
          >
            <Mic className="w-6 h-6 text-purple-600" />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {recording
          ? "Click to stop Recording"
          : ""}
      </p>
    </div>
  );
};

export default VoiceRecorder;
