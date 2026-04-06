import axios from "axios";
const { S3 } = require("aws-sdk");
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ✅ Check if file already exists
const fileExists = (ticker, year, quarter, folder, extension) => {
  const filePath = path.join(
    process.cwd(),
    folder,
    ticker,
    String(year),
    `Q${quarter}.${extension}`,
  );

  return fs.existsSync(filePath) ? filePath : null;
};

const saveToLocal = async (
  ticker,
  year,
  quarter,
  content,
  folder,
  extension,
) => {
  try {
    const dirPath = path.join(process.cwd(), folder, ticker, String(year));

    fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `Q${quarter}.${extension}`);

    fs.writeFileSync(
      filePath,
      extension === "json" ? JSON.stringify(content, null, 2) : content,
      "utf-8",
    );

    console.log(`Saved locally at ${filePath}`);

    return filePath;
  } catch (error) {
    console.error("Error saving locally:", error);
    return null;
  }
};

// OpenAI (OpenRouter)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// AWS
const s3Client = new S3({
  region: process.env.REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.M_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.M_SECRET_ACCESS_KEY ?? "",
  },
});

const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

const extractJSON2 = (text) => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : "No valid JSON found";
};

// POST handler
export async function POST(req) {
  try {
    const body = await req.json();
    const { inputText } = body;

    const stream = fetchAndUploadTranscript(inputText);

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
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      },
    );
  } catch (error) {
    console.error("POST Error:", error);
    return new Response("Error occurred", { status: 500 });
  }
}

// Get query params via model
const getQueryParams = async (prompt) => {
  try {
    const payload = {
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        {
          role: "user",
          content: `From the following prompt, infer the required company ticker, quarters, and year for which transcripts should be fetched.If you infer 4 for quarters,it means transcripts should be fetched for four quarters.
        
Return your response in JSON format:
\`\`\`json
[
  { "ticker": "<company_ticker>", "quarters": "<number of quarters>", "year": "<year>" }
]
\`\`\`

### Prompt:
${prompt}`,
        },
      ],
      max_tokens: 500,
      temperature: 0,
    };

    const completion = await openai.chat.completions.create(payload);

    const responseText =
      completion.choices[0]?.message?.content || "No response received";

    const extractedJSON = extractJSON2(responseText);
    return JSON.parse(extractedJSON);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

// Fetch transcript
const fetchEarningsCallsTranscript = async (ticker, year, quarter) => {
  try {
    const apiUrl = `${PYTHON_API_URL}/scrape/${ticker.toLowerCase()}/${year}/Q${quarter}`;

    console.log(`Fetching from: ${apiUrl}`);

    const response = await axios.get(apiUrl, { timeout: 30000 });

    if (response.data.success) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching transcript for ${ticker} Q${quarter} ${year}:`,
      error.message,
    );
    return null;
  }
};

// Upload to S3 (unused currently)
const uploadToS3 = async (
  ticker,
  year,
  quarter,
  content,
  folder,
  extension,
) => {
  const fileName = `${folder}/${ticker}/${year}/Q${quarter}.${extension}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: extension === "json" ? JSON.stringify(content, null, 2) : content,
    ContentType:
      extension === "json" ? "application/json" : "text/plain; charset=utf-8",
  };

  try {
    await s3Client.upload(params).promise();
    return `s3://${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return null;
  }
};

const structure = `{
"id": "company_name_Quarter_Year_Earnings_Call",
"company_name": "company_name",
"event": "Quarter Year Earnings Call",
"year": "Year",
"participants": [],
"topics": []
}`;

// AI structuring
const invokeModel = async (transcriptData) => {
  try {
    const payload = {
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        {
          role: "user",
          content: `You are a financial analyst. Analyze and structure this:\n\n${structure}\n\nTranscript:\n${JSON.stringify(
            transcriptData,
            null,
            2,
          )}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    };

    const completion = await openai.chat.completions.create(payload);

    const responseText =
      completion.choices[0]?.message?.content || "No response received";

    return extractJson(responseText);
  } catch (error) {
    console.error("Error invoking model:", error);
    return {};
  }
};

// Main stream processor
const fetchAndUploadTranscript = async function* (prompt) {
  try {
    const queryParamsArray = await getQueryParams(prompt);

    for (const company of queryParamsArray) {
      for (let quarter = 1; quarter <= parseInt(company.quarters); quarter++) {
        try {
          const localPath = await handler({
            ticker: company.ticker,
            year: parseInt(company.year),
            quarter,
          });

          yield `✅ Saved ${company.ticker} Q${quarter} at: ${localPath}\n`;
        } catch (err) {
          console.error(
            `❌ Failed ${company.ticker} Q${quarter}:`,
            err.message,
          );

          // 🔥 DO NOT BREAK — just continue
          yield `❌ Failed ${company.ticker} Q${quarter}: ${err.message}\n`;
        }
      }
    }
  } catch (error) {
    console.error(error);
    yield "Error occurred while processing transcripts.\n";
  }
};

// ✅ UPDATED HANDLER (core change)
const handler = async ({ ticker, year, quarter }) => {
  try {
    // 🔥 Check local cache FIRST
    const existingFile = fileExists(
      ticker,
      year,
      quarter,
      "transcripts/json",
      "json",
    );

    if (existingFile) {
      console.log(`⚡ Already exists: ${existingFile}`);
      return existingFile;
    }

    // Fetch only if not exists
    const response = await fetchEarningsCallsTranscript(ticker, year, quarter);

    if (!response || !response.success) {
      throw new Error(
        `No transcript data received for ${ticker} Q${quarter} ${year}`,
      );
    }

    const transcriptData = response;

    const structuredDataForAI = {
      company_name: transcriptData.metadata?.company || ticker,
      year,
      quarter,
      participants: transcriptData.participants || {},
      presentation_summary: transcriptData.presentation?.slice(0, 3) || [],
      qa_summary: transcriptData.qa_session?.slice(0, 5) || [],
    };

    const structuredTranscript = await invokeModel(structuredDataForAI);

    const mergedData = {
      ...JSON.parse(structuredTranscript || "{}"),
      presentation: transcriptData.presentation || [],
      qa_session: transcriptData.qa_session || [],
      participants: transcriptData.participants || {},
      metadata: transcriptData.metadata || {
        ticker,
        quarter: `Q${quarter}`,
        year,
      },
      stats: transcriptData.stats || {},
    };

    const localPath = await saveToLocal(
      ticker,
      year,
      quarter,
      mergedData,
      "transcripts/json",
      "json",
    );

    return localPath;
  } catch (error) {
    console.error("Error in handler:", error);
    throw error;
  }
};
