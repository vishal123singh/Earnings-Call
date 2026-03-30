import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Create an instance of OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // Parse the form data from the request
    const formData = await req.formData();

    // Get the uploaded audio file
    const audioFile = formData.get("audio");

    if (!audioFile || !audioFile.name) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Create a buffer from the file
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Check if running on Vercel or locally
    const isVercel = process.env.VERCEL || process.env.NOW_REGION;
    const tempDir = isVercel ? "/tmp" : path.join(process.cwd(), "temp");

    // Create temp directory locally if it doesn't exist
    if (!isVercel && !fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Create temp file path
    const tempFilePath = path.join(tempDir, audioFile.name);

    // Save the audio file temporarily
    fs.writeFileSync(tempFilePath, audioBuffer);

    // Call Whisper API to transcribe the audio
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(tempFilePath), // Read the file as a stream
      language: "en", // Change if needed
    });

    // Delete the temp file after transcription
    fs.unlinkSync(tempFilePath);

    // Return the transcribed text
    return NextResponse.json({ text: response.text }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
