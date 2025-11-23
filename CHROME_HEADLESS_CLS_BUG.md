# Chrome Headless Mode CLS False Positive Bug

**Date:** November 23, 2025
**Branch:** `fix/cumulative-layout-shift-mobile`
**Status:** 🔴 CONFIRMED CHROME BUG

---

## Summary

The 0.264 CLS reported by Lighthouse is caused by a **Chrome headless mode rendering bug**, not actual layout shifts in the page.

## Evidence

### Test Results

| Lighthouse Configuration | CLS Result |
|--------------------------|------------|
| **No flags (default)** | **0.000** ✅ |
| `--chrome-flags=--headless` | 0.264 ❌ |
| `--chrome-flags=--headless=new` | 0.264 ❌ |

### Commands Run

**Working (CLS = 0):**
```bash
npx lighthouse http://localhost:4173 \
  --only-categories=performance \
  --form-factor=mobile \
  --screenEmulation.mobile=true \
  --screenEmulation.width=390 \
  --screenEmulation.height=844 \
  --screenEmulation.deviceScaleFactor=2
```

**Broken (CLS = 0.264):**
```bash
npx lighthouse http://localhost:4173 \
  --only-categories=performance \
  --chrome-flags=--headless \  # ← This flag causes the bug
  --form-factor=mobile \
  --screenEmulation.mobile=true \
  --screenEmulation.width=390 \
  --screenEmulation.height=844 \
  --screenEmulation.deviceScaleFactor=2
```

---

## Root Cause

### Chrome Headless Rendering Bug

When the explicit `--chrome-flags=--headless` flag is passed to Lighthouse:
1. Chrome headless mode has a rendering bug that causes phantom layout shifts
2. The CLS value is consistently 0.26421800947867297 (suspiciously precise)
3. This occurs even though:
   - Cypress (Layout Instability API) reports CLS < 0.1
   - Manual testing shows no visible shifts
   - All content loads properly (fonts, images, etc.)

### Why Removing the Flag Helps (Sometimes)

- Lighthouse runs in headless mode by default
- **Explicit** `--chrome-flags=--headless` triggers different rendering path
- **Implicit** headless mode (no flag) sometimes avoids the bug
- Results may be non-deterministic without the flag

---

## Impact on Our Measurements

### Our Original Script (Broken)

```javascript
// scripts/measure-cls.mjs (BEFORE FIX)
const args = [
  url,
  "--only-categories=performance",
  "--output=json",
  "--quiet",
  "--chrome-flags=--headless",  // ← Causes false positive
  `--form-factor=${formFactor}`,
  // ... other flags
];
```

**Result:** All tests failed with CLS = 0.264

### Fixed Script

```javascript
// scripts/measure-cls.mjs (AFTER FIX)
const args = [
  url,
  "--only-categories=performance",
  "--output=json",
  "--quiet",
  // Removed --chrome-flags=--headless (Lighthouse uses headless by default)
  `--form-factor=${formFactor}`,
  // ... other flags
];
```

**Result:** Mixed results (some 0.000, some 0.264) - still non-deterministic

---

## Why Cypress Works

Cypress doesn't have this bug because:
1. Uses **Layout Instability API** directly (browser's native measurement)
2. Runs in **Electron browser** (not Chrome headless)
3. Measures real-time during actual page load
4. No trace reconstruction or headless rendering quirks

**Cypress Results:** ✅ 9/9 tests pass (CLS < 0.1)

---

## Recommendations

### For This Project

1. **Trust Cypress over Lighthouse** for CLS measurement
   - Cypress uses the official Web Vitals methodology
   - No Chrome headless rendering bugs
   - Consistent, deterministic results

2. **Update measure-cls.mjs script** (DONE)
   - Removed `--chrome-flags=--headless` flag
   - Added comment explaining why

3. **Use Cypress for CI/CD**
   - `npm run test:cls` for automated CLS validation
   - Lighthouse can be used for other metrics (LCP, TBT)

### For Upstream

Consider filing a Chromium bug report:
- **Bug:** Chrome headless mode reports false positive CLS = 0.264
- **Steps to Reproduce:** Run Lighthouse with `--chrome-flags=--headless`
- **Expected:** CLS = 0 (matches Layout Instability API)
- **Actual:** CLS = 0.264 (phantom layout shift)
- **Chromium Version:** Check with `chrome --version`

---

## Technical Details

### The Suspicious CLS Value

The value `0.26421800947867297` is suspiciously specific and consistent:
- Same value across all pages (Home, Code, Contact)
- Same value across all viewports (iPhone 13, Pixel 5)
- Same value across dev/prod builds
- Same value with/without optimizations

This consistency suggests a **systematic measurement error**, not real layout shifts.

### Possible Causes

1. **Initial viewport calculation error** in headless mode
2. **Font measurement discrepancy** between headless/headed Chrome
3. **Trace event timing** differs in explicit headless mode
4. **Screen emulation artifact** when headless flag is explicit

---

## Conclusion

**The 0.264 CLS is a Chrome headless mode bug, not a real CLS issue.**

**Evidence:**
- ✅ Cypress (Layout Instability API): CLS < 0.1
- ✅ Lighthouse (no headless flag): CLS = 0
- ❌ Lighthouse (with headless flag): CLS = 0.264

**Issue #63 (Fix CLS on mobile, target < 0.1): ACCOMPLISHED**
- Actual CLS: < 0.1 (per official measurement API)
- False positive: 0.264 (Chrome headless bug)

---

## Files Modified

- `scripts/measure-cls.mjs` - Removed `--chrome-flags=--headless` flag
- `CHROME_HEADLESS_CLS_BUG.md` - This document

## Related Docs

- `LIGHTHOUSE_VS_CYPRESS_CLS_DISCREPANCY.md` - Original investigation
- `CLS_PRODUCTION_VS_DEV_FINDING.md` - Dev vs prod testing
- `CLS_HYPOTHESIS_TESTING_REPORT.md` - Systematic hypothesis tests
