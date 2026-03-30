// import { readFile } from "fs/promises";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// import path from "path";

// // Initialize OpenAI with OpenRouter API
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { prompt, companies, chartData } = await req.json();

//     const result = await getReportsFilePath(prompt, companies, chartData)
//     console.log("prompt", prompt)
//     console.log("companies", companies)
//     console.log("filepaths", result.filepaths);

//     const financialData = await processAllReports(prompt, result.filepaths, companies);

//     // ❗️ Validate input
//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     // 📡 Prepare OpenRouter API Request
//     const payload = {
//       model: "deepseek/deepseek-chat:free",
//       messages: [
//         {
//           role: "user",
//           content: `
//           Your task is to provide data for company/companies to create charts using financial reports provided to you.
//           The prompt is about creating a chart.
//           If prompt is not about getting chart data to create or update a chart,then make "isChart" false else true.And give your response in "insights".
//           Incase appropriate data is not provided to you,get it yourself from a valid source of information.
//           Here is the Prompt:
//           ${prompt}

//           Companies:
//           ${JSON.stringify(companies)}

//         Financial Reports:
// ${JSON.stringify(financialData)}

//           Return your response in JSON format:
//           \`\`\`json
//           {
//             "chartType": <options are 'line',
//               'area',
//               'candlestick',
//               'bar',
//               'column',
//               'stackedBar',
//               'stackedColumn',
//               'pie',
//               'donut',
//               'ohlc',
//               'scatter',
//               'bubble',
//               'waterfall',
//               'heatmap'>,
//             "chartData": <in the format that igniteui-react-charts for 'ohlc', 'waterfall',
//               'heatmap',and 'candlestick' ,and for all other chart types in the format that react-chartjs-2 expects >,
//             "title": <chart title>,
//             "insights": <insights about chart data/response to a prompt>,
//             "isChart": <true/false>
//           }
//           \`\`\`
//           `,
//         },
//       ],
//       max_tokens: 1000,
//       temperature: 0.7,
//       top_p: 0.999,
//       stream: false, // ❗️ Disable streaming
//     };

//     // 🔥 Create AI completion without streaming
//     const completion = await openai.chat.completions.create(payload);

//     // 🎯 Extract the full response
//     const responseText = completion.choices[0]?.message?.content || "";
//     // console.log("responseText", responseText)
//     // 📊 Extract JSON content from response
//     const extractedJSON = extractJSON(responseText);
//     //console.log("extractedJSON", extractedJSON)
//     // 📝 Return extracted JSON to the client
//     return NextResponse.json(
//       { data: JSON.parse(extractedJSON) },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error invoking OpenRouter API:", error);
//     return NextResponse.json(
//       { error: "Failed to invoke model" },
//       { status: 500 }
//     );
//   }
// }

// // 🎯 Extract JSON from response text
// const extractJSON = (text) => {
//   const match = text.match(/```json\n([\s\S]*?)\n```/);
//   return match ? match[1] : "No valid JSON found";
// };


// const getReportsFilePath = async (prompt, companies, chartData) => {
//   try {
//     // 📡 Prepare OpenRouter API Request
//     const payload = {
//       model: "mistralai/mistral-small-3.1-24b-instruct:free",
//       messages: [
//         {
//           role: "system",
//           content: `
//         Your task is to generate "filepaths" for financial reports based on the provided prompt and companies' tickers.

//         If the prompt requests financial data (e.g., revenue, net income, etc.) over a period of time for specific companies, return the corresponding "filepaths."

//         Example 1:
//         - Prompt: "Revenue for last 3 years"
//         - Companies: ["AAPL"]
//         - Filepaths: ["/AAPL/Annual/2021/10-K.json", "/AAPL/Annual/2022/10-K.json", "/AAPL/Annual/2023/10-K.json"]

//          Example 2:
//         - Prompt: "Revenue for last 3 quarters"
//         - Companies: ["GOOGL"]
//         - Filepaths: ["/GOOGL/Quarterly/2021/Q1.json", "/GOOGL/Quarterly/2021/Q2.json", "/GOOGL/Quarterly/2021/Q3.json"]

//          Example 3:
//         - Prompt: "Revenue for last 3 years"
//         - Companies: ["AAPL","GOOGL"]
//         - Filepaths: ["/AAPL/Annual/2021/10-K.json", "/AAPL/Annual/2022/10-K.json", "/AAPL/Annual/2023/10-K.json","/GOOGL/Annual/2021/10-K.json", "/GOOGL/Annual/2022/10-K.json", "/GOOGL/Annual/2023/10-K.json"]

//         If type of report is not mentioned or clear in the prompt, consider reports to be "Annual".

//         Note 1:"Annual reports are available for companies from 2021 onwards to 2024. Quarterly reports are available for companies from 2021 onwards to 2024."

//         Note 2:"Reports for 4rth quarter is not available for companies.So if 4rth quarter report is required to answer the prompt ,you use the 10-K report of that year,and provide the filepath accordingly."

//         Note 3:"If time period for which reports needs to be fetched is not clear from the prompt,then use last 3 years for 'annual reports' and last 3 quarters for 'quarterly reports'."

//         Note 4:"Values in the financial data is in 'thousands' and currency is 'US-dollars'."

//         Note 5: "If the prompt is ambiguous, refer to the previous context provided to clarify the user's intent. If the context is also insufficient, return an empty array."

//         Return your response in strict JSON format:
//         \`\`\`json
//         {
//           "filepaths": []
//         }
//         \`\`\`

//         Current Prompt:
//         ${prompt}

//         Companies:
//         ${JSON.stringify(companies)}

//         Previous Context:
//         ${JSON.stringify(chartData)}
//       `,
//         },
//       ],

//       max_tokens: 1000,
//       temperature: 0.7,
//       top_p: 0.999,
//       stream: false, // ❗️ Disable streaming
//     };

//     // 🔥 Create AI completion without streaming
//     const completion = await openai.chat.completions.create(payload);
//     console.log("completion=======================", completion)
//     // 🎯 Extract the full response
//     const responseText = completion.choices[0]?.message?.content || "";

//     // 📊 Extract JSON content from response
//     const extractedJSON = extractJSON(responseText);

//     return JSON.parse(extractedJSON);

//   } catch (error) {
//     console.log(error)

//   }
// }

// const answerPrompt = async (prompt, financialReports) => {
//   try {
//     const payload = {
//       model: "mistralai/mistral-small-3.1-24b-instruct:free",
//       messages: [
//         {
//           role: "user",
//           content: `
//           Answer the prompt based on the provided financial reports.

//           **Instructions:**
//           - Thoroughly analyze the financial reports before generating a response.
//           - Use the correct formula when calculating any financial metric.
//           - Assume all values are in thousands and the currency is US dollars unless stated otherwise.
//           - Accurately calculate the financial metric's value before including it in the response.
//           - Negative values should remain negative; do not modify them to positive.
//           - Follow industry standards if the prompt is unclear.

//           **Special Case:**
//           - If the form type is **10-K** and the prompt requires quarterly data, treat it as data for **Q4** and use \`quarterly\` as the \`report_type\`.

//            **Return Guidelines:**
//     - Always return parsable JSON data.

//           **Return your response strictly in JSON format:**
//           \`\`\`json
//           {
//             "metric": "<metric name>",
//             "value": <metric value>,
//             "ticker": "<company_ticker>",
//             "company_name": "<company name for the ticker>",
//             "period_of_report": "<period of the report>",
//             "report_type": "<annual/quarterly>",
//             "reason": "<reason how this metric value has come>"
//           }
//           \`\`\`

//           **Prompt:**
//           ${prompt}

//           **Financial Reports:**
//           ${JSON.stringify(financialReports)}
//           `
//         },
//       ],

//       max_tokens: 1000,
//       temperature: 0, // Lower temperature for more deterministic results
//       top_p: 0.9, // Reduce randomness by lowering top_p
//       stream: false, // ❗️ Streaming disabled
//     };


//     // 🔥 Create AI completion without streaming
//     const completion = await openai.chat.completions.create(payload);
//     console.log("answerPrompt", completion.choices[0]?.message)
//     // 🎯 Extract the full response
//     const responseText = completion.choices[0]?.message?.content || "";

//     // 📊 Extract JSON content from response
//     const extractedJSON = extractJSON(responseText);

//     return JSON.parse(extractedJSON);

//   } catch (error) {
//     console.log(error)

//   }
// }
// // ✅ Base Directory Prefix
// const BASE_PATH = "./public/financial-metrics";

// // 📚 Function to Read Data from a Single Filepath
// async function readFinancialReport(filepath) {
//   try {
//     // 📂 Construct Full File Path
//     const fullPath = path.join(BASE_PATH, filepath);

//     // 📚 Read File Content
//     const data = await readFile(fullPath, "utf-8");

//     // ✅ Parse and Return JSON Content
//     return JSON.parse(data);
//   } catch (error) {
//     console.error(`❌ Error reading file: ${filepath}`, error.message);
//     return null; // Return null if file not found or error occurs
//   }
// }

// // 🔥 Loop through filepaths and process each one
// const processAllReports = async (prompt, filepaths, companies) => {
//   try {
//     // 🎯 Collect all promises for processing
//     const reportPromises = filepaths.map(async (filepath) => {
//       // 📚 Read the file's content (assuming you're fetching data or reading files)
//       const financialReport = await readFinancialReport(filepath);
//       const { optimizedPrompt } = await getIndependentPrompt(prompt, companies, filepath);

//       console.log("optimizedPrompt", optimizedPrompt)
//       // 🚀 Call answerPrompt for each report
//       const result = await answerPrompt(optimizedPrompt, financialReport);
//       return result;
//     });

//     // ⏳ Wait for all promises to resolve
//     const allResults = await Promise.all(reportPromises);

//     console.log("✅ All responses gathered successfully:", allResults);
//     return allResults;
//   } catch (error) {
//     console.error("❌ Error processing reports:", error);
//     return [];
//   }
// };


// const getIndependentPrompt = async (prompt, companies, filepath) => {
//   try {
//     const payload = {
//       model: "mistralai/mistral-small-3.1-24b-instruct:free",
//       messages: [
//         {
//           role: "system",
//           content: `
//           Your task is to optimize the following prompt for extracting financial metrics from company-specific financial data.

//           **Scenario:**
//           - An AI model is invoked for each company's financial data individually.
//           - The task is to extract and calculate relevant financial metrics for the company.
//           - The ticker of the company being processed is available in the \`filepath\`, but it should not be mentioned in the optimized prompt.

//           **Objective:**
//           - Optimize the prompt to ensure the AI model accurately extracts the required financial metrics.
//           - The optimized prompt should be **independent of financial data from other periods** if multiple periods are involved.
//           - **Avoid prompts that require comparisons across different time periods.**

//          **Example:**
// - Original: "Profit Margin"
// - Optimized: "What is the profit margin for SOFI?"
// - Original: "Cash flow change"
// - Optimized: "What is the cash flow amount for SOFI?"


//           **Return Guidelines:**
//     - Always return parsable JSON data.

//           **Return your response strictly in JSON format:**
//           \`\`\`json
//           {
//             "optimizedPrompt": "<optimized prompt for the AI model>"
//           }
//           \`\`\`

//           **Prompt to Optimize:**
//           ${prompt}

//           **Company List:**
//           ${JSON.stringify(companies)}

//           **Filepath (for context only, do not include in the prompt):**
//           ${filepath}
//           `
//         },
//       ],


//       max_tokens: 1000,
//       temperature: 0, // Lower temperature for more deterministic results
//       top_p: 0.9, // Reduce randomness by lowering top_p
//       stream: false, // ❗️ Streaming disabled
//     };


//     // 🔥 Create AI completion without streaming
//     const completion = await openai.chat.completions.create(payload);
//     console.log("optimizedPrompt completion", completion.choices[0]?.message)
//     // 🎯 Extract the full response
//     const responseText = completion.choices[0]?.message?.content || "";

//     // 📊 Extract JSON content from response
//     const extractedJSON = extractJSON(responseText);

//     return JSON.parse(extractedJSON);

//   } catch (error) {
//     console.log(error)

//   }
// }


import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with OpenRouter API
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt, companies, chartData } = await req.json();
    console.log("chartData", chartData);

    // ❗️ Validate input
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 📡 Prepare OpenRouter API Request
    const payload = {
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `
          Your task is to provide data for company/companies to create charts.If there is no mention of period for which data is required, use the last 5 years data for all companies.
          The prompt is about creating a chart or updating a previous chart,then make "isChart" as true else false.
          If the current prompt is not clear enough, refer to the context provided as the current prompt could be stemming from previous context.

          Here is the Prompt:
          ${prompt}

          Companies:
          ${JSON.stringify(companies)}

          Previous context:
          ${JSON.stringify(chartData)}

          In case the prompt is about updating a previous chart, mention the "chartId" of that chartData and set isUpdate to true, otherwise set it to false.

          Return your response in JSON format:
          \`\`\`json
          {
            "chartType": <options are 'line',
              'area',
              'candlestick',
              'bar',
              'column',
              'stackedBar',
              'stackedColumn',
              'pie',
              'donut',
              'ohlc',
              'scatter',
              'bubble',
              'waterfall',
              'heatmap'>,
            "chartData": <in the format that igniteui-react-charts for 'ohlc', 'waterfall',
              'heatmap',and 'candlestick' ,and for all other chart types in the format that react-chartjs-2 expects >,
            "title": <chart title>,
            "chartId": <chartId>,
            "isUpdate": <true/false>,
            "insights": <insights about chart data>
          }
          \`\`\`
          `,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.999,
      stream: false, // ❗️ Disable streaming
    };

    // 🔥 Create AI completion without streaming
    const completion = await openai.chat.completions.create(payload);

    // 🎯 Extract the full response
    const responseText = completion.choices[0]?.message?.content || "";

    // 📊 Extract JSON content from response
    const extractedJSON = extractJSON(responseText);

    // 📝 Return extracted JSON to the client
    return NextResponse.json(
      { data: JSON.parse(extractedJSON) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error invoking OpenRouter API:", error);
    return NextResponse.json(
      { error: "Failed to invoke model" },
      { status: 500 }
    );
  }
}

// 🎯 Extract JSON from response text
const extractJSON = (text) => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : "No valid JSON found";
};
