import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import util from 'node:util';
import { getOrderById, updateOrderStatus, attachVideoToOrder, failOrder, VideoStyle } from './db';
import { ensureUploadDirs, getPhotoFilePath } from './storage';
import { generateAdBlueprint, AdBlueprint } from './blueprint';
import { generateLifestyleDirectorPlan, LifestyleDirectorPlan } from './lifestyleDirector';

const execFileAsync = util.promisify(execFile);

export async function triggerAutoFulfill(orderId: string): Promise<void> {
  setTimeout(async () => {
    const jobId = `job_${orderId}_${crypto.randomBytes(4).toString('hex')}`;
    try {
      const order = getOrderById(orderId);
      if (!order) return;

      // 1. Mark as in_production
      updateOrderStatus(orderId, 'in_production');

      const photoPath = getPhotoFilePath(order.photo_filename);
      if (!photoPath || !fs.existsSync(photoPath)) {
        throw new Error(`[${jobId}] Photo file not found on disk: ${order.photo_filename}`);
      }
      const style: VideoStyle = (order.video_style as VideoStyle) || 'style1_explainer';

      console.log(`[${jobId}] Starting dynamic video pipeline for order ${orderId} (${order.photo_original_name}), style: ${style}`);

      // =========================================================================
      // OPTION 3: style3_lifestyle (Cinematic Lifestyle Story)
      // =========================================================================
      if (style === 'style3_lifestyle') {
        console.log(`[${jobId}] Generating LifestyleDirectorPlan via Gemini for ${order.photo_original_name}...`);
        const lifestylePlan: LifestyleDirectorPlan = await generateLifestyleDirectorPlan(
          photoPath,
          order.brief || 'Produce a high-end commercial lifestyle ad for this product.',
          order.photo_original_name,
          jobId
        );

        ensureUploadDirs();
        const videoFilename = `video_ad_${orderId}_${Date.now()}.mp4`;
        const targetVideoPath = path.join(process.cwd(), 'uploads', 'videos', videoFilename);

        const tempPlanPath = path.join(process.cwd(), `temp_plan_${jobId}.json`);
        fs.writeFileSync(tempPlanPath, JSON.stringify(lifestylePlan, null, 2));

        const lifestyleScript = path.join(process.cwd(), 'lifestyle_video_engine.py');
        console.log(`[${jobId}] Executing reference-anchored lifestyle video engine...`);

        try {
          await execFileAsync('python', [
            lifestyleScript,
            photoPath,
            tempPlanPath,
            targetVideoPath,
            jobId,
          ]);
        } finally {
          try {
            if (fs.existsSync(tempPlanPath)) fs.unlinkSync(tempPlanPath);
          } catch {}
        }

        if (!fs.existsSync(targetVideoPath) || fs.statSync(targetVideoPath).size < 1000) {
          throw new Error(`[${jobId}] Lifestyle video renderer failed to produce output video at ${targetVideoPath}`);
        }

        const stat = fs.statSync(targetVideoPath);
        console.log(`[${jobId}] Custom lifestyle video rendered successfully (${stat.size} bytes).`);

        const lifestyleMetadata = {
          product_category: lifestylePlan.product_subject,
          brand_name: 'CINEMATIC LIFESTYLE',
          headline: lifestylePlan.end_card_cta,
          subheadline: lifestylePlan.environment,
          cta: lifestylePlan.end_card_cta,
          lifestyle_plan: lifestylePlan,
          copy: {
            micro_header: 'CINEMATIC LIFESTYLE STORY',
            hook_line_1: lifestylePlan.end_card_cta,
            hook_line_2_italic: '',
            hook_line_3: '',
            section_eyebrow: 'SCENE SETTING',
            section_title: lifestylePlan.environment,
            cta_text: lifestylePlan.end_card_cta,
            summary_stats: [
              { index: '01', value: '10s', sub: 'Duration' },
              { index: '02', value: '9:16', sub: 'Aspect Ratio' },
              { index: '03', value: '4K/HD', sub: 'Native Audio' },
            ],
          },
          palette: {
            bg_primary: '#141210',
            bg_spotlight: '#261F1A',
            accent_color: '#E5A93C',
            tag_bg: '#2A241F',
            tag_text: '#FFFDF8',
            headline_primary: '#FFFFFF',
            headline_italic_accent: '#E5A93C',
          },
        };

        attachVideoToOrder(orderId, {
          videoFilename,
          videoOriginalName: `${order.photo_original_name.split('.')[0]}_lifestyle_ad.mp4`,
          videoMimeType: 'video/mp4',
          videoSize: stat.size,
          adMetadata: lifestyleMetadata,
        });

        console.log(`[${jobId}] Order ${orderId} successfully fulfilled in style ${style}.`);
        return;
      }

      // =========================================================================
      // STYLES 1 & 2: Explainer & Spotlight
      // =========================================================================
      // 2. Generate strict AdBlueprint via Gemini API Structured Outputs (NEVER returns dummy/hardcoded fallbacks)
      const blueprint: AdBlueprint = await generateAdBlueprint(
        photoPath,
        order.brief || 'Produce a high-end commercial ad for this product.',
        style,
        order.photo_original_name,
        jobId
      );

      console.log(`[${jobId}] AdBlueprint generated: category="${blueprint.product_category}", framing="${blueprint.framing_mode}", accent="${blueprint.palette.accent_color}"`);

      ensureUploadDirs();

      const videoFilename = `video_ad_${orderId}_${Date.now()}.mp4`;
      const targetVideoPath = path.join(process.cwd(), 'uploads', 'videos', videoFilename);

      // 3. Render real custom video ad from the uploaded product photo using our multi-style renderer
      const tempMetaPath = path.join(process.cwd(), `temp_meta_${jobId}.json`);
      fs.writeFileSync(tempMetaPath, JSON.stringify({ ...blueprint, jobId }, null, 2));

      const renderScript = path.join(process.cwd(), 'render_video_engine.py');
      console.log(`[${jobId}] Rendering custom video ad in style: ${style}...`);

      try {
        await execFileAsync('python', [
          renderScript,
          photoPath,
          tempMetaPath,
          targetVideoPath,
          style,
        ]);
      } finally {
        try {
          if (fs.existsSync(tempMetaPath)) fs.unlinkSync(tempMetaPath);
        } catch {}
      }

      if (!fs.existsSync(targetVideoPath) || fs.statSync(targetVideoPath).size < 1000) {
        throw new Error(`[${jobId}] Video renderer failed to produce output video at ${targetVideoPath}`);
      }

      const stat = fs.statSync(targetVideoPath);
      console.log(`[${jobId}] Custom video rendered successfully (${stat.size} bytes).`);

      attachVideoToOrder(orderId, {
        videoFilename,
        videoOriginalName: `${order.photo_original_name.split('.')[0]}_${style}_ad.mp4`,
        videoMimeType: 'video/mp4',
        videoSize: stat.size,
        adMetadata: blueprint,
      });

      console.log(`[${jobId}] Order ${orderId} successfully fulfilled in style ${style}.`);
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.error(`[${jobId}] Error fulfilling order ${orderId}:`, errMsg);
      failOrder(orderId, errMsg);
    }
  }, 100);
}
