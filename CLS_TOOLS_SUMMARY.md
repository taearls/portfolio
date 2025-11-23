# CLS Diagnostic Tooling - Quick Reference

## 🚀 Quick Start

### Measure CLS (Production Build)
```bash
npm run measure:cls
```

### Measure CLS (Development, Fast)
```bash
npm run measure:cls:dev
```

### Run CLS Tests
```bash
npm run test:cls
```

---

## 📦 What Was Added

### 1. Lighthouse Measurement Script
**File:** `scripts/measure-cls.mjs`
- Automated CLS measurement across multiple pages and viewports
- Uses Google Lighthouse CLI for accuracy
- Generates console reports and JSON files
- Exit code for CI/CD integration

### 2. Runtime CLS Monitor
**File:** `src/util/clsMonitor.ts`
- Real-time layout shift tracking during development
- Visual debugging with red overlays on shifted elements
- Console logging with detailed shift sources
- Based on Web Vitals library

### 3. Cypress CLS Tests
**File:** `tests/integration/specs/cls-measurement.cy.ts`
- Automated tests using Layout Instability API
- Tests all pages on desktop and mobile
- Reports shift sources when threshold exceeded

### 4. New NPM Scripts
**Added to `package.json`:**
- `measure:cls` - Full production measurement
- `measure:cls:mobile` - Mobile viewports only
- `measure:cls:desktop` - Desktop viewports only
- `measure:cls:dev` - Quick dev check (no build)
- `test:cls` - Run CLS Cypress tests

### 5. Documentation
**Files:**
- `docs/CLS_DIAGNOSTICS.md` - Comprehensive guide
- `scripts/README.md` - Script usage reference
- `CLS_TOOLS_SUMMARY.md` - This file (quick reference)

### 6. Dependencies
**Added:**
- `web-vitals@^5.1.0` - Core Web Vitals measurement library

---

## 🔧 Tool Comparison

| Tool | Purpose | Speed | Accuracy | When to Use |
|------|---------|-------|----------|-------------|
| **Lighthouse Script** | Production validation | Slow | Highest | Final checks, CI/CD |
| **Runtime Monitor** | Interactive debugging | Fast | Good | Development, finding sources |
| **Cypress Tests** | Automated regression | Medium | Good | CI/CD, quick validation |

---

## 🎯 Typical Workflow

### 1. Baseline Measurement
```bash
npm run measure:cls
```
Establishes current CLS scores across all pages/viewports.

### 2. Enable Runtime Monitoring
Add to `src/main.tsx`:
```typescript
import { initCLSMonitor } from '@/util/clsMonitor';

if (import.meta.env.DEV) {
  initCLSMonitor({
    debug: true,
    visualDebug: true,
    threshold: 0.1
  });
}
```

### 3. Identify Issues
- Watch console for shift events
- Look for red overlays on shifted elements
- Note `sources` in console logs

### 4. Implement Fixes
Common fixes:
- Add `width`, `height`, `aspect-ratio` to images
- Use `font-display: optional` for fonts
- Reserve space with `min-height` for dynamic content
- Add `contain: layout` to CSS

### 5. Verify Fixes
```bash
npm run measure:cls:dev  # Quick check
npm run measure:cls      # Full validation
```

### 6. Add Tests
Update or create tests in `tests/integration/specs/` to prevent regressions.

---

## 📊 Understanding CLS Scores

| Score | Rating | Symbol |
|-------|--------|--------|
| 0 - 0.1 | Good | ✅ |
| 0.1 - 0.25 | Needs Improvement | ⚠️ |
| > 0.25 | Poor | 🔴 |

**Target:** All pages should have CLS < 0.1 on all viewports.

---

## 🐛 Common Issues & Fixes

### Issue: High CLS on mobile but not desktop
**Likely cause:** Images without explicit dimensions
**Fix:**
```tsx
<CloudinaryImage
  width={800}
  height={600}
  loading="eager"  // For LCP images
  fetchPriority="high"  // For LCP images
/>
```

### Issue: Shift when fonts load
**Likely cause:** FOIT (Flash of Invisible Text)
**Fix:**
```css
@font-face {
  font-family: 'CustomFont';
  font-display: optional;
}
```
And/or preload critical fonts in HTML:
```html
<link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin>
```

### Issue: Shift when images load
**Likely cause:** Missing aspect-ratio
**Fix:**
```css
img {
  aspect-ratio: attr(width) / attr(height);
  width: 100%;
  height: auto;
}
```

---

## 📚 Additional Resources

- **Full Guide:** `docs/CLS_DIAGNOSTICS.md`
- **Script Docs:** `scripts/README.md`
- **Web.dev CLS Guide:** https://web.dev/cls/
- **Optimize CLS:** https://web.dev/optimize-cls/

---

## 🔍 Next Steps

1. **Run baseline measurement:**
   ```bash
   npm run measure:cls
   ```

2. **Review reports in `reports/` directory**

3. **If CLS > 0.1, enable runtime monitoring**

4. **Fix identified issues**

5. **Verify fixes and commit**

6. **Add to CI/CD pipeline:**
   ```yaml
   - name: Measure CLS
     run: npm run measure:cls
   ```
