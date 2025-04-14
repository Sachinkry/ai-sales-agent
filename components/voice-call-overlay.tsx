"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import AiStatus from "./ai-status"

interface VoiceCallOverlayProps {
  onEndCall: () => void
  callDuration: number
  lastMessage: {
    role: "ai" | "user"
    content: string
    timestamp: Date
  }
}

export default function VoiceCallOverlay({ onEndCall, callDuration, lastMessage }: VoiceCallOverlayProps) {
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [aiState, setAiState] = useState<"speaking" | "listening" | "thinking">("speaking")

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Update call duration
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Update AI state based on last message
  useEffect(() => {
    if (lastMessage.role === "user") {
      setAiState("thinking")
      const thinkingTime = Math.random() * 2000 + 1000 // 1-3 seconds
      const timeout = setTimeout(() => {
        setAiState("speaking")
      }, thinkingTime)
      return () => clearTimeout(timeout)
    } else {
      setAiState("listening")
      const timeout = setTimeout(() => {
        if (Math.random() > 0.7) {
          setAiState("speaking")
        }
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [lastMessage])

  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center pt-4 px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">Sales Call</h3>
              <p className="text-sm text-gray-500">{formatTime(duration)}</p>
            </div>
            <AiStatus status={aiState} />
          </div>

          <div className="bg-gray-100 rounded-lg p-3 mb-4 max-h-24 overflow-y-auto">
            <p className="text-sm text-gray-700">{lastMessage.content}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={isMuted ? "bg-red-50 text-red-600" : ""}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={!isSpeakerOn ? "bg-red-50 text-red-600" : ""}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
            <Button variant="destructive" size="icon" onClick={onEndCall}>
              <PhoneOff size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
