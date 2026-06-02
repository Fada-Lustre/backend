# Multi-stage build for the Fada Lustre API (Express + tsoa + PostgreSQL).
# Used by the AWS App Runner *container* route (build, push to ECR, point App Runner at the image).
# The server listens on $PORT (default 3000) and serves /v1/*, /health, /ready, /docs.

# ---- build stage: install all deps and compile TS -> dist/ ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# tsoa generates public/swagger.json + src/routes.ts, then tsc emits dist/
RUN npm run build

# ---- runtime stage: prod deps + compiled output only ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# dist/ holds the compiled server; public/ holds swagger.json which src/index.ts
# imports at runtime via ../public/swagger.json (relative to dist/index.js).
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

EXPOSE 3000
# Standalone server entry (npm start === node ./dist/index.js).
CMD ["node", "dist/index.js"]
