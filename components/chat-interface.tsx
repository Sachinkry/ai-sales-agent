"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone } from "lucide-react"
import MessageItem from "./message-item"

interface ChatInterfaceProps {
  messages: {
    role: "ai" | "user"
    content: string
    timestamp: Date
  }[]
  onSendMessage: (message: string) => void
  onStartCall: () => void
  isCallActive: boolean
}

export default function ChatInterface({ messages, onSendMessage, onStartCall, isCallActive }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">AI Sales Assistant</h2>
          <p className="text-sm text-gray-500">Always ready to help</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${isCallActive ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" : "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"}`}
          onClick={onStartCall}
          disabled={isCallActive}
        >
          <Phone size={16} />
          {isCallActive ? "Call in progress" : "Start Call"}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageItem
              key={index}
              message={message}
              isSequential={index > 0 && messages[index - 1].role === message.role}
            />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center gap-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  )
}
