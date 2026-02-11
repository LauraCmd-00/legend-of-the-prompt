import { env } from '../../config/env';

interface GrokImageResponse {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

export async function generateSceneImage(prompt: string): Promise<string | null> {
  if (!env.XAI_API_KEY) return null;

  try {
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.XAI_IMAGE_MODEL,
        prompt: `${prompt}. SFW, suitable for all ages.`,
        n: 1,
      }),
    });

    if (!response.ok) {
      console.error(`[grok-image] Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: GrokImageResponse = await response.json();
    return data.data?.[0]?.url || null;
  } catch (error) {
    console.error('[grok-image] Failed to generate image:', error);
    return null;
  }
}
