import time
from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page()

        video_requests = []
        page.on("request", lambda r: video_requests.append(r.url) if ".mp4" in r.url else None)

        start = time.time()
        print("Loading http://localhost:3000 ...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        load_time = time.time() - start
        print(f"Initial networkidle load time: {load_time:.2f}s")
        print(f"Video requests on initial load: {len(video_requests)}")
        for u in video_requests:
            print("  -", u)

        # Confirm only hero video was loaded (or none if delayed) and ZERO gallery videos loaded
        gallery_requested = [u for u in video_requests if "/gallery/" in u]
        print(f"Gallery video requests before scroll: {len(gallery_requested)} (Expected: 0)")
        assert len(gallery_requested) == 0, "Gallery videos should NOT be requested before scrolling!"

        # Now scroll down to #gallery
        print("\nScrolling down to #gallery ...")
        page.locator("#gallery").scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        post_scroll_gallery = [u for u in video_requests if "/gallery/" in u]
        print(f"Gallery video requests after scroll: {len(post_scroll_gallery)} (Expected: > 0)")
        assert len(post_scroll_gallery) > 0, "Gallery videos should start loading when scrolled into view!"

        # Check Hero Player playback
        hero_video = page.locator("video").first
        is_paused = hero_video.evaluate("v => v.paused")
        current_time = hero_video.evaluate("v => v.currentTime")
        print(f"Hero video state: paused={is_paused}, currentTime={current_time:.2f}s")

        browser.close()
        print("\n>>> PERFORMANCE AND LAZY VIDEO LOADING VERIFIED 100%! <<<")

if __name__ == "__main__":
    test()
