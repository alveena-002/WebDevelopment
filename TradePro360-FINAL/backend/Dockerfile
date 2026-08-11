# TradePro 360 backend — multi-stage production image.
#
# Build:  docker build -t tradepro360-backend .
# Run:    docker run -p 4000:4000 --env-file .env tradepro360-backend
#
# Requires Node.js 22.5+ (for node:sqlite) even though most production
# deployments will set DATABASE_URL and use Postgres instead — the base
# image still needs to satisfy that minimum for the SQLite fallback path
# to work if DATABASE_URL is ever unset inside the container.

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Run as a non-root user
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs tradepro

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY migrations ./migrations

# Local-disk photo fallback (unused when AWS_S3_BUCKET is set, but the
# directory must exist and be writable either way).
RUN mkdir -p /app/uploads && chown -R tradepro:nodejs /app

USER tradepro

EXPOSE 4000
ENV PORT=4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--no-warnings", "src/server.js"]
