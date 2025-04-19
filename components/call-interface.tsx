"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic } from "lucide-react";

interface CallInterfaceProps {
  isCallActive: boolean;
  onEndCall: () => void;
  callDuration: number;
  lastMessage: { sender: string; text: string; timestamp: Date; isFollowUp?: boolean };
  onStartListening: () => void;
  isListening: boolean;
  useElevenLabs: boolean;
  onToggleElevenLabs: () => void;
}

export default function CallInterface({
  isCallActive,
  onEndCall,
  callDuration,
  lastMessage,
  onStartListening,
  isListening,
  useElevenLabs,
  onToggleElevenLabs,
}: CallInterfaceProps) {
  const [pulse, setPulse] = useState(1);
  const [fadeIn, setFadeIn] = useState(false);
  const [isCallActiveState, setIsCallActive] = useState(isCallActive);

  useEffect(() => {
    let animationFrame: number;
    if (isCallActive) {
      setFadeIn(true);
      const animate = () => {
        setPulse((prev) => (prev === 1 ? 1.1 : 1));
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    } else {
      setFadeIn(false);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isCallActive]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-70"
        style={{
          filter: "blur(50px)",
          transform: `scale(${pulse})`,
          transition: "transform 1s ease-in-out",
        }}
      />
      {!isCallActive ? (
        <button
          onClick={() => setIsCallActive(true)}
          className="relative z-10 flex items-center justify-center w-48 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Call AI agent
        </button>
      ) : (
        <div
          className={`relative z-10 flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg text-white transition-opacity duration-500 ${
            fadeIn ? "opacity-100" : "opacity-0"
          } dark:bg-gray-700`}
        >
          <h2 className="text-xl font-bold mb-2">Call in Progress</h2>
          <p className="text-sm mb-4 dark:text-gray-300">{formatTime(callDuration)}</p>
          <p className="text-lg mb-4 dark:text-gray-200">{lastMessage.text || "Connecting..."}</p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="text-white hover:bg-gray-700 dark:hover:bg-gray-600"
              onClick={onStartListening}
              disabled={isListening}
            >
              <Mic className="mr-2" /> Listen
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white hover:bg-gray-700 dark:hover:bg-gray-600"
              onClick={onToggleElevenLabs}
            >
              {useElevenLabs ? "Disable ElevenLabs" : "Enable ElevenLabs"}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="hover:bg-red-700 dark:hover:bg-red-800"
              onClick={onEndCall}
            >
              <PhoneOff className="mr-2" /> End Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}