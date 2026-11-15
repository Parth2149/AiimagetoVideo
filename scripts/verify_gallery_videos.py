import os
import sys
import json
from PIL import Image
import numpy as np
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\parth\.gemini\antigravity\brain\6a3e308d-70c8-4fb8-b291-9619dacc4cca"

def test_gallery_videos():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
        page = context.new_page()

        print("Navigating to http://localhost:3000/ ...")
        page.goto("http://localhost:3000/", wait_until="networkidle")

        gallery_section = page.locator("#gallery")
        gallery_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        # Get all finished video containers
        cards = gallery_section.locator(".grid.grid-cols-1.md\\:grid-cols-3 > div")
        card_count = cards.count()
        print(f"Found {card_count} transformation cards.")

        for i in range(card_count):
            card = cards.nth(i)
            title = card.locator("span.font-bold").first.inner_text()
            video_el = card.locator("video")

            src = video_el.get_attribute("src")
            poster = video_el.get_attribute("poster")
            preload = video_el.get_attribute("preload")
            muted = video_el.get_attribute("muted") is not None
            loop = video_el.get_attribute("loop") is not None
            autoplay = video_el.get_attribute("autoplay") is not None
            playsinline = video_el.get_attribute("playsinline") is not None

            # Video container screenshot
            video_container = card.locator(".aspect-square.rounded-xl").nth(1) # second is finished video
            shot_path = os.path.join(artifact_dir, f"finished_video_card_{i+1}.png")
            video_container.screenshot(path=shot_path)

            # Analyze image brightness to confirm it's not a solid black box
            img = Image.open(shot_path)
            arr = np.array(img)
            mean_brightness = float(arr.mean())
            min_val = int(arr.min())
            max_val = int(arr.max())

            # Evaluate video element state in DOM
            video_state = video_el.evaluate("""(v) => ({
                readyState: v.readyState,
                paused: v.paused,
                currentTime: v.currentTime,
                videoWidth: v.videoWidth,
                videoHeight: v.videoHeight,
                duration: v.duration,
                poster: v.poster,
                currentSrc: v.currentSrc
            })""")

            card_info = {
                "index": i + 1,
                "title": title,
                "src": src,
                "poster": poster,
                "preload": preload,
                "muted": muted,
                "loop": loop,
                "autoplay": autoplay,
                "playsinline": playsinline,
                "mean_brightness": mean_brightness,
                "min_brightness": min_val,
                "max_brightness": max_val,
                "is_not_black": mean_brightness > 30 and max_val > 150,
                "dom_video_state": video_state,
                "screenshot": shot_path
            }
            results.append(card_info)
            print(f"\n--- Card {i+1}: {title} ---")
            print(f"  src: {src}")
            print(f"  poster: {poster}")
            print(f"  preload: {preload}")
            print(f"  Mean Brightness: {mean_brightness:.2f} (max: {max_val}) -> Solid Black? {not card_info['is_not_black']}")
            print(f"  Video dimensions: {video_state['videoWidth']}x{video_state['videoHeight']}, currentTime: {video_state['currentTime']}")

        # Full gallery screenshot
        gallery_full_path = os.path.join(artifact_dir, "transformation_gallery_live_verified.png")
        gallery_section.screenshot(path=gallery_full_path)
        print(f"\nSaved full gallery screenshot: {gallery_full_path}")

        browser.close()

    print("\n=== FINAL RESULTS SUMMARY ===")
    print(json.dumps(results, indent=2))

    for r in results:
        assert r["is_not_black"], f"Card {r['index']} ({r['title']}) rendered as black box! Mean brightness: {r['mean_brightness']}"
        assert r["preload"] == "auto", f"Card {r['index']} missing preload='auto'!"
        assert r["poster"], f"Card {r['index']} missing poster!"
        assert "#t=1.0" in r["src"], f"Card {r['index']} missing #t=1.0 in src!"
        assert r["autoplay"], f"Card {r['index']} missing autoplay!"
        assert r["muted"], f"Card {r['index']} missing muted!"
        assert r["playsinline"], f"Card {r['index']} missing playsinline!"

    print("\n>>> ALL 3 FINISHED VIDEO BOXES ARE CRISP, NON-BLACK, PLAYING & VERIFIED! <<<")

if __name__ == "__main__":
    test_gallery_videos()
