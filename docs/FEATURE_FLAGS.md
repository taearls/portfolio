# Feature Flags Documentation

This document describes the feature flag infrastructure for the portfolio website, featuring:

- **GitOps workflow** - Flags managed via `flipt.yaml` in Git
- **Build-time tree shaking** - Disabled features excluded from production bundles
- **Runtime toggling** - Dynamic feature control via Cloudflare Workers + KV
- **CLI management** - Simple commands to enable/disable flags

## Quick Start

```bash
# List all flags
npm run flags:list

# Enable a flag
npm run flags:enable email_contact_form

# Disable a flag
npm run flags:disable email_contact_form

# Check status
npm run flags:status
```

## Architecture Overview

The feature flag system uses a hybrid architecture with two types of flags:

### Build-time Flags (Tree-shakeable)

```
flipt.yaml ──▶ Vite Plugin ──▶ import.meta.env.FEATURE_* ──▶ Dead code elimination
(Git-tracked)   (build time)    (static replacement)         (bundle optimization)
```

**Use for:**
- Features that are definitively on/off per environment
- Large feature modules you want to exclude from bundles
- Environment-specific functionality

**Benefits:**
- Disabled code is completely removed from production bundle
- No runtime overhead
- Changes tracked in Git history

### Runtime Flags (Dynamic)

```
React App ← HTTP → Cloudflare Worker ← KV → Cloudflare Dashboard/Wrangler
          ↓
    localStorage
      (1min TTL)
```

**Use for:**
- Emergency kill switches
- A/B testing and gradual rollouts
- Features that need instant toggling without rebuild

### Configuration File (`flipt.yaml`)

The `flipt.yaml` file at the project root defines all feature flags:

```yaml
version: "1.0"
namespace: portfolio

# Build-time flags - resolved at build, tree-shakeable
build_time_flags:
  email_contact_form:
    enabled: true
    description: "Email contact form with Postmark integration"

  dark_mode_toggle:
    enabled: true
    description: "Dark mode toggle in navigation"

# Runtime flags - evaluated at runtime via Worker API
runtime_flags:
  email_contact_form:
    enabled: true
    description: "Runtime toggle for contact form (emergency kill switch)"
    message: null

# Environment-specific overrides
environments:
  development:
    build_time_flags:
      email_contact_form:
        enabled: true
  production:
    build_time_flags:
      email_contact_form:
        enabled: true
```

### Components

1. **Vite Plugin** (`scripts/vite-plugin-feature-flags.ts`)
   - Reads `flipt.yaml` at build time
   - Injects flags as `import.meta.env.FEATURE_*` constants
   - Enables Rollup to tree-shake disabled feature code

2. **CLI Scripts** (`scripts/flags-cli.ts`)
   - `npm run flags:list` - List all flags
   - `npm run flags:enable <flag>` - Enable a flag
   - `npm run flags:disable <flag>` - Disable a flag
   - `npm run flags:sync` - Show Worker sync commands
   - `npm run flags:status` - Show flag summary

3. **Cloudflare Worker** (`packages/feature-flags/`)
   - REST API for feature flags
   - GET `/api/flags` - Public endpoint to fetch flags
   - PUT `/api/flags` - Admin endpoint to update flags (requires API key)
   - Rate limiting: 100 requests/minute per IP
   - Multi-layer caching (CDN + KV)

2. **React Context** (`src/state/contexts/FeatureFlagContext.tsx`)
   - `FeatureFlagProvider` - Wraps app to provide flag state
   - `useFeatureFlags()` - Access full flag state and metadata
   - `useFeatureFlag(feature)` - Check if specific feature is enabled
   - `useContactFormFlag()` - Get contact form configuration
   - localStorage caching (1 minute TTL)
   - Automatic refetch every 1 minute

3. **TypeScript Types** (`src/types/featureFlags.ts`)
   - Shared types between Worker and React app
   - Type-safe flag definitions

## Available Feature Flags

### `contactForm`

Controls the contact form feature.

**Fields:**

- `enabled` (boolean, required) - Whether the contact form is enabled
- `message` (string, optional) - Custom message to display when disabled

**Example:**

```json
{
  "contactForm": {
    "enabled": true,
    "message": "Contact form is now available!"
  }
}
```

## Deployment Guide

### Prerequisites

1. Install Wrangler CLI:

   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

### Step 1: Create KV Namespaces

Create production and preview KV namespaces:

```bash
cd workers/feature-flags
npm install
npm run kv:create           # Production namespace
npm run kv:create:preview   # Preview namespace
```

Note the namespace IDs returned by Wrangler.

### Step 2: Update `wrangler.toml`

Edit `workers/feature-flags/wrangler.toml` and replace placeholder IDs:

```toml
kv_namespaces = [
  { binding = "FEATURE_FLAGS_KV", id = "YOUR_PRODUCTION_KV_ID", preview_id = "YOUR_PREVIEW_KV_ID" }
]
```

### Step 3: Set Admin API Key

Create a secure API key and store it as a secret:

```bash
# Generate a secure random key
openssl rand -base64 32

# Store it as a Worker secret
wrangler secret put ADMIN_API_KEY
# Paste the generated key when prompted
```

### Step 4: Deploy Worker

Deploy to production:

```bash
npm run deploy:production
```

The deployment will output your Worker URL, e.g.:

```
https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev
```

### Step 5: Update React App Environment Variables

Update `.env.production` with your Worker URL:

```env
VITE_FEATURE_FLAGS_API_URL=https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags
```

Commit this file to the repository.

### Step 6: Set Initial Flags

Set the initial feature flags in KV:

```bash
# Using Wrangler CLI
wrangler kv:key put --binding FEATURE_FLAGS_KV feature_flags '{"contactForm":{"enabled":false}}'

# Or via API
curl -X PUT https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contactForm":{"enabled":false}}'
```

## Managing Feature Flags

### Method 1: Wrangler CLI (Recommended for Automation)

#### View Current Flags

```bash
cd workers/feature-flags
npm run kv:get
```

#### Update Flags

```bash
# Enable contact form
wrangler kv:key put --binding FEATURE_FLAGS_KV feature_flags \
  '{"contactForm":{"enabled":true,"message":"Contact form is live!"}}'

# Disable contact form
wrangler kv:key put --binding FEATURE_FLAGS_KV feature_flags \
  '{"contactForm":{"enabled":false,"message":"Contact form is temporarily unavailable"}}'
```

### Method 2: REST API (For Programmatic Access)

#### Fetch Current Flags (Public)

```bash
curl https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags
```

#### Update Flags (Admin Only)

```bash
curl -X PUT https://portfolio-feature-flags.YOUR_SUBDOMAIN.workers.dev/api/flags \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contactForm": {
      "enabled": true,
      "message": "Contact form is now available!"
    }
  }'
```

### Method 3: Cloudflare Dashboard (For Manual Updates)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **KV**
3. Select your `FEATURE_FLAGS_KV` namespace
4. Find the `feature_flags` key
5. Click **Edit** and update the JSON value
6. Click **Save**

**Note:** Dashboard changes may take up to 60 seconds to propagate globally.

### Method 4: GitHub Actions (For CI/CD Integration)

See `.github/workflows/toggle-feature-flag.yml` for automated flag management via GitHub Actions.

To toggle a flag via GitHub:

1. Go to **Actions** tab in GitHub
2. Select **Toggle Feature Flag** workflow
3. Click **Run workflow**
4. Enter flag details
5. Click **Run workflow**

## Usage in React Components

### Build-time Flags (Tree-shakeable)

Use `import.meta.env.FEATURE_*` for code that should be eliminated when disabled:

```tsx
// Conditional rendering - entire block removed if flag is false
if (import.meta.env.FEATURE_EMAIL_CONTACT_FORM) {
  return <ContactEmailForm />;
}

// Conditional lazy loading - import not included if flag is false
const ContactForm = import.meta.env.FEATURE_EMAIL_CONTACT_FORM
  ? lazy(() => import("@/components/ContactEmailForm.tsx"))
  : () => null;

// Type-safe access (defined in src/vite-env.d.ts)
const showDarkModeToggle: boolean = import.meta.env.FEATURE_DARK_MODE_TOGGLE;
```

**Important:** Build-time flags are resolved during `npm run build`. To see changes:
1. Update `flipt.yaml`
2. Run `npm run build` (or restart dev server)

### Runtime Flags (Dynamic)

Use runtime flags for features that need instant toggling without rebuild:

#### Basic Usage

```tsx
import { useFeatureFlag } from "@/state/contexts/FeatureFlagContext";

function ContactPage() {
  const isContactFormEnabled = useFeatureFlag("contactForm");

  return (
    <div>
      {isContactFormEnabled ? (
        <ContactForm />
      ) : (
        <p>Contact form is currently unavailable</p>
      )}
    </div>
  );
}
```

### With Custom Message

```tsx
import { useContactFormFlag } from "@/state/contexts/FeatureFlagContext";

function ContactPage() {
  const { enabled, message } = useContactFormFlag();

  return (
    <div>
      {enabled ? (
        <ContactForm />
      ) : (
        <p>{message || "Contact form is currently unavailable"}</p>
      )}
    </div>
  );
}
```

### Access Full Flag State

```tsx
import { useFeatureFlags } from "@/state/contexts/FeatureFlagContext";

function FeatureFlagDebugPanel() {
  const { flags, isLoading, error, refetch } = useFeatureFlags();

  if (isLoading) return <p>Loading flags...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <pre>{JSON.stringify(flags, null, 2)}</pre>
      <button onClick={refetch}>Refresh Flags</button>
    </div>
  );
}
```

## Caching Strategy

The feature flag system uses a multi-layer caching strategy:

### Layer 1: Browser Cache (1 minute TTL)

- Stored in `localStorage`
- Key: `portfolio:feature-flags`
- Instant flag access on page load
- Expires after 1 minute

### Layer 2: Cloudflare CDN Cache (1 minute TTL)

- Configured via `Cache-Control` headers
- Global edge caching
- Stale-while-revalidate (30s)

### Layer 3: Cloudflare KV (Source of Truth)

- Eventually consistent (~60s propagation)
- Infinite TTL (manual updates only)

### Refetch Strategy

- React app automatically refetches every 1 minute
- Manual refetch via `refetch()` function
- On error, keeps last known good state

## Performance Budget

- **Initial load:** <20ms (cached in browser)
- **API fetch:** <100ms (CDN cache hit)
- **KV read:** <200ms (cold read)
- **Total bundle impact:** <5KB (compressed)

## Security

### Rate Limiting

- 100 requests/minute per IP address
- Uses KV for distributed rate limit tracking
- Returns 429 status on limit exceeded

### Authentication

- Admin API key required for PUT operations
- Stored as Worker secret (not in code)
- No authentication needed for GET operations (public)

### CORS

- Configurable allowed origins
- Default: `https://tylerearls.com`, `http://localhost:3000`, `http://localhost:4173`
- Rejects requests from unauthorized origins

## Monitoring

### Worker Logs

View real-time logs:

```bash
cd workers/feature-flags
npm run tail
```

### Metrics

Monitor in Cloudflare Dashboard:

1. Navigate to **Workers & Pages** → **your-worker**
2. Click **Metrics** tab
3. View request rate, errors, and latency

### Alerts

Set up alerts in Cloudflare Dashboard:

1. **Workers & Pages** → **your-worker** → **Settings**
2. Configure alerts for:
   - Error rate > 5%
   - Request rate exceeds threshold
   - KV errors

## Troubleshooting

### Flags Not Updating

1. **Check cache:** Clear browser localStorage

   ```js
   localStorage.removeItem("portfolio:feature-flags");
   ```

2. **Check KV:** Verify flags are set correctly

   ```bash
   npm run kv:get
   ```

3. **Check propagation:** Wait up to 60 seconds for global KV propagation

4. **Clear CDN cache:** Flags endpoint is cached for 1 minute

### CORS Errors

1. Check `ALLOWED_ORIGINS` environment variable in Worker
2. Verify origin is in the allowed list
3. Check browser console for specific CORS error

### Rate Limit Exceeded

- Wait 1 minute before retrying
- Increase `RATE_LIMIT_MAX` in Worker code if legitimate traffic
- Check for potential DDoS or bot traffic

### Worker Errors

1. Check Worker logs: `npm run tail`
2. Verify KV namespace binding is correct
3. Verify API key is set: `wrangler secret list`
4. Check Worker metrics in Dashboard

## Cost Estimates

### Cloudflare Workers

- **Free tier:** 100,000 requests/day
- **Paid plan:** $5/month for 10M requests
- **Estimated cost:** $0/month (well within free tier)

### KV Storage

- **Free tier:** 1GB storage, 100,000 reads/day
- **Paid reads:** $0.50 per million reads
- **Estimated cost:** $0/month (minimal storage, low read volume)

### Total Estimated Cost

**$0/month** (free tier sufficient)

## Adding New Flags

To add a new feature flag:

### 1. Update TypeScript Types

Edit `src/types/featureFlags.ts`:

```typescript
export interface FeatureFlags {
  contactForm: ContactFormFlags;
  newFeature: NewFeatureFlags; // Add new flag
}

export interface NewFeatureFlags {
  enabled: boolean;
  // Add other properties as needed
}
```

### 2. Update Worker Type Guard

Edit `workers/feature-flags/src/index.ts` in `isValidFeatureFlags()`:

```typescript
// Add validation for new flag
if (typeof flags.newFeature !== "object" || flags.newFeature === null) {
  return false;
}
// ... validate properties
```

### 3. Update Default Flags

Update `DEFAULT_FLAGS` in both:

- `src/types/featureFlags.ts`
- `workers/feature-flags/src/index.ts`

```typescript
const DEFAULT_FLAGS: FeatureFlags = {
  contactForm: { enabled: false },
  newFeature: { enabled: false }, // Add default
};
```

### 4. Create Custom Hook (Optional)

```typescript
// src/state/contexts/FeatureFlagContext.tsx
export function useNewFeatureFlag() {
  const { flags } = useFeatureFlags();
  return flags.newFeature;
}
```

### 5. Update Documentation

Update this file with the new flag's description and usage examples.

## Best Practices

1. **Always use safe defaults:** Flags should default to `false` (disabled)
2. **Test before enabling:** Verify flag changes in staging first
3. **Monitor after changes:** Watch error rates and logs after toggling flags
4. **Keep flags temporary:** Remove flag infrastructure once feature is stable
5. **Document flag purpose:** Add comments explaining why each flag exists
6. **Use feature-specific flags:** Avoid generic "enabled" flags
7. **Cache invalidation:** Remember 1-minute cache when planning rollouts

## References

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [React Context API](https://react.dev/reference/react/useContext)
