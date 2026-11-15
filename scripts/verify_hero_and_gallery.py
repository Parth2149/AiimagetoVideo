import os
import time
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\parth\.gemini\antigravity\brain\6a3e308d-70c8-4fb8-b291-9619dacc4cca"

def test_videos():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
        page = context.new_page()

        print("Navigating to http://localhost:3000/ ...")
        page.goto("http://localhost:3000/", wait_until="networkidle")

        # 1. Test Hero Video Player
        hero_player = page.locator("video").first
        hero_src = hero_player.get_attribute("src")
        print(f"Hero player initial src: {hero_src}")

        # Wait 1.5s for playback
        page.wait_for_timeout(1500)
        time_1 = hero_player.evaluate("v => v.currentTime")
        is_paused_1 = hero_player.evaluate("v => v.paused")
        print(f"Hero player after 1.5s: currentTime={time_1:.2f}s, paused={is_paused_1}")

        # Screenshot hero player
        hero_shot = os.path.join(artifact_dir, "hero_player_playback_live.png")
        page.locator(".max-w-4xl.mx-auto.rounded-3xl").first.screenshot(path=hero_shot)
        print(f"Hero player screenshot saved: {hero_shot}")

        # Switch to Style 2
        style2_tab = page.locator("span.font-bold").filter(has_text="2. Agency Spotlight").first
        style2_tab.click()
        page.wait_for_timeout(1500)
        hero2_src = page.locator("video").first.get_attribute("src")
        time_2 = page.locator("video").first.evaluate("v => v.currentTime")
        print(f"Hero Style 2: src={hero2_src}, currentTime={time_2:.2f}s")

        # Switch to Style 3
        style3_tab = page.locator("span.font-bold").filter(has_text="3. Cinematic Lifestyle Story").first
        style3_tab.click()
        page.wait_for_timeout(1500)
        hero3_src = page.locator("video").first.get_attribute("src")
        time_3 = page.locator("video").first.evaluate("v => v.currentTime")
        print(f"Hero Style 3: src={hero3_src}, currentTime={time_3:.2f}s")

        # 2. Test Transformation Gallery
        gallery_section = page.locator("#gallery")
        gallery_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        gallery_videos = gallery_section.locator("video")
        count = gallery_videos.count()
        print(f"\nGallery video count: {count}")
        for i in range(count):
            gv = gallery_videos.nth(i)
            src = gv.get_attribute("src")
            poster = gv.get_attribute("poster")
            print(f"Card {i+1}: src={src}, poster={poster}")

        gallery_shot = os.path.join(artifact_dir, "gallery_playback_live.png")
        gallery_section.screenshot(path=gallery_shot)
        print(f"Gallery screenshot saved: {gallery_shot}")

        browser.close()

if __name__ == "__main__":
    test_videos()
