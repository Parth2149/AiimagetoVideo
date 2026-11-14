import sys
import os
import json
import base64
import uuid
import shutil
from playwright.sync_api import sync_playwright

def validate_and_extract_blueprint(data: dict) -> dict:
    """Strictly extracts blueprint data. Throws if required dynamic fields are missing."""
    if not isinstance(data, dict):
        raise ValueError("Invalid metadata: must be a JSON object")

    palette = data.get('palette')
    copy = data.get('copy')
    callouts = data.get('callouts')

    if not palette or not copy or not callouts:
        raise ValueError("Incomplete AdBlueprint: missing required 'palette', 'copy', or 'callouts' from vision director")

    return data

def generate_style1_html(img_b64: str, bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']
    callouts_raw = bp['callouts']
    framing = bp.get('framing_mode', 'rounded_card')

    bg_primary = palette['bg_primary']
    bg_spotlight = palette['bg_spotlight']
    accent_color = palette['accent_color']
    tag_bg = palette['tag_bg']
    tag_text = palette['tag_text']
    headline_primary = palette['headline_primary']
    headline_italic_accent = palette.get('headline_italic_accent', accent_color)

    micro_header = copy['micro_header'].upper()
    hook_1 = copy['hook_line_1'].upper()
    hook_2_italic = copy['hook_line_2_italic']
    hook_3 = copy['hook_line_3'].upper()
    eyebrow = copy['section_eyebrow'].upper()
    section_title = copy['section_title']
    cta_text = copy['cta_text'].upper()
    stats = copy['summary_stats']

    # Exactly 4 callouts mapped from vision analysis
    callouts = []
    for idx in range(min(4, len(callouts_raw))):
        c = callouts_raw[idx]
        callouts.append({
            "num": c.get('num') or f"0{idx+1}",
            "title": str(c.get('title', ''))[:22],
            "subtitle": str(c.get('subtitle', ''))[:24],
            "target_xy": c.get('target_xy', [0.5, 0.5])
        })

    # Geometry Setup based on framing_mode
    cx, cy = 540, 940
    if framing == 'circular_crop':
        img_w, img_h = 640, 640
        img_left, img_top = cx - img_w // 2, cy - img_h // 2
        # Clean circular mask with soft drop shadow, NO harsh white border
        product_css = f"""
            width: {img_w}px;
            height: {img_h}px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 30px 75px rgba(0, 0, 0, 0.75);
        """
    elif framing == 'rounded_card':
        img_w, img_h = 840, 560
        img_left, img_top = cx - img_w // 2, cy - img_h // 2
        # Clean 24px rounded corners with soft shadow, NO harsh white border
        product_css = f"""
            width: {img_w}px;
            height: {img_h}px;
            border-radius: 24px;
            object-fit: cover;
            box-shadow: 0 35px 80px rgba(0, 0, 0, 0.75);
        """
    else: # clean_fit
        img_w, img_h = 920, 620
        img_left, img_top = cx - img_w // 2, cy - img_h // 2
        # Full-bleed/fit presentation, NO harsh white border
        product_css = f"""
            width: {img_w}px;
            height: {img_h}px;
            border-radius: 24px;
            object-fit: contain;
            filter: drop-shadow(0 30px 65px rgba(0, 0, 0, 0.8));
        """

    # Compute target pixels for all 4 callouts
    p_targets = []
    for c in callouts:
        t_xy = c['target_xy']
        nx = max(0.05, min(0.95, float(t_xy[0])))
        ny = max(0.05, min(0.95, float(t_xy[1])))
        px = int(img_left + nx * img_w)
        py = int(img_top + ny * img_h)
        p_targets.append((px, py))

    p1 = p_targets[0] if len(p_targets) > 0 else (cx, cy)
    p2 = p_targets[1] if len(p_targets) > 1 else (cx, cy)
    p3 = p_targets[2] if len(p_targets) > 2 else (cx, cy)
    p4 = p_targets[3] if len(p_targets) > 3 else (cx, cy)

    c1 = callouts[0] if len(callouts) > 0 else {"num": "01", "title": "", "subtitle": ""}
    c2 = callouts[1] if len(callouts) > 1 else {"num": "02", "title": "", "subtitle": ""}
    c3 = callouts[2] if len(callouts) > 2 else {"num": "03", "title": "", "subtitle": ""}
    c4 = callouts[3] if len(callouts) > 3 else {"num": "04", "title": "", "subtitle": ""}

    return f"""<!DOCTYPE html>
<html style="background-color: {bg_primary}; background: radial-gradient(circle at 50% 48%, {bg_spotlight} 0%, {bg_primary} 85%); margin: 0; padding: 0;">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap');

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  html, body {{
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background-color: {bg_primary} !important;
    background: radial-gradient(circle at 50% 48%, {bg_spotlight} 0%, {bg_primary} 85%) !important;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #FFFFFF;
    position: relative;
  }}

  /* 1.5% Subtle Editorial Film Grain Overlay */
  .film-grain {{
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 90;
    opacity: 0.16;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }}

  /* Soft Ambient Glow */
  .ambient-glow {{
    position: absolute;
    inset: -80px;
    background-image: url('data:image/jpeg;base64,{img_b64}');
    background-size: cover;
    background-position: center;
    filter: blur(140px) brightness(0.24) saturate(1.4);
    opacity: 0.65;
    z-index: 2;
  }}

  /* Editorial Corner Accent Borders */
  .corner-border {{
    position: absolute;
    width: 44px;
    height: 44px;
    border-color: rgba(255, 255, 255, 0.22);
    z-index: 10;
    pointer-events: none;
  }}
  .corner-tl {{ top: 40px; left: 40px; border-top: 1.5px solid; border-left: 1.5px solid; }}
  .corner-tr {{ top: 40px; right: 40px; border-top: 1.5px solid; border-right: 1.5px solid; }}
  .corner-bl {{ bottom: 40px; left: 40px; border-bottom: 1.5px solid; border-left: 1.5px solid; }}
  .corner-br {{ bottom: 40px; right: 40px; border-bottom: 1.5px solid; border-right: 1.5px solid; }}

  /* Top Micro-Header */
  .top-header {{
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    z-index: 25;
    text-align: center;
    padding: 0 60px;
  }}

  .micro-header-pill {{
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.24em;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 32px;
    border-radius: 9999px;
  }}

  /* Center Product Stage */
  .hero-stage {{
    position: absolute;
    top: {cy}px;
    left: {cx}px;
    transform: translate(-50%, -50%);
    z-index: 15;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: gentleBreathe 8s ease-in-out infinite alternate;
  }}

  .hero-img {{
    {product_css}
  }}

  /* SCENE 1: Explainer Callout Cards in 4 Open Quadrants */
  .callout-card {{
    position: absolute;
    z-index: 30;
    background: {tag_bg};
    color: {tag_text};
    border-radius: 20px;
    padding: 16px 22px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55);
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    width: 335px;
    opacity: 0;
    animation: cardSequence 8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .card-tl {{ top: 350px; left: 45px; }}
  .card-tr {{ top: 350px; right: 45px; }}
  .card-bl {{ top: 1250px; left: 45px; }}
  .card-br {{ top: 1250px; right: 45px; }}

  .card-num {{
    font-size: 14px;
    font-weight: 800;
    color: {accent_color};
    letter-spacing: 0.12em;
    margin-bottom: 2px;
  }}

  .card-title {{
    font-size: 24px;
    font-weight: 800;
    color: {tag_text};
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: 4px;
  }}

  .card-desc {{
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: 18px;
    color: #4A4A4A;
    line-height: 1.25;
  }}

  /* SVG Pointer Lines & Reticles Layer */
  .pointer-layer {{
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    z-index: 20;
    pointer-events: none;
    opacity: 0;
    animation: pointerSequence 8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  /* SCENE 2: Clean Editorial Feature Highlight & Summary Stats */
  .scene2-overlay {{
    position: absolute;
    inset: 0;
    z-index: 40;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 140px 70px 95px 70px;
    opacity: 0;
    animation: scene2Sequence 8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .scene2-headline-box {{
    text-align: center;
  }}

  .scene2-eyebrow {{
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.22em;
    color: {accent_color};
    text-transform: uppercase;
    margin-bottom: 12px;
  }}

  .scene2-headline {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 64px;
    font-weight: 700;
    line-height: 1.14;
    color: {headline_primary};
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
  }}

  .scene2-headline em {{
    font-style: italic;
    color: {headline_italic_accent};
    font-weight: 400;
  }}

  .scene2-footer {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }}

  .stats-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 100%;
  }}

  .stat-card {{
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 22px;
    padding: 22px 18px;
    text-align: center;
  }}

  .stat-index {{
    font-size: 13px;
    font-weight: 800;
    color: {accent_color};
    letter-spacing: 0.15em;
    margin-bottom: 6px;
    text-transform: uppercase;
  }}

  .stat-val {{
    font-size: 28px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.2;
    margin-bottom: 4px;
  }}

  .stat-sub {{
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.2;
  }}

  .cta-pill {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #FAF8F5;
    color: #12100E;
    padding: 24px 68px;
    border-radius: 9999px;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    animation: pulseCta 3s ease-in-out infinite alternate;
  }}

  /* Keyframes */
  @keyframes gentleBreathe {{
    0% {{ transform: translate(-50%, -50%) scale(0.98); }}
    100% {{ transform: translate(-50%, -50%) scale(1.02); }}
  }}

  @keyframes cardSequence {{
    0% {{ opacity: 0; transform: translateY(18px) scale(0.96); }}
    6% {{ opacity: 1; transform: translateY(0) scale(1); }}
    44% {{ opacity: 1; transform: translateY(0) scale(1); }}
    50% {{ opacity: 0; transform: translateY(-16px) scale(0.96); }}
    100% {{ opacity: 0; transform: translateY(-16px) scale(0.96); }}
  }}

  @keyframes pointerSequence {{
    0% {{ opacity: 0; }}
    8% {{ opacity: 1; }}
    44% {{ opacity: 1; }}
    50% {{ opacity: 0; }}
    100% {{ opacity: 0; }}
  }}

  @keyframes scene2Sequence {{
    0% {{ opacity: 0; transform: translateY(24px); }}
    48% {{ opacity: 0; transform: translateY(24px); }}
    56% {{ opacity: 1; transform: translateY(0); }}
    100% {{ opacity: 1; transform: translateY(0); }}
  }}

  @keyframes pulseCta {{
    0% {{ transform: scale(1); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }}
    100% {{ transform: scale(1.03); box-shadow: 0 24px 60px rgba(255,255,255,0.22); }}
  }}
</style>
</head>
<body style="background-color: {bg_primary};">
  <div class="film-grain"></div>
  <div class="ambient-glow"></div>

  <!-- Editorial Corner Accents -->
  <div class="corner-border corner-tl"></div>
  <div class="corner-border corner-tr"></div>
  <div class="corner-border corner-bl"></div>
  <div class="corner-border corner-br"></div>

  <!-- Top Micro-Header -->
  <div class="top-header">
    <div class="micro-header-pill">
      <span>{micro_header}</span>
    </div>
  </div>

  <!-- Hero Product Stage -->
  <div class="hero-stage">
    <img src="data:image/jpeg;base64,{img_b64}" class="hero-img" alt="Product Hero" />
  </div>

  <!-- SCENE 1: SVG Leader Lines & Reticles -->
  <svg class="pointer-layer" viewBox="0 0 1080 1920">
    <!-- Top-Left Card (380, 410) -> Pin 1 -->
    <polyline points="380,410 440,410 {p1[0]},{p1[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
    <circle cx="{p1[0]}" cy="{p1[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
    <circle cx="{p1[0]}" cy="{p1[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

    <!-- Top-Right Card (700, 410) -> Pin 2 -->
    <polyline points="700,410 640,410 {p2[0]},{p2[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
    <circle cx="{p2[0]}" cy="{p2[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
    <circle cx="{p2[0]}" cy="{p2[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

    <!-- Bottom-Left Card (380, 1310) -> Pin 3 -->
    <polyline points="380,1310 440,1310 {p3[0]},{p3[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
    <circle cx="{p3[0]}" cy="{p3[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
    <circle cx="{p3[0]}" cy="{p3[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

    <!-- Bottom-Right Card (700, 1310) -> Pin 4 -->
    <polyline points="700,1310 640,1310 {p4[0]},{p4[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
    <circle cx="{p4[0]}" cy="{p4[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
    <circle cx="{p4[0]}" cy="{p4[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />
  </svg>

  <!-- SCENE 1: 4 Explainer Callout Cards in 4 Open Quadrants -->
  <div class="callout-card card-tl">
    <div class="card-num">{c1['num']}</div>
    <div class="card-title">{c1['title']}</div>
    <div class="card-desc">{c1['subtitle']}</div>
  </div>

  <div class="callout-card card-tr">
    <div class="card-num">{c2['num']}</div>
    <div class="card-title">{c2['title']}</div>
    <div class="card-desc">{c2['subtitle']}</div>
  </div>

  <div class="callout-card card-bl">
    <div class="card-num">{c3['num']}</div>
    <div class="card-title">{c3['title']}</div>
    <div class="card-desc">{c3['subtitle']}</div>
  </div>

  <div class="callout-card card-br">
    <div class="card-num">{c4['num']}</div>
    <div class="card-title">{c4['title']}</div>
    <div class="card-desc">{c4['subtitle']}</div>
  </div>

  <!-- SCENE 2: Editorial Feature Headline & Summary Stats -->
  <div class="scene2-overlay">
    <div class="scene2-headline-box">
      <div class="scene2-eyebrow">{eyebrow}</div>
      <h1 class="scene2-headline">{hook_1} <em>{hook_2_italic}</em> {hook_3}</h1>
    </div>

    <div class="scene2-footer">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-index">{stats[0]['index']}</div>
          <div class="stat-val">{stats[0]['value']}</div>
          <div class="stat-sub">{stats[0]['sub']}</div>
        </div>
        <div class="stat-card">
          <div class="stat-index">{stats[1]['index']}</div>
          <div class="stat-val">{stats[1]['value']}</div>
          <div class="stat-sub">{stats[1]['sub']}</div>
        </div>
        <div class="stat-card">
          <div class="stat-index">{stats[2]['index']}</div>
          <div class="stat-val">{stats[2]['value']}</div>
          <div class="stat-sub">{stats[2]['sub']}</div>
        </div>
      </div>

      <div class="cta-pill">{cta_text} &rarr;</div>
    </div>
  </div>
</body>
</html>"""

def generate_style2_html(img_b64: str, bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']
    framing = bp.get('framing_mode', 'rounded_card')

    bg_primary = palette['bg_primary']
    bg_spotlight = palette['bg_spotlight']
    accent_color = palette['accent_color']
    headline_italic = palette.get('headline_italic_accent', accent_color)

    micro_header = copy['micro_header'].upper()
    hook_1 = copy['hook_line_1'].upper()
    hook_2_italic = copy['hook_line_2_italic']
    section_eyebrow = copy['section_eyebrow'].upper()
    section_title = copy['section_title']
    cta_text = copy['cta_text'].upper()
    stats = copy['summary_stats']
    sub_desc = f"{section_title}. {stats[0]['sub']}."

    # Adaptive framing with clean borders (no harsh white outlines)
    if framing == 'circular_crop':
        product_style = """
            width: 720px;
            height: 720px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 40px 90px rgba(0,0,0,0.85);
        """
    elif framing == 'rounded_card':
        product_style = """
            width: 880px;
            height: 580px;
            border-radius: 28px;
            object-fit: cover;
            box-shadow: 0 40px 90px rgba(0,0,0,0.85);
        """
    else: # clean_fit
        product_style = """
            width: 940px;
            height: 640px;
            border-radius: 28px;
            object-fit: contain;
            filter: drop-shadow(0 35px 75px rgba(0,0,0,0.85));
        """

    return f"""<!DOCTYPE html>
<html style="background-color: {bg_primary}; background: radial-gradient(circle at 50% 48%, {bg_spotlight} 0%, {bg_primary} 85%); margin: 0; padding: 0;">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  html, body {{
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background-color: {bg_primary} !important;
    background: radial-gradient(circle at 50% 48%, {bg_spotlight} 0%, {bg_primary} 85%) !important;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .film-grain {{
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 90;
    opacity: 0.16;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }}

  .bg-glow {{
    position: absolute;
    inset: -60px;
    background-image: url('data:image/jpeg;base64,{img_b64}');
    background-size: cover;
    background-position: center;
    filter: blur(95px) brightness(0.28) saturate(1.4);
    transform: scale(1.15);
    z-index: 1;
  }}

  .header {{
    position: relative;
    z-index: 10;
    padding: 85px 70px 0 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .brand-pill {{
    display: inline-flex;
    align-items: center;
    padding: 16px 36px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }}

  .quality-badge {{
    font-size: 21px;
    font-weight: 700;
    color: {accent_color};
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }}

  .product-stage {{
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .product-img {{
    {product_style}
    animation: slowZoom 8s cubic-bezier(0.1, 0, 0.2, 1) forwards;
  }}

  .footer-card {{
    position: relative;
    z-index: 10;
    padding: 0 70px 95px 70px;
  }}

  .text-box {{
    background: rgba(18, 22, 28, 0.82);
    backdrop-filter: blur(44px);
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 44px;
    padding: 48px 52px;
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }}

  .tagline {{
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.2em;
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

  .headline em {{
    font-family: 'Playfair Display', serif;
    font-style: italic;
    color: {headline_italic};
    font-weight: 400;
  }}

  .subheadline {{
    font-size: 26px;
    font-weight: 400;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.82);
  }}

  .cta-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }}

  .cta-btn {{
    display: inline-flex;
    align-items: center;
    gap: 16px;
    background: #FFFFFF;
    color: #0F1216;
    padding: 24px 52px;
    border-radius: 9999px;
    font-size: 28px;
    font-weight: 700;
    box-shadow: 0 12px 35px rgba(255, 255, 255, 0.25);
  }}

  .format-tag {{
    font-size: 22px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
  }}

  @keyframes slowZoom {{
    0% {{ transform: scale(0.96) rotate(-0.5deg); }}
    100% {{ transform: scale(1.06) rotate(0.5deg); }}
  }}
</style>
</head>
<body style="background-color: {bg_primary};">
  <div class="film-grain"></div>
  <div class="bg-glow"></div>

  <div class="header">
    <div class="brand-pill">{micro_header}</div>
    <div class="quality-badge">{section_eyebrow}</div>
  </div>

  <div class="product-stage">
    <img src="data:image/jpeg;base64,{img_b64}" class="product-img" alt="Product" />
  </div>

  <div class="footer-card">
    <div class="text-box">
      <div class="tagline">{section_eyebrow}</div>
      <h1 class="headline">{hook_1} <em>{hook_2_italic}</em></h1>
      <p class="subheadline">{sub_desc}</p>
      <div class="cta-row">
        <div class="cta-btn">{cta_text} &rarr;</div>
        <div class="format-tag">9:16 HD</div>
      </div>
    </div>
  </div>
</body>
</html>"""

def generate_style3_html(img_b64: str, bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']

    bg_primary = palette['bg_primary']
    micro_header = copy['micro_header'].upper()
    hook_1 = copy['hook_line_1']
    hook_2_italic = copy['hook_line_2_italic']
    section_title = copy['section_title']
    cta_text = copy['cta_text'].upper()

    return f"""<!DOCTYPE html>
<html style="background-color: {bg_primary}; margin: 0; padding: 0;">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  html, body {{
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background-color: {bg_primary} !important;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .film-grain {{
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 90;
    opacity: 0.16;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }}

  /* Full Bleed Lifestyle Hero Image with Slow Cinema Pan */
  .hero-canvas {{
    position: absolute;
    inset: -50px;
    background-image: url('data:image/jpeg;base64,{img_b64}');
    background-size: cover;
    background-position: center;
    filter: brightness(0.85) saturate(1.18);
    animation: cinemaPan 8s ease-in-out infinite alternate;
    z-index: 1;
  }}

  /* Cinematic Vignette */
  .film-grade {{
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(14,13,12,0.5) 0%, transparent 40%, rgba(14,13,12,0.7) 75%, rgba(14,13,12,0.94) 100%);
    z-index: 2;
  }}

  .header {{
    position: relative;
    z-index: 10;
    padding: 90px 70px 0 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .brand {{
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
  }}

  .content-bottom {{
    position: relative;
    z-index: 10;
    padding: 0 70px 110px 70px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }}

  .serif-title {{
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    font-weight: 600;
    line-height: 1.2;
    color: #FFFFFF;
    text-shadow: 0 4px 25px rgba(0, 0, 0, 0.65);
  }}

  .serif-title em {{
    font-style: italic;
    font-weight: 400;
  }}

  .desc {{
    font-size: 28px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.88);
    max-width: 900px;
  }}

  .cta-wrap {{
    margin-top: 10px;
  }}

  .cta-btn {{
    display: inline-flex;
    align-items: center;
    gap: 16px;
    background: #FFFFFF;
    color: #111;
    padding: 24px 54px;
    border-radius: 9999px;
    font-size: 28px;
    font-weight: 700;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
  }}

  @keyframes cinemaPan {{
    0% {{ transform: scale(1.05) translate(0, 0); }}
    100% {{ transform: scale(1.15) translate(-15px, -15px); }}
  }}
</style>
</head>
<body style="background-color: {bg_primary};">
  <div class="film-grain"></div>
  <div class="hero-canvas"></div>
  <div class="film-grade"></div>

  <div class="header">
    <div class="brand">{micro_header}</div>
    <div class="format-tag" style="font-size: 22px; color: rgba(255,255,255,0.75); font-weight: 700; letter-spacing: 0.1em;">CINEMATIC STORY</div>
  </div>

  <div class="content-bottom">
    <h1 class="serif-title">{hook_1} <em>{hook_2_italic}</em></h1>
    <p class="desc">{section_title}</p>
    <div class="cta-wrap">
      <div class="cta-btn">{cta_text} &rarr;</div>
    </div>
  </div>
</body>
</html>"""

def render_ad_video(image_path: str, metadata: dict, output_path: str, style: str = "style1_explainer", duration_sec: float = 8.0):
    abs_img_path = os.path.abspath(image_path)
    if not os.path.exists(abs_img_path):
        raise FileNotFoundError(f"Image not found at {abs_img_path}")

    with open(abs_img_path, 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')

    bp = validate_and_extract_blueprint(metadata)
    job_id = bp.get('jobId') or bp.get('job_id') or str(uuid.uuid4())

    if style == 'style1_explainer':
        html_content = generate_style1_html(img_b64, bp)
        duration_sec = 8.0
    elif style == 'style3_lifestyle':
        html_content = generate_style3_html(img_b64, bp)
        duration_sec = 7.0
    else: # style2_spotlight
        html_content = generate_style2_html(img_b64, bp)
        duration_sec = 6.0

    temp_html = os.path.abspath(f'temp_render_{job_id}.html')
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    temp_dir = os.path.abspath(f'temp_video_render_{job_id}')
    os.makedirs(temp_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            args=[
                '--disable-gpu',
                '--no-sandbox',
                '--force-dark-mode',
                '--enable-features=WebContentsForceDark:classifier/rgb_hl/method/cielab'
            ]
        )
        ctx = browser.new_context(
            viewport={'width': 1080, 'height': 1920},
            record_video_dir=temp_dir,
            record_video_size={'width': 1080, 'height': 1920}
        )
        page = ctx.new_page()
        page.goto(f'file:///{temp_html.replace(os.sep, "/")}')
        page.wait_for_timeout(int(duration_sec * 1000))
        page.close()
        ctx.close()
        recorded_path = page.video.path()
        browser.close()

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        if os.path.exists(output_path):
            os.remove(output_path)
        shutil.move(recorded_path, output_path)

    # Clean up temporary artifacts
    try:
        if os.path.exists(temp_html):
            os.remove(temp_html)
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
    except:
        pass

    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 5:
        print("Usage: python render_video_engine.py <image_path> <metadata_json_or_file> <output_path> <style>")
        sys.exit(1)

    img_path = sys.argv[1]
    meta_arg = sys.argv[2]
    out_path = sys.argv[3]
    style_arg = sys.argv[4]

    if os.path.exists(meta_arg):
        with open(meta_arg, 'r', encoding='utf-8') as f:
            meta = json.load(f)
    else:
        meta = json.loads(meta_arg)

    res = render_ad_video(img_path, meta, out_path, style=style_arg)
    print("Render complete:", res, "Size:", os.path.getsize(res))
