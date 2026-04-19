import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connectDB } from "@/lib/mongodb";
import Sentiment from "@/models/Sentiment";
import Transcript from "@/models/Transcript";

const quarters = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { selectedCompany, selectedQuarter, selectedYear } = body;

    const ticker = selectedCompany.ticker || selectedCompany.value;
    const quarter = quarters[selectedQuarter];
    const quarterFormatted = `Q${quarter}`;
    const yearFormatted = Number(selectedYear?.[0]);

    await connectDB();

    // find
    const existing = await Sentiment.findOne({
      ticker,
      year: yearFormatted,
      quarter: quarterFormatted,
    });

    // 1️⃣ Check local sentiment
    if (existing) {
      return NextResponse.json(existing.sentiment_analysis);
    }

    // ✅ 1. Check cache
    const existingTranscript = await Transcript.findOne({
      ticker,
      year: yearFormatted,
      quarter: quarterFormatted,
    });

    // 2️⃣ Get transcript
    let transcriptData = null;
    if (existingTranscript) {
      transcriptData = existingTranscript.data;
    } else {
      const pythonApiUrl =
        process.env.PYTHON_API_URL || "http://localhost:8000";
      const pythonApiEndpoint = `${pythonApiUrl}/scrape/${ticker.toLowerCase()}/${selectedYear}/${quarterFormatted}`;
      const pythonResponse = await fetch(pythonApiEndpoint);
      if (!pythonResponse.ok)
        throw new Error(`Python API error: ${pythonResponse.status}`);
      const pythonData = await pythonResponse.json();
      if (!pythonData.success)
        throw new Error(
          pythonData.error || "Python API returned unsuccessful response",
        );

      transcriptData = {
        presentation: pythonData.presentation || [],
        qa_session: pythonData.qa_session || [],
        participants: pythonData.participants || {
          corporate: [],
          analysts: [],
        },
        metadata: pythonData.metadata || {
          company: ticker,
          ticker,
          quarter: quarterFormatted,
          year: selectedYear,
          date: null,
          transcript_type: "Earnings Transcript",
        },
        stats: pythonData.stats || {
          presentation_speeches: pythonData.presentation?.length || 0,
          qa_speeches: pythonData.qa_session?.length || 0,
        },
      };

      await Transcript.findOneAndUpdate(
        {
          ticker,
          year: yearFormatted,
          quarter: quarterFormatted,
        },
        {
          ticker,
          year: yearFormatted,
          quarter: quarterFormatted,
          data: transcriptData,
        },
        {
          upsert: true, // create if not exists
          new: true,
        },
      );
    }

    // 3️⃣ Generate structured sentiment using OpenAI
    const sentiment = await generateStructuredSentiment(transcriptData);

    // upsert (BEST)
    await Sentiment.findOneAndUpdate(
      { ticker, year: selectedYear, quarter: quarterFormatted },
      sentiment,
      {
        upsert: true,
        new: true,
      },
    );

    return NextResponse.json(sentiment);
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(
      JSON.stringify({
        error: "Error occurred while fetching sentiment",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}

// OpenAI structured sentiment
async function generateStructuredSentiment(transcriptData) {
  // Format a section
  const formatSection = (title, entries) => {
    return [
      `=== ${title} ===`,
      ...entries.map(
        (e) => `${e.speaker}${e.title ? " — " + e.title : ""}: ${e.text}`,
      ),
    ].join("\n\n");
  };

  // Combine both sections
  const combinedText = [
    formatSection("Presentation", transcriptData.presentation),
    formatSection("Q&A Session", transcriptData.qa_session),
  ].join("\n\n");

  const prompt = `
You are a senior financial analyst.

Analyze the following earnings transcript and return a structured JSON:

{
  "label": "Positive | Neutral | Negative",
  "confidence": number (0 to 1),
  "summary": "2-3 sentence high-level summary",
  "key_insights": ["bullet points"],
  "risks": ["bullet points"],
  "opportunities": ["bullet points"],
  "management_tone": "Brief description of tone",
  "notable_quotes": ["important quotes from transcript"]
}

Rules:
- Keep insights concise and actionable
- Extract real signals (growth, margins, guidance, risks)
- Do NOT hallucinate

Transcript:
${combinedText}

Respond ONLY with JSON.
`;
  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const responseText = completion.choices[0].message?.content || "";

  const cleaned = responseText.trim();

  // Try parsing GPT output safely
  let sentimentJson;

  try {
    // 1. Try direct parse
    sentimentJson = JSON.parse(cleaned);
  } catch {
    try {
      // 2. Try extracting ```json block
      const codeBlockMatch = cleaned.match(/```json([\s\S]*?)```/);
      if (codeBlockMatch) {
        sentimentJson = JSON.parse(codeBlockMatch[1]);
      } else {
        throw new Error("No code block");
      }
    } catch {
      try {
        // 3. Extract first JSON object from text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          sentimentJson = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found");
        }
      } catch {
        // 4. Final fallback (FULL schema)
        sentimentJson = {
          label: "Neutral",
          confidence: 0.5,
          summary: "Unable to parse structured sentiment.",
          key_insights: [],
          risks: [],
          opportunities: [],
          management_tone: "Unknown",
          notable_quotes: [],
        };
      }
    }
  }

  return {
    ticker: transcriptData.metadata.ticker,
    quarter: transcriptData.metadata.quarter,
    year: transcriptData.metadata.year,
    sentiment_analysis: sentimentJson,
    generated_at: new Date().toISOString(),
  };
}
