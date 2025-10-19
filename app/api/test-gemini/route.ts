import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY!,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Say hello from Gemini!",
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to connect" },
      { status: 500 }
    );
  }
}
