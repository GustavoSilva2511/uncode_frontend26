import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GOOGLE_API_KEY});

export async function getAiResponse(message: string, context?: string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: context ? `${context}\n${message}` : message,
    });
    return response;
}