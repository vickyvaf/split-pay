import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const prompt = `
      Analyze this text and extract billing information for a split-pay application.
      Text: "${text}"
      
      Return the data strictly in JSON format with the following structure:
      {
        "groupName": "string (a concise name for the event/bill)",
        "totalAmount": "number (the total cost mentioned)",
        "initiatorAmount": "number (the amount for the person speaking)",
        "members": [
          { "name": "string", "item": "string (what they bought/did, e.g., 'Bakso')", "amount": "number" }
        ],
        "splitMode": "custom" | "equal"
      }
      Rules:
      1. If specific amounts per person are mentioned, set splitMode to "custom".
      2. If only a total is mentioned, set splitMode to "equal".
      3. Response should ONLY be the JSON string.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiText = completion.choices[0]?.message?.content;
    if (!aiText) {
      throw new Error("No response from Groq");
    }

    return NextResponse.json(JSON.parse(aiText));
  } catch (error: any) {
    console.error("Groq Parsing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
