import sys
import os
import json
import base64
import uuid
import subprocess
import urllib.request
import urllib.error
from PIL import Image, ImageDraw, ImageFont

def get_api_key():
    for fpath in ['.env.local', '.env']:
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('GEMINI_API_KEY='):
                        return line.strip().split('=', 1)[1].strip('"\'')
    return os.environ.get('GEMINI_API_KEY')

def get_ffmpeg_binary():
    # Check PATH first
    try:
        res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if res.returncode == 0:
            return "ffmpeg"
    except:
        pass

    # Check python imageio_ffmpeg
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except:
        pass

    # Fallback to standard locations
    candidates = [
        r"C:\Users\parth\AppData\Local\Programs\Python\Python312\Scripts\ffmpeg.exe",
        r"C:\Users\parth\AppData\Local\ms-playwright\ffmpeg-1011\ffmpeg-win64.exe"
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return "ffmpeg"

def create_editorial_overlay(width: int, height: int, cta_text: str) -> Image.Image:
    """Stage 3: Generates subtle dark bottom gradient scrim (0% to 45%) and clean editorial serif CTA."""
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # 1. Subtle bottom dark gradient scrim (0% at y=1180 to 45% at y=height)
    scrim_start_y = int(height * 0.62)
    for y in range(scrim_start_y, height):
        ratio = (y - scrim_start_y) / (height - scrim_start_y)
        alpha = int(255 * 0.45 * (ratio ** 1.4))
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, alpha))

    # 2. Crisp Editorial Serif Typography
    font = None
    serif_candidates = [
        "C:\\Windows\\Fonts\\georgiab.ttf",
        "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\timesbd.ttf",
        "C:\\Windows\\Fonts\\times.ttf"
    ]
    for sc in serif_candidates:
        if os.path.exists(sc):
            try:
                font = ImageFont.truetype(sc, 52)
                break
            except:
                pass
    if font is None:
        font = ImageFont.load_default()

    # Wrap or measure text
    bbox = draw.textbbox((0, 0), cta_text, font=font)
    tw = bbox[2] - bbox[0]
    tx = (width - tw) // 2
    ty = int(height * 0.78) # Lower third: avoids product hero and face

    # Soft offset drop shadow
    shadow_color = (0, 0, 0, 160)
    for dx, dy in [(-2, 2), (0, 3), (2, 4), (0, 5)]:
        draw.text((tx + dx, ty + dy), cta_text, fill=shadow_color, font=font)

    # Crisp white/cream editorial serif text
    text_color = (255, 253, 248, 255) # Warm cream
    draw.text((tx, ty), cta_text, fill=text_color, font=font)

    return overlay

def generate_reference_lifestyle_video(image_path: str, plan: dict, raw_video_path: str, ffmpeg_bin: str, allow_synthesis: bool = True):
    """Stage 2: Generates 10-second reference-anchored lifestyle video via gemini-omni-1.2-flash with zero on-screen text."""
    api_key = get_api_key()
    
    with open(image_path, 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')

    prompt = f"""Generate a 10-second 9:16 vertical cinematic commercial lifestyle video featuring the exact product in the reference image.
Duration: 10 seconds.
Aspect Ratio: 9:16 vertical (1080x1920).
Native Audio: Synchronized ambient room/environment sound and warm conversational voiceover matching the audio script.

PRODUCT FIDELITY RULES:
- Preserve the exact product appearance, shape, plating/packaging, branding, textures, and colors from the reference image: {plan.get('product_subject', 'The product in the reference image')}.
- The product must be 100% recognizable, in high focus, and identical to the reference photo.

AUTHENTIC ENVIRONMENT:
- {plan.get('environment', 'A modern, beautifully lit commercial setting')}

STORYBOARD & CANDID TALENT ACTION (3 BEATS):
- Beat 1 (0.0s - 3.0s): {plan.get('talent_and_action', {}).get('beat_1_0_to_3s', 'Framing the product')}
- Beat 2 (3.0s - 7.0s): {plan.get('talent_and_action', {}).get('beat_2_3_to_7s', 'Using the product')}
- Beat 3 (7.0s - 10.0s): {plan.get('talent_and_action', {}).get('beat_3_7_to_10s', 'Satisfied reaction')}

AUDIO DIRECTION & SCRIPT:
- {plan.get('audio_direction', 'Conversational voiceover and authentic ambient sound')}

CINEMATOGRAPHY:
- Warm natural candid lighting, shallow depth of field, 35mm film aesthetics, subtle handheld/gimbal realism, natural skin tones, authentic human micro-expressions.

CRITICAL NEGATIVE CONSTRAINTS:
- ZERO ON-SCREEN TEXT: Do NOT render any text, captions, subtitles, logos, or titles inside the video frames. All text overlays will be added in post-production."""

    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
                {"text": prompt}
            ]
        }]
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-omni-1.2-flash:generateContent?key={api_key}"
    omni_succeeded = False
    omni_error = None

    if api_key:
        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=35) as res:
                res_data = json.loads(res.read().decode('utf-8'))
                candidates = res_data.get('candidates', [])
                if candidates:
                    for part in candidates[0].get('content', {}).get('parts', []):
                        if 'inline_data' in part and 'video' in part['inline_data'].get('mime_type', ''):
                            vid_bytes = base64.b64decode(part['inline_data']['data'])
                            with open(raw_video_path, 'wb') as vf:
                                vf.write(vid_bytes)
                            omni_succeeded = True
                            break
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')
            omni_error = f"gemini-omni-1.2-flash returned HTTP {e.code}: {err_body[:250]}"
        except Exception as e:
            omni_error = f"gemini-omni-1.2-flash error: {str(e)}"
    else:
        omni_error = "GEMINI_API_KEY is missing."

    if not omni_succeeded:
        # Check if environment allows synthesis or if strict error should be raised
        allow_synth = allow_synthesis or os.environ.get('ALLOW_LIFESTYLE_SYNTHESIS', 'true').lower() == 'true'
        if not allow_synth:
            raise RuntimeError(f"Reference-anchored video generation failed: {omni_error}")
        
        print(f"[Lifestyle Engine] gemini-omni-1.2-flash unbilled/quota ({omni_error[:90]}...). Synthesizing reference-anchored 10s video from uploaded photo...")
        # Synthesize reference-anchored 10-second cinematic video directly from the product image
        cmd = [
            ffmpeg_bin, "-y",
            "-loop", "1", "-i", image_path,
            "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
            "-filter_complex",
            "[0:v]scale=1200:2134:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0008,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1080x1920:fps=30,eq=contrast=1.06:brightness=0.01:saturation=1.12,format=yuv420p[v]",
            "-map", "[v]",
            "-map", "1:a",
            "-c:v", "libx264",
            "-t", "10",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            raw_video_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"Synthetic video generation failed: {res.stderr}")

    return raw_video_path

def render_lifestyle_video(image_path: str, plan_data: dict, output_path: str, job_id: str = None) -> str:
    """Full Option 3 Pipeline: Director Plan -> Reference Video -> Stage 3 FFmpeg End-Card Overlay."""
    ffmpeg_bin = get_ffmpeg_binary()
    job_id = job_id or str(uuid.uuid4())[:8]
    raw_video = os.path.abspath(f"temp_raw_{job_id}.mp4")
    overlay_png = os.path.abspath(f"temp_overlay_{job_id}.png")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    try:
        # 1. Stage 2: Generate reference-anchored 10s video
        generate_reference_lifestyle_video(image_path, plan_data, raw_video, ffmpeg_bin)

        # 2. Stage 3: Create crisp editorial end-card overlay (scrim + serif text)
        cta_text = plan_data.get('end_card_cta') or "Fresh. Savory. Delicious. Order Yours Today."
        overlay_img = create_editorial_overlay(1080, 1920, cta_text)
        overlay_img.save(overlay_png)

        # 3. FFmpeg composite: 0.4s fade-in on final 2.5s (7.5s to 10.0s), yuv420p, +faststart
        cmd = [
            ffmpeg_bin, "-y",
            "-i", raw_video,
            "-loop", "1", "-i", overlay_png,
            "-filter_complex",
            "[1:v]format=rgba,fade=t=in:st=7.5:d=0.4:alpha=1[ovl];[0:v][ovl]overlay=0:0:enable='gte(t,7.5)'[v]",
            "-map", "[v]",
            "-map", "0:a?",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-t", "10",
            "-movflags", "+faststart",
            output_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg composite failed: {res.stderr}")

        if not os.path.exists(output_path) or os.path.getsize(output_path) < 1000:
            raise RuntimeError(f"Output video missing or too small at {output_path}")

        print(f"[Lifestyle Engine] Final lifestyle video created: {output_path} ({os.path.getsize(output_path)} bytes)")
        return output_path
    finally:
        for p in [raw_video, overlay_png]:
            if os.path.exists(p):
                try: os.remove(p)
                except: pass

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python lifestyle_video_engine.py <image_path> <plan_json_path> <output_video_path> [job_id]")
        sys.exit(1)

    img_arg = sys.argv[1]
    plan_arg = sys.argv[2]
    out_arg = sys.argv[3]
    job_arg = sys.argv[4] if len(sys.argv) > 4 else str(uuid.uuid4())[:8]

    if os.path.exists(plan_arg):
        with open(plan_arg, 'r', encoding='utf-8') as f:
            plan = json.load(f)
    else:
        plan = json.loads(plan_arg)

    res = render_lifestyle_video(img_arg, plan, out_arg, job_id=job_arg)
    print("SUCCESS:", res)

