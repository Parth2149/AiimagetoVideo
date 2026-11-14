import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';

export interface LifestyleTalentAction {
  beat_1_0_to_3s: string;
  beat_2_3_to_7s: string;
  beat_3_7_to_10s: string;
}

export interface LifestyleDirectorPlan {
  product_subject: string;
  environment: string;
  talent_and_action: LifestyleTalentAction;
  audio_direction: string;
  end_card_cta: string;
}

export const LIFESTYLE_DIRECTOR_SCHEMA = {
  type: 'OBJECT',
  properties: {
    product_subject: { type: 'STRING' },
    environment: { type: 'STRING' },
    talent_and_action: {
      type: 'OBJECT',
      properties: {
        beat_1_0_to_3s: { type: 'STRING' },
        beat_2_3_to_7s: { type: 'STRING' },
        beat_3_7_to_10s: { type: 'STRING' },
      },
      required: ['beat_1_0_to_3s', 'beat_2_3_to_7s', 'beat_3_7_to_10s'],
    },
    audio_direction: { type: 'STRING' },
    end_card_cta: { type: 'STRING' },
  },
  required: [
    'product_subject',
    'environment',
    'talent_and_action',
    'audio_direction',
    'end_card_cta',
  ],
};

export async function generateLifestyleDirectorPlan(
  photoPath: string,
  userBrief: string,
  productName: string = '',
  externalJobId?: string
): Promise<LifestyleDirectorPlan> {
  const jobId = externalJobId || crypto.randomUUID();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(`[Job ${jobId}] GEMINI_API_KEY is not configured in environment.`);
  }

  if (!fs.existsSync(photoPath)) {
    throw new Error(`[Job ${jobId}] Uploaded photo does not exist at ${photoPath}`);
  }

  // 1. Normalize ANY image in memory using Sharp into standard RGB JPEG bytes
  const rawFileBuffer = fs.readFileSync(photoPath);
  const hash = crypto.createHash('sha256').update(rawFileBuffer).digest('hex').substring(0, 16);

  const jpegBuffer = await sharp(rawFileBuffer)
    .toFormat('jpeg', { quality: 92 })
    .toBuffer();

  const imgMeta = await sharp(jpegBuffer).metadata();
  console.log(
    `[Job ${jobId}] Lifestyle Director: Image normalized: ${imgMeta.width}x${imgMeta.height}, bytes: ${jpegBuffer.length}, sha256: ${hash}, original: ${productName || photoPath}`
  );

  // 2. Strict Lifestyle Director Prompt
  const prompt = `You are an award-winning cinematic commercial film director creating a 10-second lifestyle story ad.
Analyze ONLY the attached product image.
User Creative Brief: "${userBrief || 'Produce a high-end commercial lifestyle ad for this product.'}".

Generate a natural, human-centric 10-second lifestyle video plan:
1. product_subject: Exact description of the uploaded product (shape, colors, packaging/plating, key visual details so the video model preserves it 100%).
2. environment: Authentic real-world setting suited to this specific product (e.g., sunlit wooden kitchen/cafe table for food, golden-hour highway/depot for a truck, bright vanity for skincare, modern desk for tech).
3. talent_and_action: Natural, candid human interaction in 3 beats:
   - beat_1_0_to_3s: Framing the exact product in-scene as a person enters/reaches for it.
   - beat_2_3_to_7s: Authentic, joyful use/savoring of the product (taking a bite, pouring, driving/opening cab door, applying, unboxing) while keeping the product clearly visible.
   - beat_3_7_to_10s: Genuine satisfied smile/reaction looking toward camera or product hero hold.
4. audio_direction: Warm, natural conversational voiceover script (16–22 words max) + subtle ambient room/environment sound (no loud overpowering music).
5. end_card_cta: 1 short, punchy editorial sentence (6–9 words max, matching the user's Creative Brief CTA, e.g., "Fresh. Savory. Delicious. Order Yours Today.").`;

  const payload = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: jpegBuffer.toString('base64') } },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      response_schema: LIFESTYLE_DIRECTOR_SCHEMA,
    },
  };

  const models = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-4-argon',
  ];

  let lastError: string = 'Unknown error';

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text) as LifestyleDirectorPlan;
          console.log(`[Job ${jobId}] Raw Lifestyle Plan response from ${model}:`, JSON.stringify(parsed, null, 2));

          // Validate required plan fields
          if (!parsed.product_subject || !parsed.environment || !parsed.talent_and_action || !parsed.end_card_cta) {
            throw new Error(`Incomplete LifestyleDirectorPlan received from ${model}`);
          }

          return parsed;
        }
      } else {
        const errText = await res.text();
        lastError = `Model ${model} returned HTTP ${res.status}: ${errText.substring(0, 150)}`;
        console.warn(`[Job ${jobId}] ${lastError}`);
        if (res.status === 429 || res.status === 503) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    } catch (err: any) {
      lastError = `Model ${model} error: ${err.message || String(err)}`;
      console.warn(`[Job ${jobId}] ${lastError}`);
    }
  }

  // CRITICAL: NEVER return dummy/hardcoded fallback copy. Throw clean error.
  console.error(`[Job ${jobId}] All Gemini API models failed for Lifestyle Director. Throwing strict error.`);
  throw new Error(`[Job ${jobId}] Lifestyle Vision Director failed across all models: ${lastError}`);
}

