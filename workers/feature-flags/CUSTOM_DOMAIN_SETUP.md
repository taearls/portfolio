# Custom Domain Setup for Feature Flags Worker

This guide walks you through setting up `https://api.tylerearls.com/flags` for your production Feature Flags Worker.

## Prerequisites

- Domain `tylerearls.com` must be managed in your Cloudflare account
- Worker code already configured with custom domain route

## Step 1: Verify Domain in Cloudflare

1. Go to **Cloudflare Dashboard** → **Websites**
2. Verify `tylerearls.com` is listed
3. Ensure DNS is managed by Cloudflare (nameservers should be Cloudflare's)

## Step 2: Deploy Worker with Custom Domain

The Worker is already configured in `wrangler.toml` with:
```toml
routes = [
  { pattern = "api.tylerearls.com", custom_domain = true }
]
```

**Note**: Custom domains in Cloudflare Workers don't support paths, so the domain covers all paths. Your Worker will be accessible at `https://api.tylerearls.com/api/flags` (the `/api/flags` path is handled by your Worker code).

Deploy to production:
```bash
cd workers/feature-flags
npx wrangler deploy
```

When you deploy with `custom_domain = true`, Cloudflare will:
1. **Automatically create the DNS record** for `api.tylerearls.com`
2. **Provision an SSL certificate** for the subdomain
3. **Route traffic** to your Worker

## Step 3: Verify DNS Setup

After deployment, check that the DNS record was created:

1. Go to **Cloudflare Dashboard** → **Websites** → `tylerearls.com` → **DNS** → **Records**
2. Look for an `AAAA` record for `api` pointing to `100::` (Cloudflare's Worker indicator)

Or check via CLI:
```bash
dig api.tylerearls.com
```

## Step 4: Test the Endpoint

After deployment (and DNS propagation, usually instant with Cloudflare), test:

```bash
curl https://api.tylerearls.com/api/flags
```

Expected response:
```json
{
  "email-contact-form": {
    "enabled": false
  }
}
```

## Step 5: Update Cloudflare Pages Environment Variable

Now that the custom domain is live, update your Cloudflare Pages configuration:

1. Go to **Cloudflare Dashboard** → **Pages** → Your portfolio project
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update for **Production**:
   - **Name**: `VITE_FEATURE_FLAGS_API_URL`
   - **Value**: `https://api.tylerearls.com/api/flags`
   - **Environment**: Production
4. **Redeploy** your Pages site to pick up the new environment variable

## Troubleshooting

### DNS Record Not Created
If the DNS record wasn't automatically created, you can create it manually:
1. Go to **DNS** → **Records**
2. Click **Add record**
3. Type: `AAAA`
4. Name: `api`
5. IPv6 address: `100::`
6. Proxy status: **Proxied** (orange cloud)
7. Click **Save**

### SSL Certificate Issues
Cloudflare automatically provisions SSL certificates for custom domains. If you see SSL errors:
- Wait a few minutes for certificate provisioning
- Ensure the domain is proxied (orange cloud) in DNS settings

### CORS Errors
The Worker is already configured to allow `https://tylerearls.com`. If you encounter CORS issues:
- Verify the origin is in the `ALLOWED_ORIGINS` list in `wrangler.toml`
- Check browser console for the exact error message

### Worker Not Responding
1. Check Worker logs:
   ```bash
   npx wrangler tail feature-flags
   ```
2. Verify deployment:
   ```bash
   npx wrangler deployments list
   ```

## What You Get

✅ **Production URL**: `https://api.tylerearls.com/api/flags`
✅ **Automatic SSL/TLS**
✅ **Global CDN** (Cloudflare's edge network)
✅ **Custom domain** (cleaner than workers.dev)
✅ **Automatic DNS management**

## Future Expansion

The custom domain `api.tylerearls.com` now routes all traffic to your Worker. You can add more API endpoints by updating your Worker code to handle different paths:

- `https://api.tylerearls.com/api/flags` - Current feature flags endpoint
- `https://api.tylerearls.com/api/auth` - Future auth endpoint
- `https://api.tylerearls.com/api/data` - Future data endpoint

All paths under `api.tylerearls.com` will be handled by this Worker.
