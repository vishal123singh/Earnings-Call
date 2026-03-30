import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

// Enable streaming with AI response
export async function POST(req) {
  try {
    const { query } = await req.json();

    const SYSTEM_MESSAGE = {
      role: "system",
      content: `
You are an assistant for a web application called "Earnings Call." 
Your role is to help users explore the app and answer their questions related to it. 
If a query is out of context, politely decline the request. 
If you don't know the answer, also respond politely and indicate that you don’t have that information.

Context:
- The app provides insights into earnings call transcripts.
- In the Insights tab, users can select up to 5 companies, choose the year, quarter, and persona. They can ask questions based on those selections.
- The Dashboard tab includes an earnings calendar, the ability to generate charts for financial metrics using AI, and access to SEC filings (Annual and Quarterly) in the Financial Reports section.
- The Sentiments tab provides AI-generated sentiment analysis of earnings calls.
- The Transcripts tab offers raw earnings call transcripts.
`.trim()
    };

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content: query || "Can you help me understand the app?", // fallback for safety
    },
  ],
  stream: true,
});

    // Create a ReadableStream to push chunks to client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          // Send streamed content as JSON chunks
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`);
        }
        controller.close(); // Close stream after completion
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}
