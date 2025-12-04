# Single Docker image for both frontend and backend
FROM node:18-alpine

LABEL org.opencontainers.image.description="Fusion Electronics Full-Stack E-commerce Application - Combined Frontend & Backend"

WORKDIR /app

# Copy package files for both frontend and backend
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Install all dependencies
RUN npm install --no-audit --prefer-offline

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend source code
COPY public ./public
COPY src ./src
COPY craco.config.js jsconfig.json setupProxy.js ./

# Build the frontend
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Fusion Electronics Full-Stack Application..."' >> /app/start.sh && \
    echo 'echo "📂 Starting Backend Server on port 5000..."' >> /app/start.sh && \
    echo 'cd /app/backend && npm start &' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for backend to initialize..."' >> /app/start.sh && \
    echo 'sleep 5' >> /app/start.sh && \
    echo 'echo "🌐 Starting Frontend Server on port 3000..."' >> /app/start.sh && \
    echo 'cd /app && npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose both ports
EXPOSE 3000 5000

# Start both services
CMD ["/app/start.sh"]
