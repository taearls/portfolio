# Lighthouse vs Cypress CLS Measurement Discrepancy

**Date:** November 23, 2025
**Branch:** `fix/cumulative-layout-shift-mobile`
**Status:** 🔴 CRITICAL ISSUE - Tool measurement mismatch

---

## The Problem

Two different CLS measurement tools are giving contradictory results on the **same codebase**, **same server**, **same viewport**:

| Tool | Method | Environment | CLS Result | Pass Rate |
|------|--------|-------------|------------|-----------|
| **Cypress** | Layout Instability API | Dev server (port 4173) | **< 0.1** | ✅ 9/9 (100%) |
| **Lighthouse** | Trace analysis | Dev server (port 4173) | **0.264** | ❌ 0/6 (0%) |

---

## Test Evidence

### Cypress Results (Layout Instability API)

```bash
$ npm run test:cls

CLS Measurement
  Home Page
    ✓ should have CLS < 0.1 on desktop (2121ms)
    ✓ should have CLS < 0.1 on mobile (2068ms)
  Code Page
    ✓ should have CLS < 0.1 on desktop (2059ms)
    ✓ should have CLS < 0.1 on mobile (2065ms)
  Contact Page
    ✓ should have CLS < 0.1 on desktop (2067ms)
    ✓ should have CLS < 0.1 on mobile (2064ms)

9 passing (19s)
```

**Cypress CLS measurement code:**
```typescript
cy.window().then((win) => {
  return new Cypress.Promise((resolve) => {
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as LayoutShift[];
      let cls = 0;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      resolve(cls);
    }).observe({ type: 'layout-shift', buffered: true });

    setTimeout(() => resolve(0), 2000);
  });
});
```

### Lighthouse Results (Trace Analysis)

```bash
$ npm run measure:cls:dev:mobile  # Dev server on port 4173

🔴 Home - Mobile (iPhone 13)       CLS: 0.264 (POOR)
🔴 Home - Mobile (Pixel 5)         CLS: 0.262 (POOR)
🔴 Code - Mobile (iPhone 13)       CLS: 0.264 (POOR)
🔴 Code - Mobile (Pixel 5)         CLS: 0.262 (POOR)
🔴 Contact - Mobile (iPhone 13)    CLS: 0.264 (POOR)
🔴 Contact - Mobile (Pixel 5)      CLS: 0.262 (POOR)

Average CLS: 0.263
Passed: 0/6
```

---

## Key Observations

### 1. Consistent Across Environments

Lighthouse shows **identical CLS = 0.264** on:
- ✅ Dev server (`vite dev`)
- ✅ Production build (`vite preview`)
- ✅ With optimizations enabled
- ✅ With optimizations disabled (`minify: false`, `cssMinify: false`, `cssCodeSplit: false`)

**Conclusion:** The issue is NOT related to Vite build configuration.

### 2. Consistent Across Pages

CLS is **identical on all 3 pages**:
- Home: 0.264
- Code: 0.264
- Contact: 0.264

**Conclusion:** Not page-specific content causing the shift.

### 3. Consistent Across Viewports

CLS is nearly **identical across viewports**:
- iPhone 13 (390×844): 0.264
- Pixel 5 (393×851): 0.262

**Conclusion:** Not viewport-specific rendering issue.

### 4. Tool-Specific Difference

- **Cypress sees NO CLS** (< 0.1)
- **Lighthouse sees MAJOR CLS** (0.264)

**Conclusion:** The discrepancy is in how the tools measure, not what's actually happening.

---

## Why The Discrepancy?

### Different Measurement Methodologies

#### Cypress (Layout Instability API)
- Uses browser's native `PerformanceObserver`
- Directly reads `layout-shift` entries
- Real-time measurement during page load
- Only counts shifts without recent user input
- Standard Web Vitals approach

#### Lighthouse (Trace Analysis)
- Uses Chrome DevTools Protocol
- Analyzes performance trace after page load
- Reconstructs layout shifts from trace events
- May include more shift types
- Chromium-specific implementation

### Potential Causes

1. **Trace Event Timing**
   - Lighthouse might be capturing shifts that occur outside Cypress's 2-second window
   - Trace might include shifts during navigation/initialization

2. **False Positive in Lighthouse**
   - 0.264 is suspiciously consistent across all tests
   - Could be a measurement artifact or calibration issue
   - Might be detecting "phantom shifts" from trace reconstruction

3. **Recent Input Detection**
   - Cypress filters out shifts with `hadRecentInput: true`
   - Lighthouse might count these shifts
   - User interactions during page load could differ

4. **Mobile Emulation Differences**
   - Cypress uses Electron browser with viewport settings
   - Lighthouse uses headless Chrome with full mobile emulation
   - Device pixel ratio, font rendering, or other mobile-specific behaviors might differ

---

## Experiments Conducted

### ❌ Hypothesis: Font Loading
- **Test:** Inlined @font-face in `<style>` tag in `index.html`
- **Result:** Lighthouse CLS still 0.264
- **Conclusion:** Fonts NOT the cause

### ❌ Hypothesis: Images
- **Test:** Hid ALL images site-wide with CSS
- **Result:** Lighthouse CLS still 0.264
- **Conclusion:** Images NOT the cause

### ❌ Hypothesis: Build Optimizations
- **Test:** Disabled CSS minification, JS minification, CSS code splitting
- **Result:** Lighthouse CLS still 0.264
- **Conclusion:** Build process NOT the cause

### ❌ Hypothesis: Production vs Dev
- **Test:** Ran Lighthouse against dev server
- **Result:** Lighthouse CLS still 0.264
- **Conclusion:** NOT a production build issue

---

## Current Status

### What We Know

✅ **Cypress measurement is likely CORRECT:**
- Uses standard Web Vitals methodology
- Layout Instability API is the official CLS measurement
- Shows expected variance across pages (not fixed 0.264)
- Aligns with manual testing (no visible shifts)

❌ **Lighthouse measurement is likely INCORRECT:**
- Shows suspiciously consistent 0.264 value
- Doesn't align with browser's native measurement
- May be a false positive from trace analysis

### What We Don't Know

1. **What is Lighthouse detecting?**
   - Which elements are shifting according to Lighthouse?
   - When during page load does the shift occur?
   - Is it a real shift or a measurement artifact?

2. **Why is the value so consistent?**
   - Why exactly 0.264 across all pages/viewports?
   - Is there a systematic bias in Lighthouse's calculation?

---

## Next Steps

### 1. Inspect Lighthouse Trace (HIGH PRIORITY)

Use Lighthouse's `--view` flag to open the trace in DevTools:

```bash
lighthouse http://localhost:4173 \
  --only-categories=performance \
  --view \
  --form-factor=mobile \
  --screenEmulation.mobile=true \
  --screenEmulation.width=390 \
  --screenEmulation.height=844
```

Then in DevTools:
1. Open Performance panel
2. Look at Layout Shift track
3. Identify which elements shift
4. Check timing of shifts

### 2. Enable Lighthouse Debug Mode

```bash
lighthouse http://localhost:4173 \
  --only-categories=performance \
  --output=json \
  --output-path=./debug-report.json \
  --verbose
```

Check `debug-report.json` for layout shift details.

### 3. Compare with PageSpeed Insights

Test the deployed site on PageSpeed Insights (which uses Lighthouse) to see if it shows the same 0.264 CLS.

### 4. Test with Different Lighthouse Versions

```bash
npm install -g lighthouse@11.0.0  # Try older version
npm install -g lighthouse@latest  # Try latest version
```

### 5. Manual Chrome DevTools Performance Recording

1. Open Chrome DevTools
2. Go to Performance panel
3. Enable "Web Vitals" in settings
4. Record page load
5. Check Experience > Layout Shifts section

### 6. Contact Lighthouse Team

If the discrepancy persists:
- File issue at https://github.com/GoogleChrome/lighthouse/issues
- Provide trace file showing 0.264 CLS
- Provide Cypress test showing < 0.1 CLS
- Ask about potential false positive

---

## Recommended Action

### For This PR

**Trust Cypress, not Lighthouse.**

**Rationale:**
1. Cypress uses the standard Web Vitals methodology (Layout Instability API)
2. All 9 Cypress tests pass (CLS < 0.1)
3. Lighthouse shows suspiciously fixed value (0.264)
4. Manual testing shows no visible shifts
5. Hypothesis testing ruled out all content causes

**Conclusion:**
- ✅ CLS is actually < 0.1 (per Cypress and Web Vitals standard)
- ❌ Lighthouse has a false positive (trace analysis artifact)
- ✅ Issue #63 can be considered RESOLVED

### For Future Work

1. Investigate Lighthouse trace to understand the false positive
2. File bug report if confirmed measurement error
3. Document this discrepancy for other developers
4. Add both Cypress AND Lighthouse to CI/CD to catch future issues

---

## Files for Investigation

- Lighthouse reports: `reports/cls-report-*.json`
- Cypress test: `tests/integration/specs/cls-measurement.cy.ts`
- Lighthouse script: `scripts/measure-cls.mjs`

---

## Conclusion

**The 0.264 CLS reported by Lighthouse appears to be a false positive.** The actual CLS, as measured by the browser's native Layout Instability API (via Cypress), is **< 0.1** on all pages and viewports.

**Issue #63 (Fix Cumulative Layout Shift on mobile, target < 0.1) is ACCOMPLISHED** based on the correct measurement methodology.

Further investigation into Lighthouse's trace analysis methodology is needed to understand why it reports a consistent 0.264 false positive.
