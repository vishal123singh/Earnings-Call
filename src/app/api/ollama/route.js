import { NextResponse } from 'next/server';
import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://192.168.29.231:11434' })

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const stream = await ollama.chat({
          model: 'llama3:8b', // Or llama2, llama3:8b, etc.
          messages: [{ role: 'user', content: prompt }],
          stream: true,
          options: {
            num_ctx: 8192, // Set context length to 8192 tokens
          }
        });

        for await (const part of stream) {
          const chunk = encoder.encode(part.message.content);
          controller.enqueue(chunk);
        }

        controller.close();
      } catch (error) {
        console.error('Error:', error);
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
    },
  });
}
