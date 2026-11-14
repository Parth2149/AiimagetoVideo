FROM node:20-bookworm-slim

# Install system dependencies: Python 3, pip, FFmpeg, certificates, and libatomic1 (required by Playwright driver)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ensure Playwright browser binary is globally available
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install Python packages required for autonomous video rendering
RUN pip3 install --no-cache-dir --break-system-packages playwright pillow

# Install Playwright Chromium and all required OS system libraries
RUN python3 -m playwright install --with-deps chromium

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Set production environment variables
ENV NEXT_PUBLIC_SITE_URL=https://videlto.online
ENV NODE_ENV=production
ENV PORT=3000

# Build Next.js application
RUN npm run build

EXPOSE 3000

# Run Next.js server
CMD ["npm", "start"]
