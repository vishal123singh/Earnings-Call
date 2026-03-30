
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.M_ACCESS_KEY_ID!,
    secretAccessKey: process.env.M_SECRET_ACCESS_KEY!,
  },
});
const quarters = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

// **POST API Handler**
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectedCompany, selectedQuarter, selectedYear } = body;
    const ticker = selectedCompany.ticker || selectedCompany.value;

    const quarter = quarters[selectedQuarter as keyof typeof quarters];

    const bucketName = process.env.S3_BUCKET_NAME;
    const key = `transcripts/json/${ticker}/${selectedYear}/Q${quarter}.json`;
    console.log("key", key);
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3.send(command);

    if (!response.Body) throw new Error("File not found in S3");

    // Return the stream directly
    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
      },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response("Error occurred", { status: 500 });
  }
}

