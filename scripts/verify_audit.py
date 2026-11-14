import json
import os
import sys
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\parth\.gemini\antigravity\brain\6a3e308d-70c8-4fb8-b291-9619dacc4cca"

def run_audit():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800}, device_scale_factor=2)
        page = context.new_page()

        print("=== 1. Checking Home Page (/) ===")
        page.goto("http://localhost:3000/", wait_until="networkidle")

        # 1a. Hero Player Video
        hero_video = page.locator("video").first
        hero_src = hero_video.get_attribute("src")
        hero_poster = hero_video.get_attribute("poster")
        hero_preload = hero_video.get_attribute("preload")
        print(f"Hero video: src={hero_src}, poster={hero_poster}, preload={hero_preload}")
        results["hero_player"] = {
            "src": hero_src,
            "poster": hero_poster,
            "preload": hero_preload,
            "has_poster": bool(hero_poster),
        }

        # 1b. Transformation Gallery
        gallery_section = page.locator("#gallery")
        gallery_section.scroll_into_view_if_needed()
        page.wait_for_timeout(500)

        gallery_videos = gallery_section.locator("video")
        v_count = gallery_videos.count()
        print(f"Gallery video count: {v_count}")
        results["gallery_videos"] = []
        for i in range(v_count):
            v = gallery_videos.nth(i)
            src = v.get_attribute("src")
            poster = v.get_attribute("poster")
            autoplay = v.get_attribute("autoplay") is not None
            loop = v.get_attribute("loop") is not None
            muted = v.get_attribute("muted") is not None
            print(f"  Card {i+1}: src={src}, poster={poster}, autoplay={autoplay}")
            results["gallery_videos"].append({
                "src": src,
                "poster": poster,
                "autoplay": autoplay,
                "loop": loop,
                "muted": muted
            })

        gallery_shot = os.path.join(artifact_dir, "audit_transformation_gallery.png")
        gallery_box = gallery_section.bounding_box()
        if gallery_box:
            page.screenshot(path=gallery_shot, clip=gallery_box)
            print(f"Saved gallery screenshot: {gallery_shot}")

        # 1c. Scroll-mt checks
        styles_section = page.locator("#styles")
        styles_classes = styles_section.get_attribute("class") or ""
        has_scroll_mt_styles = "scroll-mt-" in styles_classes
        print(f"Styles section scroll-mt: {has_scroll_mt_styles} ({styles_classes})")
        results["styles_scroll_mt"] = has_scroll_mt_styles

        # 1d. Brand check in Home comparison table
        home_text = page.locator("section").filter(has_text="Value Comparison").inner_text()
        home_has_videlto = "Videlto" in home_text and "Videlto Motion Studio" not in home_text
        print(f"Home comparison table clean Videlto: {home_has_videlto}")
        results["home_comparison_videlto"] = home_has_videlto

        print("\n=== 2. Checking Admin Page (/admin) ===")
        page.goto("http://localhost:3000/admin", wait_until="networkidle")
        pwd_input = page.locator("#adminPassword")
        placeholder = pwd_input.get_attribute("placeholder") or ""
        print(f"Admin password placeholder: '{placeholder}'")
        results["admin_placeholder"] = placeholder
        results["admin_clean_security"] = ("studio2026" not in placeholder) and ("default:" not in placeholder)

        admin_shot = os.path.join(artifact_dir, "audit_admin_login_clean.png")
        page.screenshot(path=admin_shot)
        print(f"Saved admin screenshot: {admin_shot}")

        print("\n=== 3. Checking About Page (/about) ===")
        page.goto("http://localhost:3000/about", wait_until="networkidle")
        about_text = page.inner_text("body")
        about_has_motion_studio = "Motion Studio" in about_text
        print(f"About page has 'Motion Studio': {about_has_motion_studio}")
        results["about_no_motion_studio"] = not about_has_motion_studio

        code_coords = page.locator("code").filter(has_text="[x, y]").count()
        print(f"About page code elements with [x, y]: {code_coords}")
        results["about_styled_coords"] = code_coords > 0

        print("\n=== 4. Checking Header & Footer Branding ===")
        header_text = page.locator("header").inner_text()
        has_correct_subtitle = "Commercial Video Ad Studio" in header_text
        print(f"Header has 'Commercial Video Ad Studio': {has_correct_subtitle}")
        results["header_subtitle_correct"] = has_correct_subtitle

        footer_text = page.locator("footer").inner_text()
        footer_clean_about = "About Videlto" in footer_text and "About Videlto & Motion Studio" not in footer_text
        footer_clean_copy = "© 2026 Videlto. All rights reserved." in footer_text and "(Motion Studio)" not in footer_text
        print(f"Footer clean 'About Videlto': {footer_clean_about}")
        print(f"Footer clean copyright: {footer_clean_copy}")
        results["footer_about_videlto"] = footer_clean_about
        results["footer_copyright"] = footer_clean_copy

        print("\n=== 5. Checking 16:9 Empty State (/create) ===")
        page.goto("http://localhost:3000/create", wait_until="networkidle")

        landscape_btn = page.get_by_role("button", name="16:9 Landscape")
        landscape_btn.click()
        page.wait_for_timeout(400)

        mockup_frame = page.locator(".aspect-\\[16\\/9\\]").first
        mockup_shot = os.path.join(artifact_dir, "audit_empty_16_9_perfect.png")
        mockup_frame.screenshot(path=mockup_shot)
        print(f"Saved 16:9 mockup screenshot: {mockup_shot}")

        # In mockup frame, find empty subtitle and bottom card
        empty_title = mockup_frame.locator("text=Upload your product photo(s) to preview your ad")
        empty_subtitle = mockup_frame.locator("text=Accepts 1 to 5 product angles")
        title_vis = empty_title.is_visible()
        sub_vis = empty_subtitle.is_visible()

        title_box = empty_title.bounding_box()
        sub_box = empty_subtitle.bounding_box()

        bottom_card = mockup_frame.locator("div.bg-gradient-to-t")
        bottom_box = bottom_card.bounding_box()

        gap = None
        if bottom_box and sub_box:
            gap = bottom_box["y"] - (sub_box["y"] + sub_box["height"])

        print(f"16:9 Empty title visible: {title_vis}, y={title_box['y'] if title_box else None}")
        print(f"16:9 Empty subtitle visible: {sub_vis}, y={sub_box['y'] if sub_box else None}")
        print(f"16:9 Bottom card y={bottom_box['y'] if bottom_box else None}")
        print(f"Vertical gap between second line and bottom card: {gap}px")
        results["empty_state_16_9"] = {
            "title_visible": title_vis,
            "subtitle_visible": sub_vis,
            "gap_px": gap
        }

        browser.close()

    print("\n--- FINAL VERIFICATION SUMMARY ---")
    print(json.dumps(results, indent=2))

    # Assertions
    assert results["hero_player"]["has_poster"], "Hero player missing poster!"
    assert len(results["gallery_videos"]) == 3, "Gallery must have 3 video cards!"
    for i, gv in enumerate(results["gallery_videos"]):
        assert gv["src"].endswith(".mp4"), f"Card {i+1} src is not mp4!"
        assert gv["poster"].endswith(".jpg"), f"Card {i+1} poster is not jpg!"
        assert gv["autoplay"], f"Card {i+1} not autoplaying!"
    assert results["styles_scroll_mt"], "Styles section missing scroll-mt!"
    assert results["home_comparison_videlto"], "Home comparison table branding failed!"
    assert results["admin_clean_security"], "Admin password placeholder leaked default password!"
    assert results["about_no_motion_studio"], "About page still has Motion Studio!"
    assert results["about_styled_coords"], "About page missing styled code for coordinates!"
    assert results["header_subtitle_correct"], "Header subtitle branding incorrect!"
    assert results["footer_about_videlto"], "Footer link branding incorrect!"
    assert results["footer_copyright"], "Footer copyright branding incorrect!"
    assert results["empty_state_16_9"]["title_visible"], "16:9 title not visible!"
    assert results["empty_state_16_9"]["subtitle_visible"], "16:9 subtitle not visible!"
    assert results["empty_state_16_9"]["gap_px"] is not None and results["empty_state_16_9"]["gap_px"] > 20, f"Gap too small: {results['empty_state_16_9']['gap_px']}px"

    print("\n>>> ALL 5 AUDIT REQUIREMENTS VERIFIED PERFECTLY! <<<")

if __name__ == "__main__":
    run_audit()
