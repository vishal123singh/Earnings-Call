// src/app/api/generate-speech/route.js
import { NextResponse } from 'next/server';

// POST handler for generating speech
export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // Use 'tts-1-hd' for higher quality
        input: text,
        voice: 'alloy', // Other options: alloy, nova, onyx, shimmer
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(Buffer.from(audioBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
