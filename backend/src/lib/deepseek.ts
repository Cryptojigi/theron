import OpenAI from 'openai';
import { config } from '../config';

// Lazy singleton — never constructed unless a real API key exists.
// This prevents the OpenAI client from crashing the whole backend
// when DEEPSEEK_API_KEY is empty (local/test runs without LLM).
let _client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!config.deepSeekApiKey) return null;
  if (!_client) {
    _client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: config.deepSeekApiKey,
    });
  }
  return _client;
}

export async function generateNarrative(
  actionType: string,
  details: string
): Promise<string> {
  const client = getClient();
  if (!client) return 'AI summary disabled (no API key).';

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are Theron, an autonomous AI fund manager running on BOT Chain. Summarize your recent decision in 1-2 sharp, professional sentences. Sound decisive. Do not use filler.',
        },
        { role: 'user', content: `Action: ${actionType}\nDetails: ${details}` },
      ],
    });
    return response.choices[0].message.content || '';
  } catch (e: any) {
    console.error('DeepSeek API Error:', e.message);
    return 'AI summary generation failed.';
  }
}
