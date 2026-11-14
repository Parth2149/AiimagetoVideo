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

def get_framing_css_and_coords(idx: int, bp: dict):
    photo_analysis = bp.get('photo_analysis', [])
    if idx < len(photo_analysis):
        framing = photo_analysis[idx].get('framing_mode', bp.get('framing_mode', 'rounded_card'))
    else:
        framing = bp.get('framing_mode', 'rounded_card')

    cx, cy = 540, 940
    if framing == 'circular_crop':
        w, h = 660, 660
        css = f"width: {w}px; height: {h}px; border-radius: 50%; object-fit: cover; box-shadow: 0 35px 85px rgba(0,0,0,0.85);"
    elif framing == 'rounded_card':
        w, h = 860, 580
        css = f"width: {w}px; height: {h}px; border-radius: 28px; object-fit: cover; box-shadow: 0 35px 85px rgba(0,0,0,0.85);"
    else: # clean_fit
        w, h = 920, 620
        css = f"width: {w}px; height: {h}px; border-radius: 28px; object-fit: contain; filter: drop-shadow(0 30px 65px rgba(0,0,0,0.85));"

    left = cx - w // 2
    top = cy - h // 2
    return w, h, left, top, css, framing

def generate_style1_html(images_b64: list[str], bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']
    callouts_raw = bp['callouts']
    N = len(images_b64)

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

    scenes = bp.get('scenes', {})
    hook_idx = scenes.get('hook', {}).get('image_index', 0) % N
    callouts_idx = scenes.get('detail_callouts', {}).get('image_index', min(1, N - 1)) % N
    stats_idx = scenes.get('highlight_stats', {}).get('image_index', min(2, N - 1)) % N
    cta_idx = scenes.get('cta_outro', {}).get('image_index', 0) % N

    w_callouts, h_callouts, left_callouts, top_callouts, css_callouts, _ = get_framing_css_and_coords(callouts_idx, bp)
    _, _, _, _, css_hook, _ = get_framing_css_and_coords(hook_idx, bp)
    _, _, _, _, css_stats, _ = get_framing_css_and_coords(stats_idx, bp)
    _, _, _, _, css_cta, _ = get_framing_css_and_coords(cta_idx, bp)

    # Callouts setup (4 items)
    callouts = []
    for idx in range(min(4, len(callouts_raw))):
        c = callouts_raw[idx]
        callouts.append({
            "num": c.get('num') or f"0{idx+1}",
            "title": str(c.get('title', ''))[:22],
            "subtitle": str(c.get('subtitle', ''))[:24],
            "target_xy": c.get('target_xy', [0.5, 0.5])
        })

    # Calculate pin coordinates on the callout scene image
    p_targets = []
    for c in callouts:
        t_xy = c['target_xy']
        nx = max(0.08, min(0.92, float(t_xy[0])))
        ny = max(0.08, min(0.92, float(t_xy[1])))
        px = int(left_callouts + nx * w_callouts)
        py = int(top_callouts + ny * h_callouts)
        p_targets.append((px, py))

    p1 = p_targets[0] if len(p_targets) > 0 else (540, 940)
    p2 = p_targets[1] if len(p_targets) > 1 else (540, 940)
    p3 = p_targets[2] if len(p_targets) > 2 else (540, 940)
    p4 = p_targets[3] if len(p_targets) > 3 else (540, 940)

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

  /* Film Grain Overlay */
  .film-grain {{
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 90;
    opacity: 0.16;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }}

  /* Ambient Glow */
  .ambient-glow {{
    position: absolute;
    inset: -80px;
    background-size: cover;
    background-position: center;
    filter: blur(140px) brightness(0.24) saturate(1.4);
    opacity: 0.65;
    z-index: 2;
    transition: opacity 0.5s ease;
  }}

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

  /* Corner Accents */
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

  /* ========================================================================= */
  /* SCENE 1: HOOK (0.0s - 2.2s) - Frame 00:00 rendered immediately at opacity: 1 */
  /* ========================================================================= */
  .scene-hook {{
    position: absolute;
    inset: 0;
    z-index: 15;
    opacity: 1;
    animation: hookSequence 8.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .hook-stage {{
    position: absolute;
    top: 940px;
    left: 540px;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .hook-img {{
    {css_hook}
    animation: hookZoom 2.2s cubic-bezier(0.1, 0, 0.2, 1) forwards;
  }}

  .hook-title-box {{
    position: absolute;
    top: 220px;
    left: 60px;
    right: 60px;
    text-align: center;
  }}

  .hook-eyebrow {{
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: {accent_color};
    text-transform: uppercase;
    margin-bottom: 14px;
  }}

  .hook-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 66px;
    font-weight: 700;
    line-height: 1.12;
    color: {headline_primary};
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
  }}

  .hook-title em {{
    font-style: italic;
    color: {headline_italic_accent};
    font-weight: 400;
  }}

  /* ========================================================================= */
  /* SCENE 2: DETAIL CALLOUTS (2.2s - 5.2s) - Cross-dissolve into Angle 2 */
  /* ========================================================================= */
  .scene-callouts {{
    position: absolute;
    inset: 0;
    z-index: 20;
    opacity: 0;
    animation: calloutsSequence 8.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .callouts-stage {{
    position: absolute;
    top: 940px;
    left: 540px;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .callouts-img {{
    {css_callouts}
  }}

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

  .pointer-layer {{
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    z-index: 25;
    pointer-events: none;
  }}

  /* ========================================================================= */
  /* SCENE 3: HIGHLIGHT STATS (5.2s - 7.0s) - Cross-dissolve into Angle 3 */
  /* ========================================================================= */
  .scene-stats {{
    position: absolute;
    inset: 0;
    z-index: 35;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 140px 70px 95px 70px;
    animation: statsSequence 8.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .stats-stage {{
    position: absolute;
    top: 940px;
    left: 540px;
    transform: translate(-50%, -50%);
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .stats-img {{
    {css_stats}
  }}

  .stats-headline-box {{
    position: relative;
    z-index: 10;
    text-align: center;
  }}

  .stats-eyebrow {{
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.22em;
    color: {accent_color};
    text-transform: uppercase;
    margin-bottom: 12px;
  }}

  .stats-headline {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 62px;
    font-weight: 700;
    line-height: 1.14;
    color: {headline_primary};
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
  }}

  .stats-headline em {{
    font-style: italic;
    color: {headline_italic_accent};
    font-weight: 400;
  }}

  .stats-footer {{
    position: relative;
    z-index: 10;
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

  /* ========================================================================= */
  /* SCENE 4: CTA OUTRO (7.0s - 8.5s) */
  /* ========================================================================= */
  .scene-cta {{
    position: absolute;
    inset: 0;
    z-index: 45;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0 70px 105px 70px;
    animation: ctaSequence 8.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .cta-stage {{
    position: absolute;
    top: 860px;
    left: 540px;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .cta-img {{
    {css_cta}
  }}

  .cta-pill {{
    position: relative;
    z-index: 10;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #FAF8F5;
    color: #12100E;
    padding: 24px 72px;
    border-radius: 9999px;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    animation: pulseCta 2.5s ease-in-out infinite alternate;
  }}

  /* Animations Timeline: 8.5s total */
  @keyframes hookSequence {{
    0% {{ opacity: 1; transform: scale(1.0); }}
    22% {{ opacity: 1; transform: scale(1.02); }}
    26% {{ opacity: 0; transform: scale(1.03); }}
    100% {{ opacity: 0; }}
  }}

  @keyframes hookZoom {{
    0% {{ transform: scale(0.97); }}
    100% {{ transform: scale(1.03); }}
  }}

  @keyframes calloutsSequence {{
    0% {{ opacity: 0; transform: scale(0.98); }}
    24% {{ opacity: 0; transform: scale(0.98); }}
    28% {{ opacity: 1; transform: scale(1.0); }}
    58% {{ opacity: 1; transform: scale(1.02); }}
    62% {{ opacity: 0; transform: scale(1.03); }}
    100% {{ opacity: 0; }}
  }}

  @keyframes statsSequence {{
    0% {{ opacity: 0; transform: scale(0.98); }}
    60% {{ opacity: 0; transform: scale(0.98); }}
    64% {{ opacity: 1; transform: scale(1.0); }}
    80% {{ opacity: 1; transform: scale(1.02); }}
    84% {{ opacity: 0; transform: scale(1.03); }}
    100% {{ opacity: 0; }}
  }}

  @keyframes ctaSequence {{
    0% {{ opacity: 0; transform: translateY(20px); }}
    82% {{ opacity: 0; transform: translateY(20px); }}
    86% {{ opacity: 1; transform: translateY(0); }}
    100% {{ opacity: 1; transform: translateY(0); }}
  }}

  @keyframes pulseCta {{
    0% {{ transform: scale(1); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }}
    100% {{ transform: scale(1.04); box-shadow: 0 24px 60px rgba(255,255,255,0.25); }}
  }}
</style>
</head>
<body style="background-color: {bg_primary};">
  <div class="film-grain"></div>
  <div class="ambient-glow" style="background-image: url('data:image/jpeg;base64,{images_b64[hook_idx]}');"></div>

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

  <!-- SCENE 1: HOOK (0.0s - 2.2s) -->
  <div class="scene-hook">
    <div class="hook-title-box">
      <div class="hook-eyebrow">{eyebrow}</div>
      <h1 class="hook-title">{hook_1} <em>{hook_2_italic}</em> {hook_3}</h1>
    </div>
    <div class="hook-stage">
      <img src="data:image/jpeg;base64,{images_b64[hook_idx]}" class="hook-img" alt="Hero Angle" />
    </div>
  </div>

  <!-- SCENE 2: DETAIL CALLOUTS (2.2s - 5.2s) -->
  <div class="scene-callouts">
    <div class="callouts-stage">
      <img src="data:image/jpeg;base64,{images_b64[callouts_idx]}" class="callouts-img" alt="Detail Angle" />
    </div>

    <!-- SVG Pointer Lines & Reticles -->
    <svg class="pointer-layer" viewBox="0 0 1080 1920">
      <!-- TL Pin -->
      <polyline points="380,410 440,410 {p1[0]},{p1[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
      <circle cx="{p1[0]}" cy="{p1[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="{p1[0]}" cy="{p1[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

      <!-- TR Pin -->
      <polyline points="700,410 640,410 {p2[0]},{p2[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
      <circle cx="{p2[0]}" cy="{p2[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="{p2[0]}" cy="{p2[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

      <!-- BL Pin -->
      <polyline points="380,1310 440,1310 {p3[0]},{p3[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
      <circle cx="{p3[0]}" cy="{p3[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="{p3[0]}" cy="{p3[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />

      <!-- BR Pin -->
      <polyline points="700,1310 640,1310 {p4[0]},{p4[1]}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-dasharray="6,4" />
      <circle cx="{p4[0]}" cy="{p4[1]}" r="7.5" fill="{accent_color}" stroke="#FFFFFF" stroke-width="2.5" />
      <circle cx="{p4[0]}" cy="{p4[1]}" r="17" fill="none" stroke="{accent_color}" stroke-width="1.5" opacity="0.8" />
    </svg>

    <!-- 4 Callout Cards -->
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
  </div>

  <!-- SCENE 3: HIGHLIGHT STATS (5.2s - 7.0s) -->
  <div class="scene-stats">
    <div class="stats-headline-box">
      <div class="stats-eyebrow">{eyebrow}</div>
      <h1 class="stats-headline">{hook_1} <em>{hook_2_italic}</em></h1>
    </div>

    <div class="stats-stage">
      <img src="data:image/jpeg;base64,{images_b64[stats_idx]}" class="stats-img" alt="Stats Angle" />
    </div>

    <div class="stats-footer">
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
    </div>
  </div>

  <!-- SCENE 4: CTA OUTRO (7.0s - 8.5s) -->
  <div class="scene-cta">
    <div class="cta-stage">
      <img src="data:image/jpeg;base64,{images_b64[cta_idx]}" class="cta-img" alt="Outro Angle" />
    </div>
    <div class="cta-pill">{cta_text} &rarr;</div>
  </div>
</body>
</html>"""

def generate_style2_html(images_b64: list[str], bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']
    N = len(images_b64)

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

    # Rhythmic beat cuts across available angles
    angle_0 = images_b64[0]
    angle_1 = images_b64[1 % N]
    angle_2 = images_b64[2 % N] if N >= 3 else images_b64[0]

    _, _, _, _, css_0, _ = get_framing_css_and_coords(0, bp)
    _, _, _, _, css_1, _ = get_framing_css_and_coords(1 % N, bp)
    _, _, _, _, css_2, _ = get_framing_css_and_coords(2 % N if N >= 3 else 0, bp)

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

  .angle-layer {{
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }}

  .angle-0 {{
    opacity: 1;
    animation: angle0Sequence 6.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .angle-1 {{
    opacity: 0;
    animation: angle1Sequence 6.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }}

  .angle-2 {{
    opacity: 0;
    animation: angle2Sequence 6.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
    animation: cardReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

  @keyframes angle0Sequence {{
    0% {{ opacity: 1; transform: scale(0.96) rotate(-0.3deg); }}
    32% {{ opacity: 1; transform: scale(1.02) rotate(0deg); }}
    36% {{ opacity: {0 if N > 1 else 1}; transform: scale(1.03); }}
    100% {{ opacity: {0 if N > 1 else 1}; }}
  }}

  @keyframes angle1Sequence {{
    0% {{ opacity: 0; transform: scale(0.96); }}
    34% {{ opacity: 0; transform: scale(0.96); }}
    38% {{ opacity: 1; transform: scale(1.0); }}
    66% {{ opacity: 1; transform: scale(1.03); }}
    70% {{ opacity: {0 if N >= 3 else 1}; transform: scale(1.04); }}
    100% {{ opacity: {0 if N >= 3 else 1}; }}
  }}

  @keyframes angle2Sequence {{
    0% {{ opacity: 0; transform: scale(0.96); }}
    68% {{ opacity: 0; transform: scale(0.96); }}
    72% {{ opacity: 1; transform: scale(1.0); }}
    100% {{ opacity: 1; transform: scale(1.04); }}
  }}

  @keyframes cardReveal {{
    0% {{ opacity: 0; transform: translateY(30px); }}
    100% {{ opacity: 1; transform: translateY(0); }}
  }}
</style>
</head>
<body style="background-color: {bg_primary};">
  <div class="film-grain"></div>
  <div class="bg-glow" style="background-image: url('data:image/jpeg;base64,{angle_0}');"></div>

  <div class="header">
    <div class="brand-pill">{micro_header}</div>
    <div class="quality-badge">{section_eyebrow}</div>
  </div>

  <div class="product-stage">
    <div class="angle-layer angle-0">
      <img src="data:image/jpeg;base64,{angle_0}" style="{css_0}" alt="Product Angle 1" />
    </div>
    {f'''<div class="angle-layer angle-1">
      <img src="data:image/jpeg;base64,{angle_1}" style="{css_1}" alt="Product Angle 2" />
    </div>''' if N > 1 else ''}
    {f'''<div class="angle-layer angle-2">
      <img src="data:image/jpeg;base64,{angle_2}" style="{css_2}" alt="Product Angle 3" />
    </div>''' if N >= 3 else ''}
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

def generate_style3_html(images_b64: list[str], bp: dict) -> str:
    palette = bp['palette']
    copy = bp['copy']
    N = len(images_b64)

    bg_primary = palette['bg_primary']
    bg_spotlight = palette['bg_spotlight']
    accent_color = palette['accent_color']

    micro_header = copy['micro_header'].upper()
    hook_1 = copy['hook_line_1'].upper()
    hook_2_italic = copy['hook_line_2_italic']
    section_title = copy['section_title']
    cta_text = copy['cta_text'].upper()

    hero_b64 = images_b64[0]

    return f"""<!DOCTYPE html>
<html style="background-color: {bg_primary}; margin: 0; padding: 0;">
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

  .hero-canvas {{
    position: absolute;
    inset: 0;
    background-image: url('data:image/jpeg;base64,{hero_b64}');
    background-size: cover;
    background-position: center;
    transform: scale(1.05);
    animation: cinemaPan 8s ease-out forwards;
    z-index: 1;
  }}

  .film-grade {{
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(12,14,18,0.5) 0%, transparent 40%, rgba(10,12,16,0.85) 100%);
    z-index: 2;
  }}

  .header {{
    position: relative;
    z-index: 10;
    padding: 85px 70px 0 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .brand {{
    font-size: 24px;
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

def get_ffmpeg_binary():
    import subprocess
    try:
        res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if res.returncode == 0:
            return "ffmpeg"
    except:
        pass
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except:
        pass
    candidates = [
        r"C:\Users\parth\AppData\Local\Programs\Python\Python312\Scripts\ffmpeg.exe",
        r"C:\Users\parth\AppData\Local\ms-playwright\ffmpeg-1011\ffmpeg-win64.exe"
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return "ffmpeg"

def render_ad_video(image_path: str, metadata: dict, output_path: str, style: str = "style1_explainer", duration_sec: float = 8.5):
    bp = validate_and_extract_blueprint(metadata)
    job_id = bp.get('jobId') or bp.get('job_id') or str(uuid.uuid4())

    candidate_paths = bp.get('photo_paths') or [image_path]
    if isinstance(candidate_paths, str):
        candidate_paths = [candidate_paths]

    images_b64 = []
    for p in candidate_paths:
        abs_p = os.path.abspath(p)
        if os.path.exists(abs_p):
            with open(abs_p, 'rb') as f:
                images_b64.append(base64.b64encode(f.read()).decode('utf-8'))

    if not images_b64:
        abs_img_path = os.path.abspath(image_path)
        if not os.path.exists(abs_img_path):
            raise FileNotFoundError(f"Image not found at {abs_img_path}")
        with open(abs_img_path, 'rb') as f:
            images_b64.append(base64.b64encode(f.read()).decode('utf-8'))

    print(f"[{job_id}] Rendering ad video with {len(images_b64)} photo angle(s) in style: {style}")

    if style == 'style1_explainer':
        html_content = generate_style1_html(images_b64, bp)
        duration_sec = 8.5
    elif style == 'style3_lifestyle':
        html_content = generate_style3_html(images_b64, bp)
        duration_sec = 7.0
    else: # style2_spotlight
        html_content = generate_style2_html(images_b64, bp)
        duration_sec = 6.5

    temp_html = os.path.abspath(f'temp_render_{job_id}.html')
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    temp_dir = os.path.abspath(f'temp_video_render_{job_id}')
    os.makedirs(temp_dir, exist_ok=True)

    launch_args = [
        '--disable-gpu',
        '--no-sandbox',
        '--force-dark-mode',
        '--enable-features=WebContentsForceDark:classifier/rgb_hl/method/cielab'
    ]
    launch_kwargs = {'args': launch_args}
    chrome_win = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
    if os.path.exists(chrome_win):
        launch_kwargs['executable_path'] = chrome_win

    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_kwargs)
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

        # Transcode Playwright WebM to standard H.264 MP4 with faststart for universal playback
        ffmpeg_bin = get_ffmpeg_binary()
        transcode_ok = False
        try:
            import subprocess
            cmd = [
                ffmpeg_bin, '-y',
                '-i', recorded_path,
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-g', '30',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                output_path
            ]
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                transcode_ok = True
        except Exception as e:
            print(f"[{job_id}] FFmpeg transcode warning: {e}")

        if not transcode_ok:
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
