// import { NextResponse } from "next/server";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//   region: process.env.REGION,
//   credentials: {
//     accessKeyId: process.env.M_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.M_SECRET_ACCESS_KEY!,
//   },
// });
// const quarters = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

// // **POST API Handler**
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { selectedCompany, selectedQuarter, selectedYear } = body;
//     const ticker = selectedCompany.ticker || selectedCompany.value;

//     const quarter = quarters[selectedQuarter as keyof typeof quarters];

//     const bucketName = process.env.S3_BUCKET_NAME;
//     const key = `transcripts/json/${ticker}/${selectedYear}/Q${quarter}.json`;
//     console.log("key", key);
//     const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
//     const response = await s3.send(command);

//     if (!response.Body) throw new Error("File not found in S3");

//     // Return the stream directly
//     return new Response(response.Body as ReadableStream, {
//       headers: {
//         "Content-Type": response.ContentType || "application/octet-stream",
//         "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
//       },
//     });
//   } catch (error) {
//     console.error("POST Error:", error);
//     return new Response("Error occurred", { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const quarters = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

// **POST API Handler**
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectedCompany, selectedQuarter, selectedYear } = body;

    const ticker = selectedCompany.ticker || selectedCompany.value;
    const quarter = quarters[selectedQuarter as keyof typeof quarters];
    const quarterFormatted = `Q${quarter}`;

    // Local file path
    const filePath = path.join(
      process.cwd(),
      "transcripts/json",
      ticker,
      String(selectedYear),
      `Q${quarter}.json`,
    );

    console.log("Looking for file at:", filePath);

    let transcriptData = null;

    // Try to read from local file first
    if (fs.existsSync(filePath)) {
      console.log("✅ File found locally, reading from cache...");
      const fileBuffer = fs.readFileSync(filePath);
      transcriptData = JSON.parse(fileBuffer.toString());

      return new Response(JSON.stringify(transcriptData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // If file not found locally, try Python API
    console.log("❌ File not found locally, fetching from Python API...");

    const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
    const pythonApiEndpoint = `${pythonApiUrl}/scrape/${ticker.toLowerCase()}/${selectedYear}/${quarterFormatted}`;

    console.log("Calling Python API:", pythonApiEndpoint);

    const pythonResponse = await fetch(pythonApiEndpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!pythonResponse.ok) {
      console.error("Python API returned error:", pythonResponse.status);
      throw new Error(`Python API error: ${pythonResponse.status}`);
    }

    const pythonData = await pythonResponse.json();

    if (!pythonData.success) {
      throw new Error(
        pythonData.error || "Python API returned unsuccessful response",
      );
    }

    // Transform Python API response to match expected format
    transcriptData = {
      presentation: pythonData.presentation || [],
      qa_session: pythonData.qa_session || [],
      participants: pythonData.participants || { corporate: [], analysts: [] },
      metadata: pythonData.metadata || {
        company: ticker,
        ticker: ticker,
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

    // Save the fetched transcript locally for future use
    await saveTranscriptLocally(filePath, transcriptData);
    console.log("✅ Transcript saved locally");

    return new Response(JSON.stringify(transcriptData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(
      JSON.stringify({
        error: "Error occurred while fetching transcript",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}

// Helper function to save transcript locally
async function saveTranscriptLocally(filePath: string, data: any) {
  try {
    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log("Created directory:", dirPath);
    }

    // Write file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("File saved to:", filePath);
  } catch (error) {
    console.error("Error saving transcript locally:", error);
    // Don't throw - we already have the data, just log the error
  }
}
