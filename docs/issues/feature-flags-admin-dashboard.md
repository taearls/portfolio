# feat: Add feature flags admin dashboard page

## Summary

Add a simple admin dashboard page at `/admin/flags` that provides a visual overview of all feature flags and their current states. This addresses the need for a quick, at-a-glance view of feature flag configuration without accessing the Cloudflare dashboard or running CLI commands.

## Motivation

Currently, viewing feature flags requires either:

- Accessing the Cloudflare KV dashboard (shows raw JSON)
- Running `npm run flags:list` in the terminal
- Reading the `flipt.yaml` file directly

A simple UI would make it easier to:

- Quickly verify flag states during development
- Debug feature flag issues in production
- Provide visibility to non-technical stakeholders

## Proposed Implementation

### Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    /admin/flags page                        │
├─────────────────────────────────────────────────────────────┤
│  Fetches from existing Worker API:                          │
│  GET /api/flags → Returns current flag configuration        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Feature Flags Dashboard                             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Flag Name              │ Status  │ Description     │   │
│  │  ───────────────────────┼─────────┼─────────────────│   │
│  │  email-contact-form     │ ✅ ON   │ Contact form    │   │
│  │  dark-mode-toggle       │ ✅ ON   │ Theme toggle    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Last fetched: 2 seconds ago    [Refresh]                   │
└─────────────────────────────────────────────────────────────┘
```

### Components to Create

1. **`/src/pages/AdminFlagsPage.tsx`**
   - Main page component
   - Fetches flags using existing `useFeatureFlags()` hook
   - Displays flags in a table format
   - Shows loading/error states
   - Manual refresh button

2. **`/src/components/FlagStatusBadge/FlagStatusBadge.tsx`**
   - Visual indicator component (green/red badge)
   - Displays enabled/disabled status

3. **Route configuration**
   - Add `/admin/flags` route in React Router config

### UI Requirements

- **Read-only view** (Phase 1) - no toggle functionality
- **Responsive design** using existing TailwindCSS
- **Dark mode support** via existing theme system
- **Loading state** while fetching flags
- **Error handling** with retry option
- **Auto-refresh indicator** showing cache age

### Data Display

For each flag, show:

| Field          | Source                     |
| -------------- | -------------------------- |
| Flag key       | `flipt.yaml` + runtime API |
| Enabled status | Runtime API response       |
| Description    | `flipt.yaml`               |
| Type           | Build-time vs Runtime      |
| Last updated   | Cache timestamp            |

### Security Considerations

**Phase 1 (MVP):**

- Page is publicly accessible but read-only
- No sensitive data exposed (flags are already public via API)

**Phase 2 (Future):**

- Add authentication for admin routes
- Add toggle functionality with auth protection
- Audit logging for flag changes

## Technical Details

### Existing Infrastructure to Leverage

- **`useFeatureFlags()` hook** - Already fetches from Worker
- **`FeatureFlagContext`** - Provides flag state
- **`flipt.yaml`** - Source of truth for descriptions
- **TailwindCSS** - Styling
- **React Router** - Routing

### New Dependencies

None required - uses existing stack.

### File Structure

```text
src/
├── pages/
│   └── AdminFlagsPage/
│       ├── AdminFlagsPage.tsx
│       ├── AdminFlagsPage.module.css
│       └── index.ts
├── components/
│   └── FlagStatusBadge/
│       ├── FlagStatusBadge.tsx
│       └── FlagStatusBadge.module.css
```

## Acceptance Criteria

- [ ] `/admin/flags` route exists and is accessible
- [ ] Page displays all feature flags from the Worker API
- [ ] Each flag shows: name, status (enabled/disabled), description
- [ ] Visual distinction between enabled (green) and disabled (red) flags
- [ ] Loading spinner shown while fetching
- [ ] Error state with retry button if fetch fails
- [ ] Manual refresh button to re-fetch flags
- [ ] Page works in both light and dark mode
- [ ] Responsive layout for mobile/desktop
- [ ] Unit tests for new components

## Out of Scope (Future Enhancements)

- Toggle functionality (requires auth)
- Flag editing/creation
- Historical flag changes
- Environment switching (dev/staging/prod)
- Build-time flag visualization (from `flipt.yaml`)

## Related Files

- `packages/feature-flags/src/index.ts` - Worker API
- `src/hooks/useFeatureFlags.ts` - Existing hook
- `src/providers/FeatureFlagProvider.tsx` - Context provider
- `flipt.yaml` - Flag configuration
- `packages/shared-types/src/index.ts` - Type definitions
