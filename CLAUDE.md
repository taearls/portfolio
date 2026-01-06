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

#### Test Architecture Overview

- **Unit tests** (Vitest): Run in jsdom environment, focus on isolated logic
- **Integration tests** (Cypress): Run against dev server on port 4173, test user journeys
- **Test files**: `.test.ts` or `.spec.tsx` naming convention
- **Component tests**: Use Testing Library utilities

**Current test counts** (as of Jan 2026):

- Unit tests: 288 tests (14 test files)
- Integration tests: 74 tests (5 spec files)

#### Parametrized Test Matrix Pattern

Integration tests use a `FLAG_TEST_MATRIX` pattern for comprehensive feature flag coverage. This ensures all flag states are tested without code duplication.

```typescript
// tests/integration/support/test-matrix.ts
export const FLAG_TEST_MATRIX: Array<FlagTestScenario> = [
  {
    id: "enabled",
    description: "Feature flag enabled - form visible and functional",
    flags: { "email-contact-form": { enabled: true } },
    expectations: { formVisible: true, showsMessage: false },
  },
  {
    id: "disabled",
    description: "Feature flag disabled with custom message",
    flags: {
      "email-contact-form": {
        enabled: false,
        message: "Contact form is temporarily unavailable.",
      },
    },
    expectations: {
      formVisible: false,
      showsMessage: true,
      messageText: "Contact form is temporarily unavailable.",
    },
  },
];

// Usage in tests:
forEachScenario((scenario) => {
  it(`${scenario.description}`, () => {
    cy.setFlagsCache(scenario.flags);
    cy.visit("/contact");
    // Assert based on scenario.expectations
  });
});
```

**Benefits:**

- Single source of truth for all flag states
- Self-documenting - reading matrix shows expected outcomes
- Easy to extend - add new flag state = add one object
- Clear test output - reports each flag state separately

#### Adding a New Flag State

1. Add entry to `FLAG_TEST_MATRIX` in `tests/integration/support/test-matrix.ts`
2. Define expected outcomes in `expectations` object
3. Tests automatically run with new configuration

#### Unit vs Integration Test Guidelines

**Use Unit Tests for:**

- State machine logic (XState)
- Pure utility functions with edge cases
- Loading/error states hard to trigger in integration
- Rapid state transitions
- localStorage/cache error handling
- Component behavior with mocked dependencies

**Use Integration Tests for:**

- Feature flag conditional rendering
- Form validation and submission flows
- User interactions (clicks, typing, navigation)
- Accessibility attributes and ARIA compliance
- API integration and error handling
- Full user journeys across pages

#### Tests Kept at Unit Level

| File                          | Rationale                                 |
| ----------------------------- | ----------------------------------------- |
| `feature-flags.util.test.ts`  | Cache edge cases, localStorage errors     |
| `FeatureFlagWrapper.test.tsx` | Loading states, whenLoading prop behavior |
| `AdminFlagsPage.test.tsx`     | Loading/error UI states                   |
| `ErrorBoundary.test.tsx`      | Error boundary behavior, error catching   |
| `themeMachine.test.ts`        | State machine transitions                 |
| `ActionButton.test.tsx`       | Loading states, async onClick handling    |
| `useOnPropChange.test.ts`     | Hook behavior with prop changes           |
| `styling.utils.test.ts`       | Pure utility function coverage            |

#### Testing Best Practices

**⚠️ Never use explicit timeouts in test logic:**

- Avoid `cy.get(selector, { timeout: N })` in Cypress tests
- Avoid `setTimeout`, `sleep`, or similar timing functions in any tests
- Both Cypress and Vitest have built-in retry mechanisms that handle timing automatically
- Rely on default retry behavior rather than hardcoding wait times
- If a test needs more time, configure global timeout settings in the test framework config, not in individual tests

**Why?**

- Explicit timeouts make tests brittle and environment-dependent
- They create false positives/negatives based on machine speed
- They increase test execution time unnecessarily
- Framework retry logic is more reliable and maintainable

#### Cypress Custom Commands

Custom commands are defined in `tests/integration/support/support.ts`:

- `cy.setFlagsCache(flags, timestamp?)` - Pre-populate localStorage with flag configuration
- `cy.stubTurnstile()` - Mock Turnstile CAPTCHA for form tests
- `cy.fillContactForm({ name, email, message })` - Fill contact form fields
- `cy.waitForFormReady()` - Wait for form and Turnstile to be ready
- `cy.waitForTurnstile()` - Wait for Turnstile token

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
/>;
```

**Available flags:**

- `contactForm` - Controls contact form visibility ({ enabled: boolean, message?: string })

## XState Integration

State machines live in `/src/state/machines/` and are consumed via React contexts in `/src/state/contexts/`. The pattern uses XState's actor model:

1. Define machine in `/machines/` (e.g., `themeMachine.ts`)
2. Create context provider wrapping `createActorContext`
3. Export hooks for accessing state and sending events

Example: `ThemeContext` wraps `themeMachine` and provides `useTheme()` hook.
