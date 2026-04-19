import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ✅ Initialize OpenAI with OpenRouter API
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

// Quarter Mapping
const quarterMapping = {
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4rth": 4,
  "4th": 4,
  Q1: 1,
  Q2: 2,
  Q3: 3,
  Q4: 4,
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
};

// ✅ Generate LOCAL file path
const generateLocalPath = (obj) => {
  if (!obj.ticker || !obj.year || !obj.quarter) {
    throw new Error("Missing required fields: ticker, year, or quarter.");
  }

  const quarterNumber = quarterMapping[obj.quarter];
  if (!quarterNumber) {
    throw new Error(`Invalid quarter value: ${obj.quarter}`);
  }

  return path.join(
    process.cwd(),
    "transcripts/json",
    obj.ticker,
    String(obj.year),
    `Q${quarterNumber}.json`,
  );
};

// ✅ Read JSON from LOCAL
const fetchJsonFromLocal = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return null;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local JSON:", error);
    return null;
  }
};

// ✅ Extract JSON from LLM response
const extractJSON = (text) => {
  if (!text) return null;

  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match) return match[1];

  const fallback = text.match(/\{[\s\S]*\}/);
  if (fallback) return fallback[0];

  return null;
};

// ✅ Format transcript for LLM
const formatTranscriptForLLM = (data) => {
  let result = "";

  result += `### Earnings Call Transcript: ${data.metadata?.company || ""} ${data.metadata?.quarter || ""} ${data.metadata?.year || ""}\n\n`;

  result += `## Presentation\n\n`;

  data.presentation?.forEach((item) => {
    result += `${item.speaker}${item.title ? ` (${item.title})` : ""}:\n${item.text}\n\n`;
  });

  if (data.qa_session?.length) {
    result += `---\n\n## Q&A Session\n\n`;

    data.qa_session.forEach((item) => {
      result += `${item.speaker}${item.title ? ` (${item.title})` : ""}:\n${item.text}\n\n`;
    });
  }

  return result;
};

// ✅ Streaming answer generator
const getAnswerForPrompt = async function* (source, prompt, chats, context) {
  try {
    if (!prompt || prompt.trim().length === 0) {
      yield "⚠️ **Error:** The question is unclear.";
      return;
    }

    if (!source || source.trim().length === 0) {
      yield "⚠️ **Note:** No reference data available.";
    }

    const finalMessage = `
You are an expert financial assistant.

${source ? `Relevant Information:\n${source}` : ""}

Prompt:
${prompt}

${context ? `Additional Notes:\n${context}` : ""}
`;

    const stream = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [{ role: "user", content: finalMessage }],
      max_tokens: 800,
      temperature: 0.3,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) yield content;
    }
  } catch (error) {
    console.error(error);
    yield "❌ Error processing request.";
  }
};

// ✅ Main response function
const generateResponse = async (
  prompt,
  rawPrompt,
  chats,
  context,
  previousPrompts,
  selectedCompanies,
  selectedQuarter,
  selectedYear,
) => {
  try {
    const optimizedPrompt = await optimizePrompt(
      previousPrompts,
      prompt,
      JSON.stringify(selectedCompanies),
      JSON.stringify(selectedQuarter),
      JSON.stringify(selectedYear),
      chats,
    );

    const queryParamsArray = optimizedPrompt?.queryParamsArray;

    if (!queryParamsArray || queryParamsArray.length === 0) {
      return "⚠️ Invalid query.";
    }

    if (optimizedPrompt.fetch_transcripts) {
      const filePaths = queryParamsArray.map(generateLocalPath);
      const jsonFiles = await Promise.all(filePaths.map(fetchJsonFromLocal));
      const validFiles = jsonFiles.filter(Boolean);

      const transformedData = validFiles
        .filter((item) => item && item.metadata)
        .map((item) => ({
          id:
            (item.metadata?.ticker || "UNKNOWN") +
            "_" +
            (item.metadata?.year || "UNKNOWN") +
            "_" +
            (item.metadata?.quarter || "UNKNOWN"),
          company_name: item.metadata?.company || "Unknown Company",
          event: item.metadata?.title || "",
          year: item.metadata?.year || "",
          transformedData: formatTranscriptForLLM(item),
        }));

      return getAnswerForPrompt(
        JSON.stringify(transformedData),
        optimizedPrompt.prompt,
        chats,
        context,
      );
    } else {
      return getAnswerForPrompt(
        JSON.stringify(chats),
        optimizedPrompt.prompt,
        chats,
        context,
      );
    }
  } catch (error) {
    console.error(error);
    return "❌ Error processing request.";
  }
};

// ✅ Prompt optimizer
const optimizePrompt = async (
  previousPrompts,
  rawPrompt,
  selectedCompanies,
  selectedQuarter,
  selectedYear,
  chats,
) => {
  try {
    const payload = {
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        {
          role: "user",
          content: `Return JSON:
\`\`\`json
{
 queryParamsArray: [
  { "ticker": "<ticker>", "quarter": "<Q1>", "year": "<2024>" }
 ],
 prompt: "<refined>",
 fetch_transcripts: true
}
\`\`\`

Prompt: ${rawPrompt}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    };

    const completion = await openai.chat.completions.create(payload);

    const text = completion.choices[0]?.message?.content || "";
    const extracted = extractJSON(text);

    if (!extracted) {
      return {
        queryParamsArray: [],
        prompt: rawPrompt,
        fetch_transcripts: false,
      };
    }

    try {
      return JSON.parse(extracted);
    } catch {
      return {
        queryParamsArray: [],
        prompt: rawPrompt,
        fetch_transcripts: false,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ POST API Handler
export async function POST(req) {
  try {
    const body = await req.json();

    const stream = await generateResponse(
      body.inputText,
      body.inputValue,
      body.chats,
      body.context,
      body.previousPrompts,
      body.selectedCompanies,
      body.selectedQuarter,
      body.selectedYear,
    );

    if (!stream || !stream[Symbol.asyncIterator]) {
      return new Response("❌ Failed to generate response", { status: 500 });
    }

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
