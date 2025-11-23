# CLS Diagnostic Tooling Guide

Comprehensive guide for measuring and debugging Cumulative Layout Shift (CLS) in the portfolio website.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Diagnostic Tools Overview](#diagnostic-tools-overview)
3. [Measurement Scripts](#measurement-scripts)
4. [Runtime Monitoring](#runtime-monitoring)
5. [Cypress Tests](#cypress-tests)
6. [Interpreting Results](#interpreting-results)
7. [Debugging Workflow](#debugging-workflow)

---

## Quick Start

### Measure CLS with Lighthouse (Recommended)

```bash
# Measure CLS on all pages and viewports (production build)
npm run measure:cls

# Mobile only
npm run measure:cls:mobile

# Desktop only
npm run measure:cls:desktop

# Quick check during development (no build)
npm run measure:cls:dev
```

### Run CLS-specific Cypress tests

```bash
npm run test:cls
```

### Enable runtime CLS monitoring (development)

Add to your `src/main.tsx`:

```typescript
import { initCLSMonitor } from '@/util/clsMonitor';

if (import.meta.env.DEV) {
  initCLSMonitor({
    debug: true,           // Console logging
    visualDebug: true,     // Visual highlighting of shifted elements
    threshold: 0.1
  });
}
```

---

## Diagnostic Tools Overview

### 1. **Lighthouse Script** (`scripts/measure-cls.mjs`)
- **Purpose:** Gold standard CLS measurement using Google Lighthouse
- **When to use:** Production builds, CI/CD, final validation
- **Output:** Console table + JSON report in `reports/` directory
- **Pros:** Most accurate, matches real-world metrics
- **Cons:** Slower (requires full Lighthouse run per test)

### 2. **Runtime Monitor** (`src/util/clsMonitor.ts`)
- **Purpose:** Real-time CLS tracking during development
- **When to use:** Interactive debugging, identifying shift sources
- **Output:** Console logs + visual overlays
- **Pros:** Immediate feedback, pinpoints problematic elements
- **Cons:** Development only, slight performance overhead

### 3. **Cypress Tests** (`tests/integration/specs/cls-measurement.cy.ts`)
- **Purpose:** Automated CLS testing using Layout Instability API
- **When to use:** CI/CD, regression testing
- **Output:** Cypress test results with pass/fail assertions
- **Pros:** Fast, integrates with existing test suite
- **Cons:** Less comprehensive than Lighthouse

---

## Measurement Scripts

### Lighthouse CLS Measurement

**Script location:** `scripts/measure-cls.mjs`

**Configuration:**
- CLS Threshold: 0.1 (good) / 0.25 (poor)
- Default pages: Home, Code, Contact
- Default viewports: iPhone 13, Pixel 5, Desktop, Tablet

**CLI Options:**
```bash
# Custom URL
npm run measure:cls -- --url=http://localhost:4173/code

# Mobile only
npm run measure:cls -- --mobile-only

# Desktop only
npm run measure:cls -- --desktop-only

# Verbose output (shows Lighthouse command)
npm run measure:cls -- --verbose
```

**Output Format:**

```
🔍 CLS Measurement Suite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base URL: http://localhost:4173
Pages: Home, Code, Contact
Viewports: Mobile (iPhone 13), Mobile (Pixel 5), Desktop, Tablet
Total tests: 12
CLS Threshold: 0.1 (good), 0.25 (poor)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Testing Home - Mobile (iPhone 13)... (1/12)
✅ Home - Mobile (iPhone 13)                     CLS: 0.085
⏳ Testing Home - Mobile (Pixel 5)... (2/12)
⚠️  Home - Mobile (Pixel 5)                      CLS: 0.127
...

📊 Results Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Home
────────────────────────────────────────────────────────────────────────────────
  ✅ Mobile (iPhone 13)            CLS: 0.085 (GOOD)
  ⚠️  Mobile (Pixel 5)              CLS: 0.127 (NEEDS IMPROVEMENT)
  ✅ Desktop                        CLS: 0.042 (GOOD)
  ✅ Tablet                         CLS: 0.063 (GOOD)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Passed: 10/12
🔴 Failed: 2/12

📈 Statistics:
   Average CLS: 0.091
   Best CLS: 0.042
   Worst CLS: 0.271
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Detailed report saved: reports/cls-report-2025-11-23T20-54-07-259Z.json
```

**JSON Report Structure:**
```json
{
  "timestamp": "2025-11-23T20:54:07.259Z",
  "baseUrl": "http://localhost:4173",
  "threshold": 0.1,
  "summary": {
    "total": 12,
    "passed": 10,
    "failed": 2,
    "avgCLS": 0.091,
    "worstCLS": 0.271,
    "bestCLS": 0.042
  },
  "results": [...]
}
```

---

## Runtime Monitoring

### Setup

**1. Import and initialize in `src/main.tsx`:**

```typescript
import { initCLSMonitor, logCLSSummary } from '@/util/clsMonitor';

if (import.meta.env.DEV) {
  const monitor = initCLSMonitor({
    debug: true,           // Enable console logging
    visualDebug: true,     // Visual highlighting
    threshold: 0.1,        // "Good" threshold

    // Optional callbacks
    onShift: (entry) => {
      console.log('Layout shift detected:', entry.value);
    },
    onFinal: (cls) => {
      console.log('Final CLS:', cls);
    }
  });

  // Expose to window for console access
  window.__CLS_MONITOR__ = monitor;

  // Add keyboard shortcut to log summary
  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
      logCLSSummary();
    }
  });
}
```

### Console Output

When a layout shift occurs:

```
🔍 CLS Monitor initialized { threshold: 0.1, visualDebug: true }
✅ CLS Update: {
  value: '0.0423',
  threshold: 0.1,
  rating: 'good',
  numEntries: 1
}
  Shift #1: {
    value: '0.0423',
    time: '1523',
    sources: [
      {
        node: 'IMG.profile-image',
        previousRect: { width: '0', height: '0', x: '150', y: '200' },
        currentRect: { width: '400', height: '400', x: '150', y: '200' }
      }
    ]
  }
```

### Visual Debugging

When `visualDebug: true`, shifted elements get:
- Red border overlay
- Red label showing shift value
- 3-second fade-out animation

### Console API

Access the monitor from the browser console:

```javascript
// Get current CLS score
window.__CLS_MONITOR__.getCLS()
// => 0.0423

// Get all recorded shifts
window.__CLS_MONITOR__.getShifts()
// => [{ value: 0.0423, entries: [...], timestamp: 1700000000 }]

// Reset measurements
window.__CLS_MONITOR__.reset()

// Log summary table
logCLSSummary()
```

---

## Cypress Tests

### CLS Measurement Test

**File:** `tests/integration/specs/cls-measurement.cy.ts`

Tests CLS across all pages on both desktop and mobile viewports using the Layout Instability API.

**Run:**
```bash
npm run test:cls
```

**What it does:**
1. Injects Layout Instability API observer before page load
2. Tracks all layout shifts (excluding user-input shifts)
3. Asserts CLS < 0.1 threshold
4. Logs shift sources if threshold exceeded

**Example output:**
```
CLS Measurement
  Home Page
    ✓ should have CLS < 0.1 on desktop (2453ms)
    ✗ should have CLS < 0.1 on mobile (2108ms)
      AssertionError: Mobile CLS should be < 0.1: expected 0.271 to be below 0.1
    ✓ should report layout shift sources if CLS > threshold (2234ms)

      ⚠️ CLS THRESHOLD EXCEEDED: 0.2710
      Number of shifts: 2
      Shift #1: 0.0423 at 1523ms
        Source #1: IMG.profile-image
      Shift #2: 0.2287 at 2341ms
        Source #1: DIV.project-grid
```

### CLS Optimization Tests

**File:** `tests/integration/specs/cls-optimization.cy.ts`

Structural tests verifying CLS prevention attributes are present.

---

## Interpreting Results

### CLS Score Ranges

| Score    | Rating              | Status |
|----------|---------------------|--------|
| 0 - 0.1  | Good ✅             | Pass   |
| 0.1 - 0.25 | Needs Improvement ⚠️ | Warning |
| > 0.25   | Poor 🔴             | Fail   |

### Common Layout Shift Sources

1. **Images without dimensions**
   - Symptom: Shift when image loads
   - Fix: Add `width`, `height`, `aspect-ratio`

2. **Web fonts (FOIT/FOUT)**
   - Symptom: Shift when font loads
   - Fix: `font-display: optional`, preload fonts, use fallback metrics

3. **Dynamically injected content**
   - Symptom: Shift when ads/embeds load
   - Fix: Reserve space with `min-height`

4. **Animations without transforms**
   - Symptom: Shifts during animation
   - Fix: Use `transform`/`opacity` instead of layout properties

5. **CSS loaded late**
   - Symptom: Flash of unstyled content
   - Fix: Critical CSS inline, preload stylesheets

### Reading Shift Sources

```javascript
{
  node: 'IMG.profile-image',
  previousRect: { width: '0', height: '0', x: '150', y: '200' },
  currentRect: { width: '400', height: '400', x: '150', y: '200' }
}
```

- **node**: Element that shifted (tag + classes)
- **previousRect**: Position/size before shift
- **currentRect**: Position/size after shift
- **Delta**: currentRect - previousRect = actual movement

---

## Debugging Workflow

### Step 1: Measure Baseline

```bash
# Get current CLS scores
npm run measure:cls:mobile
```

Identify which pages/viewports fail.

### Step 2: Enable Runtime Monitoring

Edit `src/main.tsx`:
```typescript
if (import.meta.env.DEV) {
  initCLSMonitor({ debug: true, visualDebug: true, threshold: 0.1 });
}
```

Start dev server:
```bash
npm run dev
```

### Step 3: Identify Shift Sources

1. Navigate to problematic page
2. Watch console for shift events
3. Note which elements have red overlays
4. Check `sources` array for specific nodes

### Step 4: Fix Root Causes

Common fixes based on shift source:

**Images:**
```tsx
<img
  src="..."
  alt="..."
  width={800}
  height={600}
  style={{ aspectRatio: '800 / 600' }}
  loading="eager"  // If LCP image
  fetchpriority="high"  // If LCP image
  decoding="async"
/>
```

**Fonts:**
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: optional; /* Prevents FOIT/FOUT */
}
```

**Dynamic content:**
```css
.dynamic-container {
  min-height: 300px; /* Reserve space */
}
```

**CSS containment:**
```css
img, .card, .section {
  contain: layout; /* Isolate layout impact */
}
```

### Step 5: Verify Fix

```bash
# Quick check
npm run measure:cls:dev

# Full validation
npm run measure:cls
```

### Step 6: Add Regression Test

Update `tests/integration/specs/cls-measurement.cy.ts` if needed.

---

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Measure CLS
  run: npm run measure:cls

- name: Upload CLS Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: cls-report
    path: reports/cls-report-*.json
```

### Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
npm run measure:cls:dev || echo "⚠️  Warning: CLS threshold exceeded"
```

---

## Troubleshooting

### Lighthouse fails with connection error

**Solution:** Ensure server is running before measurement
```bash
# Start server manually in separate terminal
npm run preview

# Then run measurement
node scripts/measure-cls.mjs
```

### "npx lighthouse" not found

**Solution:** Install Lighthouse globally or locally
```bash
npm install -g lighthouse
# OR
npm install --save-dev lighthouse
```

### CLS scores inconsistent between runs

**Causes:**
- Network timing variations
- External resources (CDN latency)
- Cache effects

**Solutions:**
- Run multiple times, take average
- Use production build (`npm run build`)
- Disable browser extensions
- Use consistent network conditions

### Runtime monitor not showing shifts

**Check:**
1. `initCLSMonitor()` called before app render
2. Console has no errors
3. Using development build (not production)
4. Browser DevTools open (for console output)

---

## Additional Resources

- [Web.dev: Cumulative Layout Shift](https://web.dev/cls/)
- [Web.dev: Optimize CLS](https://web.dev/optimize-cls/)
- [Layout Instability API](https://wicg.github.io/layout-instability/)
- [Lighthouse CLS Audit](https://web.dev/lighthouse-cumulative-layout-shift/)
- [Chrome DevTools: Measure CLS](https://developer.chrome.com/docs/devtools/performance/cls/)
