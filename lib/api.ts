import axios from "axios";
import type { Message } from "./types";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchChat = async (input: string, history: Message[]) => {
  try {
    const response = await api.post("/chat", { input, history });
    const { text, isFollowUp, audioUrl } = response.data;
    return { text, isFollowUp, audioUrl };
  } catch (error) {
    console.error("API route error:", error);
    return { text: "Sorry, I’m having trouble responding.", isFollowUp: false, audioUrl: "" };
  }
};