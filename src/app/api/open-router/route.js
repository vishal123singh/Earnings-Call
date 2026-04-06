// import OpenAI from "openai";

// const { S3 } = require("aws-sdk");

// // AWS Configurations
// const s3Client = new S3({
//   region: process.env.REGION ?? "us-east-1",
//   credentials: {
//     accessKeyId: process.env.M_ACCESS_KEY_ID ?? "",
//     secretAccessKey: process.env.M_SECRET_ACCESS_KEY ?? "",
//   },
// });

// // ✅ Initialize OpenAI with OpenRouter API
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPEN_ROUTER_API_KEY,
// });

// // Quarter Mapping
// const quarterMapping = {
//   "1st": 1,
//   "2nd": 2,
//   "3rd": 3,
//   "4rth": 4,
//   "4th": 4,
//   Q1: 1,
//   Q2: 2,
//   Q3: 3,
//   Q4: 4,
//   first: 1,
//   second: 2,
//   third: 3,
//   fourth: 4,
// };

// /**
//  * Generates an S3 URI from the given object.
//  */
// const generateS3Uri = (obj) => {
//   if (!obj.ticker || !obj.year || !obj.quarter) {
//     throw new Error("Missing required fields: ticker, year, or quarter.");
//   }

//   const quarterNumber = quarterMapping[obj.quarter];
//   if (!quarterNumber) {
//     throw new Error(`Invalid quarter value: ${obj.quarter}`);
//   }
//   return `s3://earnings-calls-transcripts/transcripts/json/${obj.ticker}/${obj.year}/Q${quarterNumber}.json`;
// };

// // Function to fetch JSON from S3
// async function fetchJsonFromS3(fileUrl) {
//   try {
//     const { bucket, key } = parseS3Uri(fileUrl);
//     const params = { Bucket: bucket, Key: key };

//     const data = await s3Client.getObject(params).promise();
//     return JSON.parse(data.Body.toString("utf-8"));
//   } catch (error) {
//     console.error("Error fetching JSON:", error);
//     return null;
//   }
// }

// // Function to extract bucket name and key from S3 URI
// const parseS3Uri = (s3Uri) => {
//   const match = s3Uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
//   if (!match) {
//     throw new Error("Invalid S3 URI format.");
//   }
//   return { bucket: match[1], key: match[2] };
// };

// // Function to extract JSON from text
// const extractJSON = (text) => {
//   const match = text.match(/```json\n([\s\S]*?)\n```/);
//   return match ? match[1] : "No valid JSON found";
// };

// const getAnswerForPrompt = async function* (
//   source,
//   prompt,
//   chats,
//   context,
//   persona,
//   foundationModel,
//   fmTemperature,
//   fmMaxTokens,
// ) {
//   try {
//     // Check if the prompt is missing or unclear
//     if (!prompt || prompt.trim().length === 0) {
//       yield "⚠️ **Error:** The question is unclear. Please provide more details.";
//       return;
//     }

//     // Warn if source data is missing
//     if (!source || source.trim().length === 0) {
//       yield "⚠️ **Note:** No reference data available. Providing a general response:";
//     }

//     // Construct prompt message dynamically
//     const baseInstruction = `
// You are an expert financial assistant responding to a question.
// Use the internal information below to guide your answer, but do not mention or reference any transcripts, context, sources, or formatting.

// Audience: ${persona}.
// Respond in clear markdown. If the question cannot be answered with the available information, respond accordingly without guessing.
// `;

//     const contextBlock =
//       source && source.trim().length > 0
//         ? `\nRelevant Information:\n${source.trim()}`
//         : "";

//     const additionalContextBlock =
//       context && context.trim().length > 0
//         ? `\nAdditional Notes:\n${context.trim()}`
//         : "";

//     const finalMessage = `${baseInstruction}${contextBlock}\n\nPrompt:\n${prompt.trim()}${additionalContextBlock}`;

//     const payload = {
//       // model: "deepseek/deepseek-r1:free",
//       model: "nvidia/nemotron-3-nano-30b-a3b:free",

//       messages: [
//         {
//           role: "user",
//           content: finalMessage,
//         },
//       ],
//       max_tokens: fmMaxTokens,
//       temperature: fmTemperature,
//       top_p: 0.999,
//       stream: true,
//     };

//     // Create OpenRouter Completion Request with Streaming
//     const stream = await openai.chat.completions.create(payload);

//     // Read and stream response chunks
//     for await (const chunk of stream) {
//       const content = chunk.choices[0]?.delta?.content || "";
//       if (content) {
//         yield content;
//       }
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     yield "❌ **Error:** Unable to process your request at the moment. Please try again later.";
//   }
// };

// // Function to generate response from OpenRouter
// const generateResponse = async (
//   prompt,
//   rawPrompt,
//   chats,
//   context,
//   persona,
//   foundationModel,
//   fmTemperature,
//   fmMaxTokens,
//   previousPrompts,
//   selectedCompanies,
//   selectedQuarter,
//   selectedYear,
// ) => {
//   try {
//     console.log("selectedCompanies", selectedCompanies);
//     const optimizedPrompt = await optimizePrompt(
//       previousPrompts,
//       prompt,
//       JSON.stringify(selectedCompanies),
//       JSON.stringify(selectedQuarter),
//       JSON.stringify(selectedYear),
//       chats,
//     );

//     const queryParamsArray = optimizedPrompt?.queryParamsArray;
//     console.log("queryParamsArray", queryParamsArray);
//     if (
//       !queryParamsArray ||
//       queryParamsArray.length === 0 ||
//       queryParamsArray[0].ticker === "ALL"
//     ) {
//       return "⚠️ **Error:** The request could not be processed. Please refine your query and try again.";
//     }
//     if (optimizedPrompt.fetch_transcripts) {
//       const s3urls = queryParamsArray.map(generateS3Uri);
//       const jsonFiles = await Promise.all(s3urls.map(fetchJsonFromS3));
//       const transformedData = jsonFiles.map((item) => ({
//         id: item.id,
//         company_name: item.company_name,
//         event: item.event,
//         year: item.year,
//         transcript: item.transcript.map((t) => t.text).join(" "), // Join all transcript texts
//       }));
//       return getAnswerForPrompt(
//         JSON.stringify(transformedData),
//         optimizedPrompt.prompt,
//         chats,
//         context,
//         persona,
//         foundationModel,
//         fmTemperature,
//         fmMaxTokens,
//       );
//     } else {
//       return getAnswerForPrompt(
//         JSON.stringify(chats),
//         optimizedPrompt.prompt,
//         chats,
//         context,
//         persona,
//         foundationModel,
//         fmTemperature,
//         fmMaxTokens,
//       );
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// const optimizePrompt = async (
//   previousPrompts,
//   rawPrompt,
//   selectedCompanies,
//   selectedQuarter,
//   selectedYear,
//   chats,
// ) => {
//   try {
//     console.log("optimizePrompt-----------");

//     console.log("previousPrompts:", previousPrompts);
//     console.log("rawPrompt:", rawPrompt);
//     console.log("selectedCompanies:", selectedCompanies);
//     console.log("selectedQuarter:", selectedQuarter);
//     console.log("selectedYear:", selectedYear);
//     //console.log('chats:', chats);
//     const previousPromptsString = previousPrompts.join("\n\n");

//     // 📡 OpenRouter Payload for Prompt Optimization
//     const payload = {
//       //   model: "mistralai/mistral-small-3.1-24b-instruct:free",
//       model: "nvidia/nemotron-3-nano-30b-a3b:free",

//       messages: [
//         {
//           role: "user",
//           content: `Based on previous prompts, you need to make the current prompt more clear only if it is not and it is stemming from previous prompt(s) else just return the prompt as it is without modifying it.\n\nPrevious prompts:${previousPromptsString}\n\n\nCurrent prompt:${rawPrompt}.\n\n\nFor example if the current prompt is "just for sofi" and previous prompts is "Who were the analysts?", then you have to make the current prompt more clear by framing it as "Who were the analysts for sofi?". Consider these informations as well Selected Companies: ${selectedCompanies}.\n\nSelected Quarter:${selectedQuarter}\n\nSelected Year:${selectedYear}\n\n\n
//             From your generated response, infer the required company ticker(s), quarter(s), and year(s) for which transcripts are needed. If you infer that you need for all the quarters, then insert four values. Transcripts are only available for the year 2024.
//             For quarter, use Q1, Q2, Q3, Q4 and for year, use 2024. If you think that the prompt is about a previous response in that chats history and no need to fetch transcripts again, then set
//             fetch_transcripts to false else set it to true.
//         Return your response in JSON format:
//         \`\`\`json
//        {
//         queryParamsArray: [
//             { "ticker": "<company_ticker>", "quarter": "<quarter>", "year": "<year>" }
//         ],
//         prompt: "<refined and clear prompt>",
//         fetch_transcripts: <either true or false>
//         }
//           `,
//         },
//       ],
//       max_tokens: 1000,
//       temperature: 0,
//     };

//     // ✅ Create OpenRouter Completion for Optimization
//     const completion = await openai.chat.completions.create(payload);
//     const responseText =
//       completion.choices[0]?.message?.content || "No response received";
//     const extractedJSON = extractJSON(responseText);
//     return JSON.parse(extractedJSON);
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     throw error;
//   }
// };

// // **POST API Handler**
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       inputText,
//       inputValue,
//       chats,
//       context,
//       persona,
//       foundationModel,
//       fmTemperature,
//       fmMaxTokens,
//       previousPrompts,
//       selectedCompanies,
//       selectedQuarter,
//       selectedYear,
//     } = body;

//     console.log("inputText:", inputText);
//     console.log("inputValue:", inputValue);
//     //console.log('chats:', chats);
//     console.log("context:", context);
//     console.log("persona:", persona);
//     console.log("foundationModel:", foundationModel);
//     console.log("fmTemperature:", fmTemperature);
//     console.log("fmMaxTokens:", fmMaxTokens);
//     console.log("previousPrompts:", previousPrompts);
//     console.log("selectedCompanies:", selectedCompanies);
//     console.log("selectedQuarter:", selectedQuarter);
//     console.log("selectedYear:", selectedYear);

//     const stream = await generateResponse(
//       inputText,
//       inputValue,
//       chats,
//       context,
//       persona,
//       foundationModel,
//       fmTemperature,
//       fmMaxTokens,
//       previousPrompts,
//       selectedCompanies,
//       selectedQuarter,
//       selectedYear,
//     );

//     return new Response(
//       new ReadableStream({
//         async start(controller) {
//           for await (const chunk of stream) {
//             controller.enqueue(new TextEncoder().encode(chunk));
//           }
//           controller.close();
//         },
//       }),
//       {
//         headers: {
//           "Content-Type": "text/plain; charset=utf-8",
//           "Cache-Control": "no-cache",
//         },
//       },
//     );
//   } catch (error) {
//     console.error("POST Error:", error);
//     return new Response("Error occurred", { status: 500 });
//   }
// }

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ✅ OpenAI (OpenRouter)
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

// Extract JSON from LLM response
const extractJSON = (text) => {
  if (!text) return null;

  // Try fenced JSON
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match) return match[1];

  // Fallback: try to extract any JSON object
  const fallback = text.match(/\{[\s\S]*\}/);
  if (fallback) return fallback[0];

  return null;
};

// Streaming answer generator
const getAnswerForPrompt = async function* (
  source,
  prompt,
  chats,
  context,
  persona,
  foundationModel,
  fmTemperature,
  fmMaxTokens,
) {
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

Audience: ${persona}

${source ? `Relevant Information:\n${source}` : ""}

Prompt:
${prompt}

${context ? `Additional Notes:\n${context}` : ""}
`;

    const stream = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [{ role: "user", content: finalMessage }],
      max_tokens: fmMaxTokens,
      temperature: fmTemperature,
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

const formatTranscriptForLLM = (data) => {
  let result = "";

  result += `### Earnings Call Transcript: ${data.metadata?.company || ""} ${data.metadata?.quarter || ""} ${data.metadata?.year || ""}\n\n`;

  // Presentation
  result += `## Presentation\n\n`;

  data.presentation?.forEach((item) => {
    result += `${item.speaker}${
      item.title ? ` (${item.title})` : ""
    }:\n${item.text}\n\n`;
  });

  // Q&A
  if (data.qa_session?.length) {
    result += `---\n\n## Q&A Session\n\n`;

    data.qa_session.forEach((item) => {
      result += `${item.speaker}${
        item.title ? ` (${item.title})` : ""
      }:\n${item.text}\n\n`;
    });
  }

  return result;
};

// ✅ MAIN RESPONSE FUNCTION (UPDATED)
const generateResponse = async (
  prompt,
  rawPrompt,
  chats,
  context,
  persona,
  foundationModel,
  fmTemperature,
  fmMaxTokens,
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
      // ✅ Use LOCAL instead of S3
      const filePaths = queryParamsArray.map(generateLocalPath);

      const jsonFiles = await Promise.all(filePaths.map(fetchJsonFromLocal));

      const validFiles = jsonFiles.filter(Boolean);

      const transformedData = validFiles
        .filter((item) => item && item.metadata) //  IMPORTANT FILTER
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
        persona,
        foundationModel,
        fmTemperature,
        fmMaxTokens,
      );
    } else {
      return getAnswerForPrompt(
        JSON.stringify(chats),
        optimizedPrompt.prompt,
        chats,
        context,
        persona,
        foundationModel,
        fmTemperature,
        fmMaxTokens,
      );
    }
  } catch (error) {
    console.error(error);
  }
};

// Prompt optimizer (unchanged)
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
      console.error("❌ No JSON found. Raw:", text);

      return {
        queryParamsArray: [],
        prompt: rawPrompt,
        fetch_transcripts: false,
      };
    }

    try {
      return JSON.parse(extracted);
    } catch (err) {
      console.error("❌ JSON parse failed:", extracted);

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

// POST API
export async function POST(req) {
  try {
    const body = await req.json();

    const stream = await generateResponse(
      body.inputText,
      body.inputValue,
      body.chats,
      body.context,
      body.persona,
      body.foundationModel,
      body.fmTemperature,
      body.fmMaxTokens,
      body.previousPrompts,
      body.selectedCompanies,
      body.selectedQuarter,
      body.selectedYear,
    );

    // 🚨 IMPORTANT GUARD
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
