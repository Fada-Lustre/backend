# Deploying the Fada Lustre API to AWS App Runner

The API is a standalone Express server (`npm start` → `dist/index.js`) that listens on
`$PORT` (default `3000`) and serves `/v1/*`, `/health`, `/ready`, and `/docs`.

> **Note:** AWS Amplify Hosting (static/SSR) cannot run this server — an `amplify.yml` that
> publishes `dist/` would only serve the compiled files as static assets and nothing would
> listen. App Runner is the right fit: it runs the process and gives you an HTTPS URL.

> ⚠️ **App Runner availability:** AWS now states App Runner is **no longer open to new
> customers** ("Existing customers can continue to use the service as normal"). If this AWS
> account hasn't used App Runner before, you may be unable to create a service — in that case
> use **ECS Fargate**, **Elastic Beanstalk**, or **Lightsail Containers** instead. The
> `Dockerfile` here works unchanged on any of them (ECS/Fargate and Lightsail both run the
> same container image). Confirm App Runner access before committing to it.

App Runner offers two source types. Pick **one**:

| Route | Uses | When |
|-------|------|------|
| **A. Container (ECR)** — recommended, tested | `Dockerfile` | Pins Node 22, reproducible image |
| **B. Source (GitHub)** | `apprunner.yaml` | No ECR/Docker; uses App Runner's managed Node runtime |

(Whichever you choose, App Runner ignores the other file.)

## Route A — Container image via ECR (recommended)

The `Dockerfile` is a verified multi-stage build (compiles TS, ships only prod deps + `dist/` +
`public/`). Locally confirmed: image builds and `/health` returns `{"status":"ok"}`.

```bash
AWS_REGION=eu-west-2            # London; match your account
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REPO=fadalustre-api

aws ecr create-repository --repository-name $REPO --region $AWS_REGION 2>/dev/null || true
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com

# Build for App Runner (linux/amd64) and push:
docker buildx build --platform linux/amd64 \
  -t $ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest --push .
```

Then create the App Runner service from that image (console or CLI):
- **Port:** `3000`
- **Health check:** HTTP, path `/health`
- **Environment variables:** see below
- Auto-deploy on new image push (optional)

## Route B — Source / GitHub (no ECR)

Connect the GitHub repo in the App Runner console; it reads `apprunner.yaml` (managed Node 22,
runs `npm ci && npm run build`, then `npm start`, port `3000`). Set the same env vars in the
service config. (`nodejs22` is App Runner's current managed Node runtime — Node 18 and earlier
reached End of Support on 2025-12-01, so 22 is the correct choice, not 20.)

## Required environment variables (set in App Runner — use secrets for sensitive ones)

| Var | Required | Notes |
|-----|----------|-------|
| `DB_USER` `DB_HOST` `DB_DB` `DB_PASSWORD` | ✅ | Postgres connection |
| `DB_PORT` | – | default `5432` |
| `DB_SSL` | ⚠️ | set **`true`** for managed Postgres (Neon/RDS) |
| `JWT_SECRET` `JWT_REFRESH_SECRET` | ✅ | each ≥ 32 chars |
| `ALLOWED_ORIGINS` | ⚠️ | **must set in prod** (comma-separated), e.g. `https://www.fadalustre-pro.co.uk,https://admin.fadalustre-pro.co.uk` — otherwise it defaults to empty and browsers get CORS-blocked |
| `RESEND_API_KEY` `RESEND_FROM_EMAIL` | ⚠️ | needed for invitation / OTP emails (verify the sending domain in Resend) |
| `R2_ACCOUNT_ID` `R2_ACCESS_KEY_ID` `R2_SECRET_ACCESS_KEY` `R2_BUCKET_NAME` | ⚠️ | image upload/presign; without them R2 runs in stub mode |
| `ENCRYPTION_KEY` | – | optional |

Store secrets via App Runner's `secrets:` (AWS Secrets Manager / SSM), not in plaintext config.
`NODE_ENV=production` and `PORT=3000` are already set by the Dockerfile / `apprunner.yaml`.
`CRON_SECRET` is **no longer needed** (the Vercel cron was removed).

## Point `api.fadalustre-pro.co.uk` at the service

App Runner gives the service a default `*.awsapprunner.com` URL. To use the custom domain:
1. App Runner → service → **Custom domains** → add `api.fadalustre-pro.co.uk`.
2. Add the **CNAME / certificate-validation records** App Runner shows to your DNS.
   This **replaces** the current CloudFront→S3 mapping that's causing the 404s.
3. Verify: `curl https://api.fadalustre-pro.co.uk/health` → `{"status":"ok"}`, and `/docs` loads.

## Scheduled OTP cleanup

There's no longer a Vercel cron. Schedule `npm run cleanup:otp` (→ `node ./dist/scripts/cleanup-otp.js`)
on a recurring basis — e.g. an EventBridge Scheduler + a small task, or a GitHub Actions cron.
(Introduced in the Vercel-removal PR.)
