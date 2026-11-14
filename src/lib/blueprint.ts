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
  image_index: number;
  target_xy: [number, number];
  preferred_quadrant?: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'bottom_center';
}

export interface AdPhotoAnalysis {
  image_index: number;
  angle_type: 'top_down' | 'side_angle' | 'closeup_detail' | 'full_scene' | 'lifestyle';
  framing_mode: 'circular_crop' | 'rounded_card' | 'clean_fit';
  scene_caption: string;
}

export interface AdSceneMapping {
  hook: { image_index: number; caption?: string };
  detail_callouts: { image_index: number; caption?: string };
  highlight_stats: { image_index: number; caption?: string };
  cta_outro: { image_index: number; caption?: string };
}

export interface AdBlueprint {
  product_category: string;
  framing_mode: 'circular_crop' | 'rounded_card' | 'clean_fit';
  palette: AdBlueprintPalette;
  photo_analysis: AdPhotoAnalysis[];
  scenes: AdSceneMapping;
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
    photo_analysis: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          image_index: { type: 'INTEGER' },
          angle_type: {
            type: 'STRING',
            enum: ['top_down', 'side_angle', 'closeup_detail', 'full_scene', 'lifestyle'],
          },
          framing_mode: {
            type: 'STRING',
            enum: ['circular_crop', 'rounded_card', 'clean_fit'],
          },
          scene_caption: { type: 'STRING' },
        },
        required: ['image_index', 'angle_type', 'framing_mode', 'scene_caption'],
      },
    },
    scenes: {
      type: 'OBJECT',
      properties: {
        hook: {
          type: 'OBJECT',
          properties: {
            image_index: { type: 'INTEGER' },
            caption: { type: 'STRING' },
          },
          required: ['image_index'],
        },
        detail_callouts: {
          type: 'OBJECT',
          properties: {
            image_index: { type: 'INTEGER' },
            caption: { type: 'STRING' },
          },
          required: ['image_index'],
        },
        highlight_stats: {
          type: 'OBJECT',
          properties: {
            image_index: { type: 'INTEGER' },
            caption: { type: 'STRING' },
          },
          required: ['image_index'],
        },
        cta_outro: {
          type: 'OBJECT',
          properties: {
            image_index: { type: 'INTEGER' },
            caption: { type: 'STRING' },
          },
          required: ['image_index'],
        },
      },
      required: ['hook', 'detail_callouts', 'highlight_stats', 'cta_outro'],
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
          image_index: { type: 'INTEGER' },
          target_xy: {
            type: 'ARRAY',
            items: { type: 'NUMBER' },
          },
          preferred_quadrant: {
            type: 'STRING',
            enum: ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'bottom_center'],
          },
        },
        required: ['num', 'title', 'subtitle', 'image_index', 'target_xy'],
      },
    },
  },
  required: ['product_category', 'framing_mode', 'palette', 'photo_analysis', 'scenes', 'copy', 'callouts'],
};

export async function generateAdBlueprint(
  photoPaths: string | string[],
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

  const paths = Array.isArray(photoPaths) ? photoPaths : [photoPaths];
  if (paths.length === 0) {
    throw new Error(`[Job ${jobId}] No product photos provided for vision analysis.`);
  }

  // 1. Normalize all N images in memory using Sharp into standard RGB JPEG buffers (max 1024px for rapid vision analysis)
  const photoBuffers: Buffer[] = [];
  for (let idx = 0; idx < paths.length; idx++) {
    const p = paths[idx];
    if (!fs.existsSync(p)) {
      throw new Error(`[Job ${jobId}] Uploaded photo does not exist at ${p}`);
    }
    const rawBuffer = fs.readFileSync(p);
    const jpegBuffer = await sharp(rawBuffer)
      .rotate()
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg', { quality: 88 })
      .toBuffer();
    photoBuffers.push(jpegBuffer);
  }

  const N = photoBuffers.length;
  console.log(`[Job ${jobId}] Vision Director: Processing ${N} uploaded product photo(s)...`);

  // Construct labeled parts: Image 0 (Hero):, [img0], Image 1:, [img1]...
  const parts: any[] = [];
  for (let i = 0; i < N; i++) {
    parts.push({
      text: i === 0 ? 'Image 0 (Hero):' : `Image ${i}:`,
    });
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: photoBuffers[i].toString('base64'),
      },
    });
  }

  // 2. Domain-agnostic strict system prompt for multi-angle director
  const prompt = `You are an elite commercial creative director at a high-end design agency.
You have been provided ${N} photo(s) of the SAME product from different angles, views, or details.
Prefix labels correspond to:
${Array.from({ length: N }, (_, i) => (i === 0 ? '- Image 0 (Hero): Primary showcase angle' : `- Image ${i}: Additional angle / detail shot`)).join('\n')}

Analyze ALL ${N} attached image(s).
Identify the exact subject, its visible features across all angles, and its natural color mood. Never invent items not visible in the photos.
Selected video style: ${style}.
Customer creative brief: "${userBrief || 'Produce a high-end commercial ad for this product.'}".

CRITICAL INSTRUCTIONS:
1. photo_analysis:
   - Provide an array of exactly ${N} objects, one for each uploaded photo in index order (0 to ${N - 1}):
     * image_index: 0 to ${N - 1}
     * angle_type: "top_down" | "side_angle" | "closeup_detail" | "full_scene" | "lifestyle"
     * framing_mode: "circular_crop" (only if round bowl/plate) | "rounded_card" (card/angled) | "clean_fit" (wide/full-bleed)
     * scene_caption: short 2-4 word punchy caption describing what is shown in this angle.
2. framing_mode:
   - The overall default framing mode for the ad: "circular_crop" | "rounded_card" | "clean_fit".
3. scenes:
   - Map the 4 ad scenes across the video to the best image_index (0 to ${N - 1}):
     * hook: Opening hook scene (usually image_index: 0 or best hero angle).
     * detail_callouts: Deconstruct & feature scene (choose the best angle showing key details).
     * highlight_stats: Value stats scene.
     * cta_outro: Final brand call to action scene.
     * If N == 1, set image_index: 0 for all 4 scenes.
     * If N >= 2, showcase all angles across the scenes (e.g. rotate through 0..${N - 1}) so every uploaded photo appears in the ad!
4. palette:
   - Extract cohesive hex colors matching the true product & mood:
     * bg_primary: Dark atmospheric grounding background hex directly derived from the image mood.
     * bg_spotlight: Subtle center radial illumination hex.
     * accent_color: Vibrant signature highlight hex from the product.
     * tag_bg: Tactile card background hex.
     * tag_text: High contrast readable text hex.
     * headline_primary: Primary title color hex.
     * headline_italic_accent: Accent color hex for italicized words.
5. copy:
   - micro_header: 2-4 uppercase tracked words separated by bullet (e.g., matching the product's true nature).
   - hook_line_1: 1-3 punchy uppercase words.
   - hook_line_2_italic: 1-3 lowercase or mixed italic words.
   - hook_line_3: 1-3 uppercase words.
   - section_eyebrow: Category or craftsmanship indicator.
   - section_title: 2-4 word evocative title.
   - cta_text: 2-4 word action matching the customer brief.
   - summary_stats: exactly 3 items with { "index": "01", "value": "...", "sub": "..." }.
6. callouts:
   - 4 to 5 visible features observed directly in the photos.
   - For EACH callout, specify 'image_index' (0 to ${N - 1}) indicating which photo that feature is visible in.
   - target_xy: [x, y] normalized 0.0 to 1.0 relative to that specific photo's dimensions, pointing accurately to that visible feature.
   - preferred_quadrant: distinct quadrants ("top_left", "top_right", "bottom_left", "bottom_right", "bottom_center").`;

  parts.push({ text: prompt });

  const payload = {
    contents: [{ parts }],
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
        signal: AbortSignal.timeout(45000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text) as AdBlueprint;
          console.log(`[Job ${jobId}] Raw Gemini JSON response from ${model}:`, JSON.stringify(parsed, null, 2));

          // Validate required callout count
          if (!parsed.callouts || parsed.callouts.length < 4) {
            throw new Error(`Gemini response contains fewer than 4 callouts (${parsed.callouts?.length || 0})`);
          }

          // Ensure photo_analysis and scenes are populated
          if (!parsed.photo_analysis || parsed.photo_analysis.length === 0) {
            parsed.photo_analysis = Array.from({ length: N }, (_, i) => ({
              image_index: i,
              angle_type: i === 0 ? 'top_down' : 'side_angle',
              framing_mode: parsed.framing_mode || 'rounded_card',
              scene_caption: `Angle ${i + 1}`,
            }));
          }

          if (!parsed.scenes) {
            parsed.scenes = {
              hook: { image_index: 0 },
              detail_callouts: { image_index: Math.min(1, N - 1) },
              highlight_stats: { image_index: Math.min(2, N - 1) },
              cta_outro: { image_index: 0 },
            };
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
