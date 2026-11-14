import sys
import os
import json
import base64
from playwright.sync_api import sync_playwright

def render_ad_video(image_path: str, metadata: dict, output_path: str, duration_sec: float = 6.0):
    abs_img_path = os.path.abspath(image_path)
    if not os.path.exists(abs_img_path):
        raise FileNotFoundError(f"Image not found at {abs_img_path}")

    # Read image as base64 for reliable standalone embedding in the browser
    with open(abs_img_path, 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')

    brand_name = metadata.get('brand_name', 'STUDIO SELECT').upper()
    badge_tag = metadata.get('badge_tag', 'FRESH DAILY').upper()
    headline = metadata.get('headline', 'Crafted for perfection.')
    subheadline = metadata.get('subheadline', 'Handcrafted with natural ingredients.')
    cta = metadata.get('cta', 'Order Today')
    accent_color = metadata.get('accent_color', '#F59E0B')

    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Instrument+Serif:italic&display=swap');
  
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  
  body {{
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background: #0C0F12;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* Ambient Blurred Atmosphere */
  .bg-glow {{
    position: absolute;
    inset: -50px;
    background-image: url('data:image/jpeg;base64,{img_b64}');
    background-size: cover;
    background-position: center;
    filter: blur(80px) brightness(0.35) saturate(1.4);
    transform: scale(1.15);
    z-index: 1;
  }}

  .vignette {{
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 35%, rgba(10, 12, 16, 0.85) 100%);
    z-index: 2;
  }}

  /* Top Navigation Bar */
  .header {{
    position: relative;
    z-index: 10;
    padding: 80px 70px 0 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeInDown 1s ease-out forwards;
  }}

  .brand-pill {{
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }}

  .quality-badge {{
    font-size: 22px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }}

  /* Main Hero Product Stage */
  .product-stage {{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    width: 820px;
    height: 820px;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .product-glow {{
    position: absolute;
    width: 720px;
    height: 720px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 70%);
    filter: blur(40px);
    animation: pulseGlow 4s infinite alternate ease-in-out;
  }}

  .product-img {{
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 40px 60px rgba(0, 0, 0, 0.65));
    animation: cinematicZoom 6s cubic-bezier(0.1, 0, 0.2, 1) forwards;
  }}

  /* Bottom Editorial Text Card */
  .footer-card {{
    position: relative;
    z-index: 10;
    padding: 0 70px 100px 70px;
    animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .text-box {{
    background: rgba(18, 22, 28, 0.72);
    backdrop-filter: blur(36px);
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 44px;
    padding: 50px 54px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }}

  .tagline {{
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: {accent_color};
  }}

  .headline {{
    font-size: 56px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #FFFFFF;
  }}

  .subheadline {{
    font-size: 30px;
    font-weight: 400;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.82);
  }}

  .cta-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }}

  .cta-btn {{
    display: inline-flex;
    align-items: center;
    gap: 16px;
    background: #FFFFFF;
    color: #0F1216;
    padding: 24px 50px;
    border-radius: 9999px;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.01em;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.25);
  }}

  .format-tag {{
    font-size: 24px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.1em;
  }}

  /* Keyframe Animations */
  @keyframes cinematicZoom {{
    0% {{ transform: scale(0.92) rotate(-1.5deg); }}
    100% {{ transform: scale(1.08) rotate(1deg); }}
  }}

  @keyframes pulseGlow {{
    0% {{ opacity: 0.6; transform: scale(0.95); }}
    100% {{ opacity: 0.95; transform: scale(1.08); }}
  }}

  @keyframes fadeInDown {{
    from {{ opacity: 0; transform: translateY(-40px); }}
    to {{ opacity: 1; transform: translateY(0); }}
  }}

  @keyframes fadeInUp {{
    from {{ opacity: 0; transform: translateY(50px); }}
    to {{ opacity: 1; transform: translateY(0); }}
  }}
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="vignette"></div>

  <div class="header">
    <div class="brand-pill">{brand_name}</div>
    <div class="quality-badge">{badge_tag}</div>
  </div>

  <div class="product-stage">
    <div class="product-glow"></div>
    <img src="data:image/jpeg;base64,{img_b64}" class="product-img" alt="Product" />
  </div>

  <div class="footer-card">
    <div class="text-box">
      <div class="tagline">{badge_tag}</div>
      <h1 class="headline">{headline}</h1>
      <p class="subheadline">{subheadline}</p>
      <div class="cta-row">
        <div class="cta-btn">{cta} &rarr;</div>
        <div class="format-tag">9:16 HD</div>
      </div>
    </div>
  </div>
</body>
</html>
"""

    temp_html = os.path.abspath('temp_render.html')
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    temp_dir = os.path.abspath('temp_video_render')
    os.makedirs(temp_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            args=['--disable-gpu', '--no-sandbox']
        )
        ctx = browser.new_context(
            viewport={'width': 1080, 'height': 1920},
            record_video_dir=temp_dir,
            record_video_size={'width': 1080, 'height': 1920}
        )
        page = ctx.new_page()
        page.goto(f'file:///{temp_html.replace("\\", "/")}')
        
        # Wait for the animation to run its course
        page.wait_for_timeout(int(duration_sec * 1000))
        
        page.close()
        ctx.close()
        recorded_path = page.video.path()
        browser.close()

        # Copy the recorded video to the target output path
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        if os.path.exists(output_path):
            os.remove(output_path)
        os.rename(recorded_path, output_path)

    try:
        if os.path.exists(temp_html):
            os.remove(temp_html)
    except:
        pass

    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python render_ad_video.py <image_path> <metadata_json_path_or_str> <output_path>")
        sys.exit(1)

    img_path = sys.argv[1]
    meta_arg = sys.argv[2]
    out_path = sys.argv[3]

    if os.path.exists(meta_arg):
        with open(meta_arg, 'r', encoding='utf-8') as f:
            meta = json.load(f)
    else:
        meta = json.loads(meta_arg)

    res = render_ad_video(img_path, meta, out_path)
    print("Render complete:", res, "Size:", os.path.getsize(res))

