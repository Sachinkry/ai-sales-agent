"use client"

import { useState } from "react"
import VoiceCallOverlay from "@/components/voice-call-overlay"
import ChatInterface from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [messages, setMessages] = useState<
    {
      role: "ai" | "user"
      content: string
      timestamp: Date
    }[]
  >([
    {
      role: "ai",
      content: "Hello! I'm your AI sales assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const startCall = () => {
    setIsCallActive(true)
    // Simulate AI starting the conversation
    setTimeout(() => {
      addMessage(
        "ai",
        "Hi there! I'm calling about our new product line that I think would be perfect for your business needs. Do you have a moment to chat?",
      )
    }, 1500)
  }

  const endCall = () => {
    setIsCallActive(false)
    addMessage("ai", "Thanks for your time! I've ended our call, but feel free to continue our conversation here.")
  }

  const addMessage = (role: "ai" | "user", content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }])
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    // Add user message
    addMessage("user", message)

    // Simulate AI response
    setTimeout(
      () => {
        // Simple AI responses based on user input
        let response = ""
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
          response =
            "Our pricing starts at $99/month with a 14-day free trial. I'd be happy to discuss custom packages that might better suit your needs."
        } else if (lowerMessage.includes("feature") || lowerMessage.includes("what can")) {
          response =
            "Our product includes AI-powered analytics, 24/7 customer support, and seamless integration with your existing tools. What specific features are you most interested in?"
        } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          response =
            "Hello! Great to connect with you. I'd love to learn more about your business needs to see how we can help."
        } else if (lowerMessage.includes("not interested") || lowerMessage.includes("no thanks")) {
          response =
            "I understand. Thank you for your time. If you change your mind or have any questions in the future, feel free to reach out."
        } else {
          response =
            "That's a great point. Based on what you've shared, I think our solution could really help streamline your operations. Would you like to schedule a demo to see it in action?"
        }

        addMessage("ai", response)
      },
      1000 + Math.random() * 1000,
    )
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <main className="flex min-h-screen flex-col items-center justify-between bg-gray-50">
        <div className="w-full max-w-4xl h-screen relative">
          {isCallActive && (
            <VoiceCallOverlay
              onEndCall={endCall}
              callDuration={isCallActive ? Date.now() : 0}
              lastMessage={messages[messages.length - 1]}
            />
          )}
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartCall={startCall}
            isCallActive={isCallActive}
          />
        </div>
      </main>
    </ThemeProvider>
  )
}
