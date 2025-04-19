"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneOff, Mic, Volume2 } from "lucide-react";
import type { Message } from "@/lib/types";

interface VoiceCallOverlayProps {
  onEndCall: () => void;
  callDuration: number;
  lastMessage: Message;
  isListening: boolean;
  transcription: string;
}

export default function VoiceCallOverlay({
  onEndCall,
  callDuration,
  lastMessage,
  isListening,
  transcription,
}: VoiceCallOverlayProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-lg">
        <CardHeader className="bg-indigo-600 text-white p-4 rounded-t-lg">
          <CardTitle className="text-xl font-bold">MBA Sales Call</CardTitle>
          <div className="text-sm">{formatTime(callDuration || duration)}</div>
          <div className="text-sm flex items-center gap-2">
            <span>{isListening ? "AI is listening" : "AI is speaking"}</span>
            {isListening && <span className="text-green-300 animate-pulse">●</span>}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 text-gray-800">
            <p className="text-lg">{lastMessage.text}</p>
            {transcription && isListening && (
              <p className="mt-2 text-sm text-gray-600">You said: {transcription}</p>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="text-indigo-600 hover:bg-indigo-100"
              disabled={!isListening}
            >
              <Mic size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-indigo-600 hover:bg-indigo-100"
              onClick={() => audioRef.current?.play()} // Placeholder for volume control
            >
              <Volume2 size={20} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="hover:bg-red-100"
              onClick={onEndCall}
            >
              <PhoneOff size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}