import os
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\parth\.gemini\antigravity\brain\6a3e308d-70c8-4fb8-b291-9619dacc4cca"

def check():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800}, device_scale_factor=2)
        page = context.new_page()

        print("Opening http://localhost:3000/create ...")
        page.goto("http://localhost:3000/create", wait_until="networkidle")

        badge_online = page.locator("text=AI Engine Online").count()
        badge_engine = page.locator("text=Engine").count()
        print(f"'AI Engine Online' count: {badge_online}")
        print(f"'Engine' matches in create page: {badge_engine}")

        header_shot = os.path.join(artifact_dir, "create_header_no_badge.png")
        page.locator("div.mb-8").screenshot(path=header_shot)
        print(f"Header screenshot saved: {header_shot}")

        assert badge_online == 0, "'AI Engine Online' badge still present!"
        print(">>> SUCCESS: 'AI Engine Online' badge successfully removed! <<<")

        browser.close()

if __name__ == "__main__":
    check()

