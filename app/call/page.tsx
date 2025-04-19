"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import CallInterface from "@/components/call-interface";
import { fetchChat } from "@/lib/api";
import type { Message } from "@/lib/types";

// Manual type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface WindowExtended {
  SpeechRecognition: {
    new(): SpeechRecognition;
    prototype: SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new(): SpeechRecognition;
    prototype: SpeechRecognition;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window extends WindowExtended {}
}

export default function CallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isCallActive) {
      const startCall = async () => {
        setIsCallActive(true);
        const response: { text: any; isFollowUp: any; audioUrl: any; transcription?: string } = await fetchChat("Hi, starting the call!", []);
        if (response.text) {
          setMessages((prev) => [
            ...prev,
            { sender: "AI", text: response.text, timestamp: new Date(), isFollowUp: response.isFollowUp, transcription: response.transcription },
          ]);
          if (response.transcription) window.history.back();
          if (response.audioUrl) playAudio(response.audioUrl);
        }
      };
      startCall();
    }

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as {
        new(): SpeechRecognition;
      };
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setMessages((prev) => [
          ...prev,
          { sender: "User", text: transcript, timestamp: new Date() },
        ]);
        handleUserSpeech(transcript);
      };

      recognition.onerror = (error: SpeechRecognitionErrorEvent) => {
        console.error("Client: Speech recognition error:", error.error, error.message);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isCallActive, useElevenLabs]);

  const handleUserSpeech = async (text: string) => {
    if (!isCallActive) return;
    setIsListening(false);
    const response: { text: any; isFollowUp: any; audioUrl: any; transcription?: string } = await fetchChat(text, messages);
    if (response.text) {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: response.text, timestamp: new Date(), isFollowUp: response.isFollowUp, transcription: response.transcription },
      ]);
      if (response.transcription) window.history.back();
      if (response.audioUrl) playAudio(response.audioUrl);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const endCall = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsCallActive(false);
    if (audioRef.current) audioRef.current.pause();
    setMessages((prev) => [
      ...prev,
      { sender: "AI", text: "Thanks for your time! Call ended.", timestamp: new Date() },
    ]);
    window.history.back();
  };

  const playAudio = (audioUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((error) => console.error("Client: Audio play error:", error));
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
        <div className="relative w-full h-screen flex items-center justify-center">
          <CallInterface
            isCallActive={isCallActive}
            onEndCall={endCall}
            callDuration={isCallActive ? Math.floor((Date.now() - (messages.length > 0 ? messages[messages.length - 1].timestamp.getTime() : Date.now())) / 1000) : 0}
            lastMessage={messages[messages.length - 1] || { sender: "AI", text: "", timestamp: new Date() }}
            onStartListening={startListening}
            isListening={isListening}
            useElevenLabs={useElevenLabs}
            onToggleElevenLabs={() => setUseElevenLabs(!useElevenLabs)}
          />
        </div>
      </main>
    </ThemeProvider>
  );
}