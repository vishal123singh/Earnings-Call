// app/api/generate-chart/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { jsonrepair } from "jsonrepair";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

type ChartRequest = {
  companies: string[];
  graphType: string;
  prompt: string;
  companyData: Record<string, any>;
  isModificationRequest?: boolean;
  currentChart?: any;
};

export function buildPrompt(request: ChartRequest) {
  if (request.isModificationRequest && request.currentChart) {
    return `
You are a financial data visualization assistant. The user wants to modify an existing chart.

Current chart configuration:
${JSON.stringify(request.currentChart, null, 2)}

Original data context:
${JSON.stringify(request.companyData, null, 2)}

The user's modification request: "${request.prompt}"

Generate ONLY a JSON object with this structure:
\`\`\`json
{
  "type": "chart_update",
  "data": {
    "chartType": "bar" | "line" | "pie" | "doughnut",
    "data": {
      "labels": [...],
      "datasets": [...]
    },
    "options": { ... },
    "analysis": "string"
  }
}
\`\`\`

OR if the request is just informational:

\`\`\`json
{
  "type": "response",
  "text": "Your response to the user's question"
}
\`\`\`

ONLY return the JSON. Do not include any explanation or markdown formatting.
`.trim();
  }

  // Non-modification branch: allow both options.
  return `
You are a financial data visualization assistant.

Given the following financial data:
${JSON.stringify(request.companyData, null, 2)}

Generate ONLY a JSON object with one of these two structures:

For chart updates:
\`\`\`json
{
  "type": "chart_update",
  "data": {
    "chartType": "bar" | "line" | "pie" | "doughnut",
    "data": {
      "labels": [...],
      "datasets": [...]
    },
    "options": {"maintainAspectRatio": false, ...},
    "analysis": "string"
  }
}
\`\`\`

For informational responses:
\`\`\`json
{
  "type": "response",
  "text": "Your response to the user's question"
}
\`\`\`

Graph type to generate (if applicable): "${request.graphType}".

Additional prompt: "${request.prompt}"

ONLY return the JSON. Do not include any explanation or markdown formatting.
`.trim();
}

function parseAIResponse(content: string) {
  try {
    // Extract JSON from markdown code block if present
    const match = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      content = match[1].trim();
    } else {
      // Try to find the first `{ ... }` block
      const braceIndex = content.indexOf("{");
      if (braceIndex !== -1) {
        content = content.slice(braceIndex);
      }
    }

    // Use jsonrepair to fix malformed JSON (e.g., bad quotes, commas)
    const repaired = jsonrepair(content);
    return JSON.parse(repaired);
  } catch (parseError) {
    console.error("Failed to parse JSON content:", parseError);
    console.log("Problematic content:\n", content);
    throw new Error("Invalid JSON format returned from AI");
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();
    const {
      companies,
      graphType,
      prompt,
      companyData,
      isModificationRequest = false,
      currentChart = null,
    } = requestData;

    if (!companies || !companyData || (!graphType && !isModificationRequest)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: isModificationRequest
            ? "You are a financial data analyst who can modify existing charts or answer questions."
            : "You are a financial data analyst who creates valid Chart.js configurations.",
        },
        {
          role: "user",
          content: buildPrompt({
            companies,
            graphType,
            prompt,
            companyData,
            isModificationRequest,
            currentChart,
          }),
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    console.log("Raw AI content:", content);

    const parsed = parseAIResponse(content);

    // Validate response structure
    if (isModificationRequest) {
      if (!parsed.type || (parsed.type === "chart_update" && !parsed.data)) {
        throw new Error("Invalid response structure from AI");
      }
    } else if (!parsed.type || !parsed.data) {
      throw new Error("Invalid chart configuration from AI");
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to process request",
        details: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}
