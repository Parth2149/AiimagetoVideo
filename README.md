# Motion Studio — Product Photo to Video Ad Web App

A modern creative studio web app built with Next.js, TypeScript, SQLite, and local file storage that turns product photos and creative briefs into video ad orders, supporting a manual fulfillment workflow through Gemini Apps (Task tab).

## Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom warm ivory palette, ink typography, soft borders, and glossy highlight button styling
- **Visuals**: Custom WebGL satin shader canvas blending electric blue, orchid, and peach behind the portrait 9:16 ad preview frame (with graceful CSS fallback for reduced motion or non-WebGL environments)
- **Database**: Persistent local SQLite database (`data/studio.db`) using Node.js built-in `node:sqlite`
- **File Storage**: Local filesystem (`uploads/photos/` and `uploads/videos/`) with server-side MIME type and size validation
- **Streaming**: Native HTTP Range request support (HTTP 206) for smooth seeking and playback in browser video players

---

## Getting Started

### 1. Environment Configuration

Copy the example configuration:
```bash
cp .env.example .env.local
```

Configurable variables:
- `ADMIN_PASSWORD`: Operator password (default: `studio2026`)
- `DATABASE_FILE`: SQLite file path (default: `./data/studio.db`)
- `UPLOAD_DIR`: Upload storage folder (default: `./uploads`)
- `PORT`: Port number (default: `3000`)

### 2. Running Locally

```bash
# Run production build
npm start

# Or run in development mode
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## User Workflows

### Customer Flow (`/`)
1. **Homepage**: Drop in a JPG, PNG, or WebP photo (or use the built-in salad bowl preview).
2. **Creative Brief**: Enter a short brief (e.g. `Make a 10-second Instagram ad for this salad bowl. End with ‘Order today’.`).
3. **Submit Order**: Automatically creates a private order with an unguessable token and redirects to `/orders/[token]`.
4. **Order Status**: Shows live status (`Submitted` → `In production` → `Ready`). When `Ready`, plays the finished video in the portrait frame with a **Download MP4** button. Auto-polls every 3 seconds for updates.

### Operator Admin Flow (`/admin`)
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the admin password (`studio2026`).
3. View recent orders with thumbnail, brief, and status.
4. Actions available per order:
   - **Download photo**: Retrieve the customer's uploaded high-resolution packshot.
   - **Copy brief**: One-click copy of the creative brief.
   - **Open Gemini**: Opens `https://gemini.google.com/app` in a new tab with the formatted Task prompt copied to clipboard.
   - **Mark In production**: Updates the customer's status badge.
   - **Upload Finished MP4**: Select and upload the rendered MP4 video. This marks the order as `Ready` and immediately makes the video playable and downloadable on the customer's private page.

