import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';

export interface AdBlueprintPalette {
  bg_primary: string;
  bg_spotlight: string;
  accent_color: string;
  tag_bg: string;
  tag_text: string;
  headline_primary: string;
  headline_italic_accent: string;
}

export interface AdBlueprintStat {
  index: string;
  value: string;
  sub: string;
}

export interface AdBlueprintCopy {
  micro_header: string;
  hook_line_1: string;
  hook_line_2_italic: string;
  hook_line_3: string;
  section_eyebrow: string;
  section_title: string;
  cta_text: string;
  summary_stats: AdBlueprintStat[];
}

export interface AdBlueprintCallout {
  num: string;
  title: string;
  subtitle: string;
  target_xy: [number, number];
  preferred_quadrant: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'bottom_center';
}

export interface AdBlueprint {
  product_category: string;
  framing_mode: 'circular_crop' | 'rounded_card' | 'clean_fit';
  palette: AdBlueprintPalette;
  copy: AdBlueprintCopy;
  callouts: AdBlueprintCallout[];
}

export const AD_BLUEPRINT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    product_category: { type: 'STRING' },
    framing_mode: {
      type: 'STRING',
      enum: ['circular_crop', 'rounded_card', 'clean_fit'],
    },
    palette: {
      type: 'OBJECT',
      properties: {
        bg_primary: { type: 'STRING' },
        bg_spotlight: { type: 'STRING' },
        accent_color: { type: 'STRING' },
        tag_bg: { type: 'STRING' },
        tag_text: { type: 'STRING' },
        headline_primary: { type: 'STRING' },
        headline_italic_accent: { type: 'STRING' },
      },
      required: [
        'bg_primary',
        'bg_spotlight',
        'accent_color',
        'tag_bg',
        'tag_text',
        'headline_primary',
        'headline_italic_accent',
      ],
    },
    copy: {
      type: 'OBJECT',
      properties: {
        micro_header: { type: 'STRING' },
        hook_line_1: { type: 'STRING' },
        hook_line_2_italic: { type: 'STRING' },
        hook_line_3: { type: 'STRING' },
        section_eyebrow: { type: 'STRING' },
        section_title: { type: 'STRING' },
        cta_text: { type: 'STRING' },
        summary_stats: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              index: { type: 'STRING' },
              value: { type: 'STRING' },
              sub: { type: 'STRING' },
            },
            required: ['index', 'value', 'sub'],
          },
        },
      },
      required: [
        'micro_header',
        'hook_line_1',
        'hook_line_2_italic',
        'hook_line_3',
        'section_eyebrow',
        'section_title',
        'cta_text',
        'summary_stats',
      ],
    },
    callouts: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          num: { type: 'STRING' },
          title: { type: 'STRING' },
          subtitle: { type: 'STRING' },
          target_xy: {
            type: 'ARRAY',
            items: { type: 'NUMBER' },
          },
          preferred_quadrant: {
            type: 'STRING',
            enum: ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'bottom_center'],
          },
        },
        required: ['num', 'title', 'subtitle', 'target_xy', 'preferred_quadrant'],
      },
    },
  },
  required: ['product_category', 'framing_mode', 'palette', 'copy', 'callouts'],
};

export async function generateAdBlueprint(
  photoPath: string,
  userBrief: string,
  style: string,
  productName: string = '',
  externalJobId?: string
): Promise<AdBlueprint> {
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
    `[Job ${jobId}] Image normalized: ${imgMeta.width}x${imgMeta.height}, bytes: ${jpegBuffer.length}, sha256: ${hash}, original: ${productName || photoPath}`
  );

  // 2. Domain-agnostic strict system prompt (no dosa/salad/food examples!)
  const prompt = `You are an elite commercial creative director at a high-end design agency.
Analyze ONLY the attached image.
Identify the exact subject, its visible parts/ingredients/features, and its natural color mood. Never invent items not visible in the photo.
Selected video style: ${style}.
Customer creative brief: "${userBrief || 'Produce a high-end commercial ad for this product.'}".

CRITICAL INSTRUCTIONS:
1. framing_mode:
   - "circular_crop": ONLY if the photo depicts a top-down round plate or bowl where a circular mask looks natural.
   - "rounded_card": If the item is rectangular, commercial, a vehicle, electronics, packaging, or an angled food/table presentation.
   - "clean_fit": Full-width product showcase with soft edge vignettes.
2. palette:
   - Extract rich, cohesive colors matching the exact item and mood:
     * bg_primary: Dark atmospheric grounding background hex directly derived from the image mood.
     * bg_spotlight: Subtle center radial illumination hex.
     * accent_color: Vibrant signature highlight hex from the product.
     * tag_bg: Tactile card background hex.
     * tag_text: High contrast readable text hex.
     * headline_primary: Primary title color hex.
     * headline_italic_accent: Accent color hex for italicized words.
3. copy:
   - micro_header: 2-4 uppercase tracked words separated by bullet (e.g., matching the product's true nature).
   - hook_line_1: 1-3 punchy uppercase words.
   - hook_line_2_italic: 1-3 lowercase or mixed italic words.
   - hook_line_3: 1-3 uppercase words.
   - section_eyebrow: Category or craftsmanship indicator.
   - section_title: 2-4 word evocative title.
   - cta_text: 2-4 word action matching the customer brief.
   - summary_stats: exactly 3 items with { "index": "01 / ...", "value": "...", "sub": "..." }.
4. callouts:
   - exactly 4 visible features directly observed in this image.
   - title: max 22 chars.
   - subtitle: max 24 chars.
   - target_xy: [x, y] normalized 0.0 to 1.0 relative to original image dimensions pointing directly at that visible feature.
   - preferred_quadrant: distinct quadrants ("top_left", "top_right", "bottom_left", "bottom_right").`;

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
      response_schema: AD_BLUEPRINT_SCHEMA,
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
        signal: AbortSignal.timeout(20000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text) as AdBlueprint;
          console.log(`[Job ${jobId}] Raw Gemini JSON response from ${model}:`, JSON.stringify(parsed, null, 2));

          // Validate required callout count and geometry
          if (!parsed.callouts || parsed.callouts.length < 4) {
            throw new Error(`Gemini response contains fewer than 4 callouts (${parsed.callouts?.length || 0})`);
          }

          return parsed;
        }
      } else {
        const errText = await res.text();
        lastError = `Model ${model} returned HTTP ${res.status}: ${errText.substring(0, 150)}`;
        console.warn(`[Job ${jobId}] ${lastError}`);
        if (res.status === 429 || res.status === 503) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    } catch (err: any) {
      lastError = `Model ${model} error: ${err.message || String(err)}`;
      console.warn(`[Job ${jobId}] ${lastError}`);
    }
  }

  // CRITICAL: NEVER return dummy/hardcoded fallback copy. Throw clean error.
  console.error(`[Job ${jobId}] All Gemini API models failed. Throwing strict error.`);
  throw new Error(`[Job ${jobId}] Gemini Vision Analysis failed across all models: ${lastError}`);
}
