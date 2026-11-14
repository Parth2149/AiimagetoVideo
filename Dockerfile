FROM node:20-bullseye-slim

# Install system dependencies: Python 3, pip, FFmpeg, and Chromium rendering libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python packages required for autonomous video rendering
RUN pip3 install --no-cache-dir playwright pillow
RUN python3 -m playwright install --with-deps chromium

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Set environment
ENV NEXT_PUBLIC_SITE_URL=https://videlto.online
ENV NODE_ENV=production
ENV PORT=3000

# Build Next.js application
RUN npm run build

EXPOSE 3000

# Run Next.js server
CMD ["npm", "start"]
