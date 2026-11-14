# Videlto Studio — Autonomous Commercial Video Ad Director

Official repository for [videlto.online](https://videlto.online).

Videlto is an autonomous commercial video studio that transforms static product photography into high-converting, agency-grade 9:16 vertical video ads in seconds—tailored for Instagram Reels, TikTok, and YouTube Shorts.

---

## Key Features

- **Autonomous Creative Direction**: Deconstructs raw product images to extract true object geometry, visible ingredients/features, and cohesive color palettes.
- **Reference-Anchored Product Fidelity**: Never distorts, hallucinates, or alters the product subject. Your exact packshot is preserved 100%.
- **3 Signature Video Ad Styles**:
  - `Style 1: Explainer & Detailing`: Dynamic numbered callout pointers, 45° angled elbow lines, and editorial serif typography.
  - `Style 2: Agency Spotlight`: Smooth 9:16 push-in zoom, atmospheric background blur, high-contrast glassmorphic card, and punchy copywriting.
  - `Style 3: Cinematic Lifestyle`: Authentic real-world setting, 3-beat human interaction storyboard, natural voiceover, and elegant CTA transition.
- **Agency-Grade Editorial Design**: Publication-ready display serifs and geometric sans-serifs with zero generic artifacts.
- **Optimized Video Pipelines**: High-definition 1080×1920 MP4 rendering at 30fps with faststart moov atom web streaming.
- **Production-Ready Web Architecture**: Next.js 14 App Router, TypeScript, Tailwind CSS, SQLite, and automated video compositing engines.

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Node.js SQLite (`node:sqlite`)
- **Image & Vision Engine**: Sharp (in-memory RGB normalization), Google Gemini API (Structured Outputs)
- **Video Compositing**: Python 3.12, Playwright, FFmpeg (1080×1920 30fps H.264/AAC MP4)

---

## Getting Started

### 1. Prerequisites

- Node.js 18+ or 20+
- Python 3.10+
- FFmpeg installed and available on `PATH`

### 2. Environment Setup

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
NEXT_PUBLIC_SITE_URL=https://videlto.online
GEMINI_API_KEY=your_gemini_api_key_here
ADMIN_PASSWORD=your_secure_password
DATABASE_FILE=./data/studio.db
UPLOAD_DIR=./uploads
PORT=3000
```

### 3. Installation

```bash
# Install Node dependencies
npm install

# Install Python requirements (if needed)
pip install playwright pillow
playwright install chromium
```

### 4. Running the Studio

```bash
# Build production bundle
npm run build

# Start production server
npm start

# Or run in development mode
npm run dev
```

Visit [https://videlto.online](https://videlto.online) or [http://localhost:3000](http://localhost:3000) locally.

---

## License

Commercial rights included with rendered assets. Core application proprietary to Videlto Inc.
