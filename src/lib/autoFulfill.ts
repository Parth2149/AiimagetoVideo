import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import util from 'node:util';
import { getOrderById, getOrderPhotos, updateOrderStatus, attachVideoToOrder, failOrder, VideoStyle } from './db';
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

      const photoRecords = getOrderPhotos(order);
      const photoPaths = photoRecords
        .map((p) => getPhotoFilePath(p.filename))
        .filter((p): p is string => Boolean(p && fs.existsSync(p)));

      if (photoPaths.length === 0) {
        throw new Error(`[${jobId}] No valid photo files found on disk for order ${orderId}`);
      }

      const style: VideoStyle = (order.video_style as VideoStyle) || 'style1_explainer';

      console.log(
        `[${jobId}] Starting multi-angle video pipeline for order ${orderId} (${photoPaths.length} photo(s)), style: ${style}`
      );

      // =========================================================================
      // OPTION 3: style3_lifestyle (Cinematic Lifestyle Story)
      // =========================================================================
      if (style === 'style3_lifestyle') {
        console.log(`[${jobId}] Generating LifestyleDirectorPlan via Gemini for ${order.photo_original_name}...`);
        const lifestylePlan: LifestyleDirectorPlan = await generateLifestyleDirectorPlan(
          photoPaths,
          order.brief || 'Produce a high-end commercial lifestyle ad for this product.',
          order.photo_original_name,
          jobId
        );

        // If user customized CTA, strictly override end_card_cta
        if (order.cta_text) {
          lifestylePlan.end_card_cta = order.cta_text;
        }

        ensureUploadDirs();
        const videoFilename = `video_ad_${orderId}_${Date.now()}.mp4`;
        const targetVideoPath = path.join(process.cwd(), 'uploads', 'videos', videoFilename);

        const tempPlanPath = path.join(process.cwd(), `temp_plan_${jobId}.json`);
        fs.writeFileSync(
          tempPlanPath,
          JSON.stringify({ ...lifestylePlan, photo_paths: photoPaths, jobId }, null, 2)
        );

        const lifestyleScript = path.join(process.cwd(), 'lifestyle_video_engine.py');
        console.log(`[${jobId}] Executing reference-anchored lifestyle video engine with ${photoPaths.length} photo(s)...`);

        try {
          await execFileAsync('python', [
            lifestyleScript,
            photoPaths[0],
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
              { index: '01', value: `${photoPaths.length} Angle${photoPaths.length > 1 ? 's' : ''}`, sub: 'Multi-Perspective' },
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
      // STYLES 1 & 2: Explainer & Spotlight (Multi-Angle)
      // =========================================================================
      const blueprint: AdBlueprint = await generateAdBlueprint(
        photoPaths,
        order.brief || 'Produce a high-end commercial ad for this product.',
        style,
        order.photo_original_name,
        jobId
      );

      // If user customized CTA, strictly override blueprint copy
      if (order.cta_text) {
        if (blueprint.copy) {
          blueprint.copy.cta_text = order.cta_text;
        }
        (blueprint as any).cta = order.cta_text;
      }

      console.log(
        `[${jobId}] AdBlueprint generated: category="${blueprint.product_category}", framing="${blueprint.framing_mode}", accent="${blueprint.palette.accent_color}", angles=${blueprint.photo_analysis?.length || 1}`
      );

      ensureUploadDirs();

      const videoFilename = `video_ad_${orderId}_${Date.now()}.mp4`;
      const targetVideoPath = path.join(process.cwd(), 'uploads', 'videos', videoFilename);

      // 3. Render real custom video ad from the uploaded product photos using our multi-style renderer
      const tempMetaPath = path.join(process.cwd(), `temp_meta_${jobId}.json`);
      fs.writeFileSync(
        tempMetaPath,
        JSON.stringify({ ...blueprint, photo_paths: photoPaths, jobId }, null, 2)
      );

      const renderScript = path.join(process.cwd(), 'render_video_engine.py');
      console.log(`[${jobId}] Rendering multi-angle video ad in style: ${style}...`);

      try {
        await execFileAsync('python', [
          renderScript,
          photoPaths[0],
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
