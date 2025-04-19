"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import ChatInterface from "@/components/chat-interface";
import { fetchChat } from "@/lib/api";
import type { Message } from "@/lib/types";
import Link from "next/link";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const initChat = async () => {
      const response = await fetchChat("", []);
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: response.text, timestamp: new Date(), isFollowUp: response.isFollowUp },
      ]);
    };
    initChat().catch(console.error);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { sender: "User", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    const response = await fetchChat(text, messages);
    setMessages((prev) => [
      ...prev,
      { sender: "AI", text: response.text, timestamp: new Date(), isFollowUp: response.isFollowUp },
    ]);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <main className="flex min-h-screen flex-col items-center bg-gray-50">
        <div className="w-full max-w-4xl h-screen">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartCall={() => {}}
            isCallActive={false}
          >
            <Link href="/call" className="mt-4 inline-block">
              <button className="bg-indigo-600 hover:cursor-pointer text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">
                <svg
                  className="w-4 h-4 mr-2 inline"
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
                Start Call
              </button>
            </Link>
          </ChatInterface>
        </div>
      </main>
    </ThemeProvider>
  );
}