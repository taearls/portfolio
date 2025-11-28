# Feature Flags Worker - Environment Configuration

This document describes how environments are configured for the Feature Flags Worker following Cloudflare best practices.

## Environment Overview

| Environment | Worker Name | KV Namespace ID | Feature Flag Status |
|-------------|-------------|-----------------|---------------------|
| **Development** (local) | N/A (local only) | `790d0a984ac748aaae24cba1038901cb` | `enabled: true` |
| **Staging** | `feature-flags-staging` | `61745c6979e34b23bd2d6812f81d5707` | `enabled: true` |
| **Production** | `feature-flags` | `55a586e168e54566bcfb0a1e6dd11f88` | `enabled: false` |

## How Environments Work

### Local Development
- **Command**: `npm run dev` or `wrangler dev`
- **Uses**: `preview_id` from wrangler.toml
- **KV Namespace**: Development namespace (`790d0a98...`)
- **Purpose**: Safe local testing without affecting production data

### Staging Deployment
- **Command**: `wrangler deploy --env staging`
- **Worker Name**: `feature-flags-staging`
- **KV Namespace**: Staging namespace (`61745c69...`)
- **Purpose**: Testing in a production-like environment

### Production Deployment
- **Command**: `wrangler deploy`
- **Worker Name**: `feature-flags`
- **KV Namespace**: Production namespace (`55a586e1...`)
- **Purpose**: Live production environment

## Updating Feature Flags

### Development Environment
```bash
npx wrangler kv key put --remote --namespace-id=790d0a984ac748aaae24cba1038901cb feature_flags '{"email-contact-form":{"enabled":true}}'
```

### Staging Environment
```bash
npx wrangler kv key put --remote --namespace-id=61745c6979e34b23bd2d6812f81d5707 feature_flags '{"email-contact-form":{"enabled":true}}'
```

### Production Environment
```bash
npx wrangler kv key put --remote --namespace-id=55a586e168e54566bcfb0a1e6dd11f88 feature_flags '{"email-contact-form":{"enabled":false}}'
```

## Configuration Structure

The `wrangler.toml` follows Cloudflare's recommended pattern:

- **Top-level configuration**: Production (default deployment target)
- **`preview_id`**: Points to development namespace for local dev safety
- **Named environments**: `[env.staging]` creates a separate worker instance

This ensures:
1. Production data is never accidentally modified during development
2. Each environment is isolated with its own KV storage
3. Configuration is version-controlled and auditable
