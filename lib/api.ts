import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchChat = (input: string, stage: string) =>
  api.post("/chat", { input, stage }).then((res) => res.data);

export const fetchVoice = (text: string) =>
  api.post("/voice", { text }, { responseType: "blob" }).then((res) => res.data);