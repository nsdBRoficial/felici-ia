import { GoogleGenAI } from "@google/genai";

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
