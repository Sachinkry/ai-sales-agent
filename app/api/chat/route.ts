import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { mbaBrochure } from "@/lib/mbaBrochure";
import type { Prospect, Message } from "@/lib/types";
import axios from "axios";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const model = "gemini-2.0-flash";
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || "";

// Mock prospect data (replace with dynamic source later)
const prospect: Prospect = {
  name: "Alex Carter",
  age: 30,
  graduationStatus: "graduated",
  graduationYear: 2016,
  phoneNumber: "+1-555-123-4567",
  specialization: "Management",
};

// Base prompt for AI to simulate a call-like pitch
const basePrompt = (prospect: Prospect) => `
You are an AI sales assistant selling an Executive MBA program. Simulate a friendly, professional phone call conversation via text. Use the following prospect data and MBA brochure to craft a personalized pitch. Aim to engage the prospect, highlight benefits tailored to their background, and close the sale with a clear call-to-action (e.g., schedule a consultation or enroll).

**Prospect Data**:
- Name: ${prospect.name}
- Age: ${prospect.age}
- Graduation Status: ${prospect.graduationStatus}
- Graduation Year: ${prospect.graduationYear || "N/A"}
- Specialization: ${prospect.specialization}

**MBA Brochure**:
- Title: ${mbaBrochure.title}
- Duration: ${mbaBrochure.duration}
- Mode: ${mbaBrochure.mode}
- Cost: ${mbaBrochure.cost}
- Benefits: ${mbaBrochure.benefits.join(", ")}
- Eligibility: ${mbaBrochure.eligibility}

**Instructions**:
- Start with a warm greeting, addressing the prospect by name. No fillers or square brackets for names.
- Personalize the pitch based on their specialization and career stage.
- Highlight 2-3 MBA benefits relevant to their profile.
- Handle objections (e.g., cost, time) empathetically and offer solutions (e.g., payment plans, flexible schedule).
- End with a clear call-to-action.
- Keep responses concise, max 2-3 sentences per message.
- If the prospect seems hesitant, politely suggest a follow-up (e.g., "Can I check back in a few days?").
- Use a conversational tone as if on a call.
- The end goal is to make them register for the program which costs 500 rupees only and/or close the sale with admission is follow up.
- Registratin requires a phone number and email address.
- Keep the conversation short and engaging, like a real phone call.
- Prefer whatsapp over email for follow-ups.
- Don't suggest getting on a call/chat, just follow ups.
- Do not include any text in brackets or internal commentary in your responses.
`;

export async function POST(request: Request) {
    try {
      console.log("API: Request received");
      const { input, history, useElevenLabs }: { input?: string; history: Message[]; useElevenLabs?: boolean } = await request.json();
  
      console.log("API: Processing input:", input);
      const fullContext = [
        { role: "user", parts: [{ text: "Hello, I’d like to start a call." }] },
        { role: "model", parts: [{ text: basePrompt(prospect) }] },
        ...history.map((msg) => ({
          role: msg.sender === "AI" ? "model" : "user",
          parts: [{ text: msg.text }],
        })),
      ];
  
      if (input) fullContext.push({ role: "user", parts: [{ text: input }] });
  
      console.log("API: Initializing chat with Gemini");
      const chat = genAI.chats.create({ model, history: fullContext });
      console.log("API: Sending message to Gemini");
      const response = await chat.sendMessage({ message: input || "Hello, starting the call!" });
      let text = response.text || "Sorry, I’m having trouble responding.";
      text = text.replace(/\(.*?\)/g, "").trim();
      console.log("API: Model is speaking:", text);
  
      const isFollowUp = input?.toLowerCase().includes("later") || input?.toLowerCase().includes("not sure");
  
      let audioUrl = "";
      if (useElevenLabs && elevenLabsApiKey) {
        try {
          console.log("API: ElevenLabs is being used for TTS");
          const ttsResponse = await axios.post(
            "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
            { text, voice_settings: { stability: 0.5, similarity_boost: 0.5 } },
            {
              headers: { "xi-api-key": elevenLabsApiKey, "Content-Type": "application/json" },
              responseType: "arraybuffer",
            }
          );
          audioUrl = `data:audio/mpeg;base64,${Buffer.from(ttsResponse.data).toString("base64")}`;
          console.log("API: ElevenLabs TTS successful");
        } catch (ttsError) {
          console.error("API: ElevenLabs TTS error:", ttsError);
          audioUrl = "";
        }
      } else {
        console.log("API: ElevenLabs is not being used, skipping TTS");
      }
  
      console.log("API: Response ready, sending to client:", { text, isFollowUp, audioUrl, transcription: input || "" });
      return NextResponse.json({ text, isFollowUp, audioUrl, transcription: input || "" });
    } catch (error) {
      console.error("API: Fatal error:", error);
      return NextResponse.json(
        { text: "Sorry, an error occurred.", isFollowUp: false, audioUrl: "", transcription: "" },
        { status: 500 }
      );
    }
  }