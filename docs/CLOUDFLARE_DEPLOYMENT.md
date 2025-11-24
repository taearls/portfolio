# Cloudflare Worker Deployment Guide

This guide walks through deploying the feature flags Cloudflare Worker from scratch.

## Prerequisites

1. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com/sign-up
   - Free tier is sufficient for this project

2. **Node.js & npm**
   - Node.js 18+ required
   - Check version: `node --version`

3. **Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

## Step-by-Step Deployment

### 1. Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authorize Wrangler.

### 2. Install Worker Dependencies

```bash
cd workers/feature-flags
npm install
```

### 3. Create KV Namespaces

Create both production and preview KV namespaces:

```bash
# Create production namespace
npm run kv:create

# Output will be similar to:
# { binding = "FEATURE_FLAGS_KV", id = "abc123def456" }

# Create preview namespace (for `wrangler dev`)
npm run kv:create:preview

# Output will be similar to:
# { binding = "FEATURE_FLAGS_KV", preview_id = "xyz789uvw012" }
```

**Important:** Save these IDs - you'll need them in the next step.

### 4. Update `wrangler.toml`

Open `workers/feature-flags/wrangler.toml` and update the KV namespace IDs:

```toml
kv_namespaces = [
  {
    binding = "FEATURE_FLAGS_KV",
    id = "abc123def456",           # Your production ID
    preview_id = "xyz789uvw012"    # Your preview ID
  }
]
```

Also update the `ALLOWED_ORIGINS` for production:

```toml
[env.production]
name = "portfolio-feature-flags"
vars = { ALLOWED_ORIGINS = "https://tylerearls.com" }  # Your production domain
```

### 5. Generate and Set Admin API Key

Generate a secure random API key:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Example output:
```
J8k3mP9qR2sT5vY7wZ0aB4cD6eF8gH1iK3lM5nO7pQ==
```

**Save this key securely** - you'll need it for API requests and GitHub Actions.

Set it as a Worker secret:

```bash
wrangler secret put ADMIN_API_KEY
# Paste the generated key when prompted
```

### 6. Deploy to Production

```bash
npm run deploy:production
```

Expected output:
```
 ⛅️ wrangler 3.86.0
-------------------
Total Upload: 1.23 KiB / gzip: 0.89 KiB
Uploaded portfolio-feature-flags (2.34 sec)
Published portfolio-feature-flags (0.45 sec)
  https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev
Current Deployment ID: abc123-def456-ghi789
```

**Important:** Note your Worker URL for the next step.

### 7. Set Initial Feature Flags

Initialize the flags in KV with safe defaults:

```bash
# Option 1: Using Wrangler CLI
wrangler kv:key put --binding FEATURE_FLAGS_KV feature_flags \
  '{"contactForm":{"enabled":false,"message":"Contact form coming soon!"}}'

# Option 2: Using the Worker API
curl -X PUT https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contactForm":{"enabled":false,"message":"Contact form coming soon!"}}'
```

### 8. Verify Deployment

Test the public GET endpoint:

```bash
curl https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags
```

Expected response:
```json
{
  "contactForm": {
    "enabled": false,
    "message": "Contact form coming soon!"
  }
}
```

### 9. Update React App Configuration

Update `.env.production` with your Worker URL:

```env
VITE_FEATURE_FLAGS_API_URL=https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags
```

Commit this change:

```bash
git add .env.production
git commit -m "feat: configure production feature flags API URL"
```

### 10. Configure GitHub Actions (Optional)

If you want to manage flags via GitHub Actions:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add repository secrets:
   - `FEATURE_FLAGS_API_URL`: Your Worker URL (e.g., `https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags`)
   - `FEATURE_FLAGS_ADMIN_API_KEY`: The API key you generated in Step 5

4. Create a production environment:
   - Go to **Settings** → **Environments**
   - Click **New environment**
   - Name: `production`
   - Add the same secrets at the environment level

Now you can toggle flags from the **Actions** tab!

## Local Development

### Start Development Server

```bash
cd workers/feature-flags
npm run dev
```

This starts a local Worker at `http://localhost:8787`.

### Test Locally

```bash
# Get flags
curl http://localhost:8787/api/flags

# Update flags (use local dev API key)
curl -X PUT http://localhost:8787/api/flags \
  -H "X-API-Key: dev-api-key" \
  -H "Content-Type: application/json" \
  -d '{"contactForm":{"enabled":true}}'
```

### Local Development with React App

1. Start the Worker dev server:
   ```bash
   cd workers/feature-flags
   npm run dev
   ```

2. In another terminal, start the React app:
   ```bash
   cd ../..  # Back to project root
   npm run dev
   ```

The React app will use the `.env.development` configuration, which points to `http://localhost:8787/api/flags`.

## Deployment Environments

### Staging Deployment

Deploy to staging environment:

```bash
npm run deploy:staging
```

This uses the `[env.staging]` configuration in `wrangler.toml` with different CORS origins.

### Production Deployment

```bash
npm run deploy:production
```

## Monitoring

### View Real-Time Logs

```bash
cd workers/feature-flags
npm run tail
```

This streams live logs from your Worker.

### Cloudflare Dashboard

1. Log in to https://dash.cloudflare.com
2. Navigate to **Workers & Pages**
3. Click on `portfolio-feature-flags`
4. View metrics, logs, and settings

### Key Metrics to Monitor

- **Request rate:** Should be <1000/min for typical traffic
- **Error rate:** Should be <1%
- **Latency (P95):** Should be <200ms
- **KV read errors:** Should be 0

## Troubleshooting

### "Namespace not found" Error

**Problem:** KV namespace binding is incorrect

**Solution:**
1. Verify KV namespace exists: `wrangler kv:namespace list`
2. Check IDs match in `wrangler.toml`
3. Redeploy: `npm run deploy:production`

### "Unauthorized" on Admin Endpoint

**Problem:** API key not set or incorrect

**Solution:**
1. List secrets: `wrangler secret list`
2. Verify `ADMIN_API_KEY` exists
3. If missing: `wrangler secret put ADMIN_API_KEY`

### CORS Errors

**Problem:** Origin not in allowed list

**Solution:**
1. Check `ALLOWED_ORIGINS` in `wrangler.toml`
2. Add your domain to the list
3. Redeploy: `npm run deploy:production`

### Flags Not Updating

**Problem:** Cache not cleared or KV propagation delay

**Solution:**
1. Wait 60 seconds for KV global propagation
2. Clear browser cache: `localStorage.removeItem('portfolio:feature-flags')`
3. Verify flag value in KV: `npm run kv:get`

### Worker Not Responding

**Problem:** Worker code error or deployment issue

**Solution:**
1. Check logs: `npm run tail`
2. Verify deployment: `wrangler deployments list`
3. Check Worker status in Dashboard
4. Redeploy: `npm run deploy:production`

## Cost Management

### Free Tier Limits

Cloudflare Workers Free Tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- First 1GB KV storage free
- 100,000 KV reads/day free

### Estimated Usage

For a portfolio website:
- **Daily requests:** ~1,000-5,000
- **KV storage:** <1MB
- **KV reads:** ~1,000-5,000/day

**Estimated cost: $0/month** (well within free tier)

### Setting Up Alerts

To avoid unexpected charges:

1. Go to **Workers & Pages** → **portfolio-feature-flags** → **Settings**
2. Set up email alerts for:
   - Request volume exceeds 80% of free tier
   - Error rate exceeds 5%

## Security Best Practices

1. **Rotate API Keys Regularly**
   ```bash
   # Generate new key
   openssl rand -base64 32

   # Update secret
   wrangler secret put ADMIN_API_KEY
   ```

2. **Use Environment-Specific Secrets**
   - Different API keys for staging/production
   - Never commit secrets to git

3. **Monitor Access Logs**
   - Review Worker logs weekly
   - Look for unauthorized PUT attempts
   - Check for unusual traffic patterns

4. **Enable Rate Limiting**
   - Already configured (100 req/min per IP)
   - Adjust if needed in `workers/feature-flags/src/index.ts`

5. **Use HTTPS Only**
   - Cloudflare Workers always use HTTPS
   - Never expose HTTP endpoints

## Updating the Worker

### Deploy Code Changes

```bash
cd workers/feature-flags
npm run deploy:production
```

### Update Environment Variables

```bash
# Update via Wrangler
wrangler secret put VARIABLE_NAME

# Or edit wrangler.toml and redeploy
```

### Rollback Deployment

```bash
# List recent deployments
wrangler deployments list

# Rollback to specific deployment
wrangler rollback <DEPLOYMENT_ID>
```

## Next Steps

1. Test the Worker endpoint from your browser
2. Update React app configuration
3. Deploy React app to Cloudflare Pages
4. Configure custom domain (if desired)
5. Set up monitoring and alerts
6. Document your specific deployment details

## References

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [KV Storage Documentation](https://developers.cloudflare.com/kv/)
- [Feature Flags Documentation](./FEATURE_FLAGS.md)
