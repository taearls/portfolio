# Feature Flags Setup Guide

## Local Development

1. **Environment Variable**
   Create `.env` in the project root:
   ```bash
   VITE_FEATURE_FLAGS_API_URL=http://localhost:8787/api/flags
   ```

2. **Start Both Servers**
   ```bash
   npm run dev:all
   ```
   This runs both the Vite dev server and the feature flags Worker.

## Cloudflare Pages Configuration

### Environment Variables

Add the following environment variable in **Cloudflare Dashboard** → **Pages** → **Settings** → **Environment Variables**:

#### Production Environment
- **Name**: `VITE_FEATURE_FLAGS_API_URL`
- **Value**: `https://feature-flags.<your-subdomain>.workers.dev/api/flags`
- **Environment**: Production

#### Preview Environment (Staging)
- **Name**: `VITE_FEATURE_FLAGS_API_URL`
- **Value**: `https://feature-flags-staging.<your-subdomain>.workers.dev/api/flags`
- **Environment**: Preview

> **Note**: Replace `<your-subdomain>` with your actual Cloudflare Workers subdomain.

### Finding Your Worker URLs

Run this command to find your Worker URLs:
```bash
cd workers/feature-flags
npx wrangler deployments list
```

## Managing Feature Flags

### Quick Commands

From the project root:

**Check current flags:**
```bash
npm run flags:get:dev -w @portfolio/feature-flags
npm run flags:get:staging -w @portfolio/feature-flags
npm run flags:get:prod -w @portfolio/feature-flags
```

**Enable contact form:**
```bash
npm run flags:enable:dev -w @portfolio/feature-flags
npm run flags:enable:staging -w @portfolio/feature-flags
npm run flags:enable:prod -w @portfolio/feature-flags
```

**Disable contact form:**
```bash
npm run flags:disable:dev -w @portfolio/feature-flags
npm run flags:disable:staging -w @portfolio/feature-flags
npm run flags:disable:prod -w @portfolio/feature-flags
```

## Troubleshooting

### CORS Errors
Ensure `ALLOWED_ORIGINS` in `wrangler.toml` includes your frontend URL:
- Local: `http://localhost:3000`
- Production: `https://tylerearls.com`

### Worker Not Connecting to Remote KV
Verify `remote = true` is set in the KV namespace binding in `wrangler.toml`.

### Feature Flags Not Updating
The Worker caches responses for 60 seconds. Wait 1 minute or clear cache by:
1. Making a PUT request to update flags (which clears cache)
2. Waiting for the TTL to expire
