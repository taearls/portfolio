# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Tyler Earls' portfolio website built with React, Vite, TailwindCSS, and React Router. The project uses TypeScript throughout and follows a component-based architecture with XState for state management.

## Essential Commands

### Development

- `npm run dev` - Start development server with Vite on port 3000 (auto-opens browser)
- `npm run dev:flags` - Start Cloudflare Worker for feature flags locally (port 8787)
- `npm run dev:all` - Run both React app and feature flags Worker concurrently
- `npm run build` - Build for production (runs TypeScript compiler first, then Vite)
- `npm run preview` - Preview production build locally

### Testing

- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:vitest:ui` - Open Vitest UI for interactive testing
- `npm run test:integration` - Run Cypress integration tests (headless)
- `npm run test:cypress:open` - Open Cypress test runner (interactive)
- `npm run test:all` - Run both unit and integration tests

### Code Quality

- `npm run lint:check` - Check ESLint issues
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run oxlint:check` - Run OxLint checks (faster alternative linter)
- `npm run oxlint:fix` - Auto-fix OxLint issues
- `npm run format:check` - Check Prettier formatting
- `npm run format:fix` - Auto-fix formatting with Prettier
- `npm run ci` - Run all quality checks (lint, format, test, build) - used in CI/CD

### Deployment

- `npm run deploy:flags` - Deploy feature flags Worker to Cloudflare

## Architecture

### Core Technologies

- **Build Tool**: Vite with React plugin
- **Framework**: React 19 with React Router 7
- **Styling**: TailwindCSS with CSS Modules for component-specific styles
- **State Management**: XState with React bindings (actor context pattern)
- **TypeScript**: Strict configuration with separate configs for app/node/tests
- **Testing**: Vitest for unit tests, Cypress for integration tests

### Monorepo Structure

This project uses **npm workspaces** for managing multiple packages:

- **Root** - Main React application
- **`packages/shared-types/`** - Shared TypeScript types between React app and Worker
- **`packages/feature-flags/`** - Cloudflare Worker for feature flags (KV storage, CORS, caching)

### Project Structure

- `/src/components/` - React components organized by feature
  - Layout components in `/layout/`
  - Navigation components in `/navigation/`
  - Individual UI components with their own folders
  - CSS Modules use `.module.css` extension
- `/src/pages/` - Page components for routing
- `/src/state/` - State management with XState
  - `/contexts/` - React contexts (ThemeContext, FeatureFlagContext use XState actors)
  - `/machines/` - XState state machines (themeMachine, navigationMachine)
- `/src/hooks/` - Custom React hooks
- `/src/util/` - Utility functions and constants (includes `API_URIS`, `BASE_URLS`)
- `/src/types/` - TypeScript type definitions
- `/tests/` - Test files organized by type
  - `/unit/` - Unit tests with Vitest
  - `/integration/` - Cypress E2E tests
  - `/component/` - Component-specific tests
- `/packages/` - Workspace packages
  - `/feature-flags/` - Cloudflare Worker (wrangler.toml, KV namespaces)
  - `/shared-types/` - Shared types for feature flags

### Key Patterns

- **Path Aliasing**: `@/` maps to `/src/` directory
- **CSS Modules**: Component styles use camelCase conversion (e.g., `styles.myClass`)
- **State Machines**: XState for complex state logic (theme toggling, navigation)
- **Feature Flags**: Runtime configuration via Cloudflare Worker + KV
  - Use `FeatureFlagWrapper` component for conditional rendering
  - Feature flags fetched from Worker, cached in localStorage (60s TTL)
  - Flags configured in Worker's KV namespace
- **Image Optimization**: Cloudinary integration for optimized image delivery
- **Performance Monitoring**: Why Did You Render development tool integrated (dev only)
- **React Compiler**: Babel plugin for automatic memoization (compilationMode: "infer")

### Testing Strategy

- Unit tests run in jsdom environment
- Integration tests use Cypress with a local dev server on port 4173
- Test files follow `.test.ts` or `.spec.tsx` naming convention
- Component tests use Testing Library utilities

### Development Notes

- React Router configured for client-side only (SSR disabled)
- Vite dev server runs on port 3000
- CSS modules generate scoped class names (hash-based in production)
- ESLint uses flat config format (eslint.config.mts)
- Two linters: ESLint (comprehensive) and OxLint (faster alternative)

## Feature Flags System

### Architecture

The feature flags system uses a **Cloudflare Worker + KV** architecture:

1. **Worker** (`packages/feature-flags/`) serves flags via `/api/flags` endpoint
2. **KV Storage** holds flag configuration as JSON
3. **React Context** (`FeatureFlagContext`) fetches and caches flags
4. **Shared Types** (`packages/shared-types/`) ensure type safety across stack

### Managing Feature Flags

**Update a flag value:**
```bash
npx wrangler kv key put --binding=FEATURE_FLAGS --preview false "flags" \
  '{"contactForm":{"enabled":true}}' \
  --config packages/feature-flags/wrangler.toml
```

**Deploy Worker changes:**
```bash
npm run deploy:flags
```

**Environment variables:**
- Development: `.env.development` → `VITE_FEATURE_FLAGS_API_URL=http://localhost:8787/api/flags`
- Production: `.env.production` → `VITE_FEATURE_FLAGS_API_URL=https://portfolio-feature-flags.tyler-a-earls.workers.dev/api/flags`

### Using Feature Flags

```tsx
import FeatureFlagWrapper from "@/components/FeatureFlagWrapper/FeatureFlagWrapper.tsx";

<FeatureFlagWrapper
  flagKey="contactForm"
  whenEnabled={<ContactEmailForm />}
  whenDisabled={<ComingSoonMessage />}
  whenLoading={<LoadingSpinner />}
/>
```

**Available flags:**
- `contactForm` - Controls contact form visibility ({ enabled: boolean, message?: string })

## XState Integration

State machines live in `/src/state/machines/` and are consumed via React contexts in `/src/state/contexts/`. The pattern uses XState's actor model:

1. Define machine in `/machines/` (e.g., `themeMachine.ts`)
2. Create context provider wrapping `createActorContext`
3. Export hooks for accessing state and sending events

Example: `ThemeContext` wraps `themeMachine` and provides `useTheme()` hook.
