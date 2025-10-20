import { GoogleGenAI } from "@google/genai";

if (!process.env.GOOGLE_API_KEY) {
	throw new Error("Missing GOOGLE_API_KEY environment variable");
}

// Export a single `ai` client that matches the usage in the routes
export const ai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});



// lib/gemini.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// export const ai = genAI;