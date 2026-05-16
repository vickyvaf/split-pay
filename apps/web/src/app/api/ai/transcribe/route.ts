import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert Blob to Base64
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Listen to this audio and extract billing information for a split-pay application.
      The user might mention specific amounts for each person (e.g., "Budi 15k, Susi 20k") or just a total.
      Return the data strictly in JSON format with the following structure:
      {
        "groupName": "string (a concise name for the event/bill)",
        "totalAmount": "number (the total cost mentioned)",
        "initiatorAmount": "number (the amount for the person speaking)",
        "members": [
          { "name": "string", "amount": "number" }
        ],
        "splitMode": "custom" | "equal"
      }
      Rules:
      1. If specific amounts per person are mentioned, set splitMode to "custom" and use those values.
      2. If only a total is mentioned, set splitMode to "equal".
      3. The 'members' list should include all people mentioned in the audio (excluding the person speaking).
      4. Response should ONLY be the JSON string.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: audioFile.type || "audio/webm",
        },
      },
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (sometimes Gemini wraps it in ```json ... ```)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }

    const billData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(billData);
  } catch (error: any) {
    console.error("AI Transcription Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
