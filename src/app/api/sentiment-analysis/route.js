import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

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

    const transcriptPath = path.join(
      process.cwd(),
      "transcripts/json",
      ticker,
      String(selectedYear),
      `Q${quarter}.json`,
    );

    const sentimentPath = path.join(
      process.cwd(),
      "sentiments/json",
      ticker,
      String(selectedYear),
      `Q${quarter}.json`,
    );

    // 1️⃣ Check local sentiment
    if (fs.existsSync(sentimentPath)) {
      const sentimentData = JSON.parse(fs.readFileSync(sentimentPath, "utf-8"));
      return NextResponse.json(sentimentData);
    }

    // 2️⃣ Get transcript
    let transcriptData = null;
    if (fs.existsSync(transcriptPath)) {
      transcriptData = JSON.parse(fs.readFileSync(transcriptPath, "utf-8"));
      console.log("Loaded transcript from local cache:", transcriptPath);
      console.log("Transcript metadata:", transcriptData.metadata);
    } else {
      const pythonApiUrl =
        process.env.PYTHON_API_URL || "http://localhost:8000";
      const pythonApiEndpoint = `${pythonApiUrl}/scrape/${ticker.toLowerCase()}/${selectedYear}/Q${quarterFormatted}`;
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

      await saveLocally(transcriptPath, transcriptData);
    }

    // 3️⃣ Generate structured sentiment using OpenAI
    const sentiment = await generateStructuredSentiment(transcriptData);

    await saveLocally(sentimentPath, sentiment);

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

// Save JSON locally
async function saveLocally(filePath, data) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
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

  console.log(
    "Generating sentiment for:",
    transcriptData.metadata.ticker,
    transcriptData.metadata.quarter,
    transcriptData.metadata.year,
  );
  console.log("Transcript length (chars):", combinedText.length);

  console.log("Transcript sample:", combinedText.slice(0, 500));

  const prompt = `
You are a financial analyst. Given the following earnings transcript, provide a structured JSON output with:
- label: Positive, Neutral, or Negative
- confidence: float number between 0 and 1
- reasoning: 1-2 sentences explaining the sentiment

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

  // Try parsing GPT output safely
  let sentimentJson = {};
  try {
    sentimentJson = JSON.parse(responseText);
  } catch {
    sentimentJson = {
      label: "Neutral",
      confidence: 0.5,
      reasoning: responseText.slice(0, 200), // fallback
    };
  }

  return {
    ticker: transcriptData.metadata.ticker,
    quarter: transcriptData.metadata.quarter,
    year: transcriptData.metadata.year,
    sentiment_analysis: sentimentJson,
    generated_at: new Date().toISOString(),
  };
}
