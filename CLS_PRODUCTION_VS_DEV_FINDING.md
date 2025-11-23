# CLS Production vs Development Finding

**Date:** November 23, 2025
**Branch:** `fix/cumulative-layout-shift-mobile`
**Status:** 🔴 CRITICAL FINDING

---

## Summary

**CLS issue ONLY exists in production builds, NOT in development.**

### Test Results

| Environment | CLS Value | Tests Passed |
|-------------|-----------|--------------|
| **Development (Cypress)** | < 0.1 | ✅ 9/9 (100%) |
| **Production (Lighthouse)** | 0.264 | ❌ 0/6 (0%) |

### Evidence

**Cypress (Dev Mode):**
```
✓ Home should have CLS < 0.1 on desktop
✓ Home should have CLS < 0.1 on mobile
✓ Code should have CLS < 0.1 on desktop
✓ Code should have CLS < 0.1 on mobile
✓ Contact should have CLS < 0.1 on desktop
✓ Contact should have CLS < 0.1 on mobile

9 passing (19s)
```

**Lighthouse (Production Build):**
```
Home - Mobile (iPhone 13):  CLS 0.264 (POOR)
Home - Mobile (Pixel 5):    CLS 0.262 (POOR)
Code - Mobile (iPhone 13):  CLS 0.264 (POOR)
Code - Mobile (Pixel 5):    CLS 0.262 (POOR)
Contact - Mobile (iPhone 13): CLS 0.264 (POOR)
Contact - Mobile (Pixel 5):   CLS 0.262 (POOR)

0/6 passed
Average CLS: 0.263
```

---

## What This Means

### Hypotheses REJECTED

1. ❌ **Fonts** - Inline @font-face didn't fix production CLS
2. ❌ **Images** - Hiding all images didn't change CLS (tested in hypothesis report)
3. ❌ **Profile Image** - Replaced with placeholder, no change (tested)
4. ❌ **React Hydration** - Dev mode has no hydration errors, CLS < 0.1

### New Hypothesis: Vite Production Build Issue

The CLS is caused by something **specific to Vite's production build process**:

**Possible Causes:**
1. **CSS Code Splitting** - Vite splits CSS differently in production
2. **CSS Minification** - esbuild CSS minifier may reorder rules
3. **Asset Hashing** - Hashed filenames cause different loading order
4. **Module Preloading** - Vite injects different preload hints in production
5. **Chunk Splitting** - JavaScript chunks load in different order
6. **Base Path Resolution** - `base: "./"` causing path resolution issues
7. **CSS Module Processing** - Production CSS modules behave differently

---

## Investigation Path

### Immediate Next Steps

1. **Compare Dev vs Prod HTML Output**
   - Dev: Live Vite server with HMR
   - Prod: Static build with optimizations
   - Look for differences in `<head>` tags, script order, CSS links

2. **Test Production Build Without Optimizations**
   ```javascript
   // vite.config.mts
   build: {
     cssMinify: false,  // Disable CSS minification
     minify: false,     // Disable JS minification
     cssCodeSplit: false, // Keep all CSS in one file
   }
   ```

3. **Isolate CSS Loading**
   - Inline ALL CSS (not just @font-face)
   - Disable CSS code splitting completely
   - Test if CLS disappears

4. **Check Network Timing**
   - Compare dev vs prod waterfall in Chrome DevTools
   - Look for late-loading CSS files
   - Check if CSS blocks rendering differently

5. **Test Different Build Targets**
   ```javascript
   // vite.config.mts
   build: {
     target: 'es2022',  // Current
     target: 'esnext',  // Try newer
     target: 'es2015',  // Try older
   }
   ```

### Advanced Debugging

6. **Enable Source Maps in Production**
   ```javascript
   build: {
     sourcemap: true,
   }
   ```

7. **Test with Different CSS Minifiers**
   ```javascript
   build: {
     cssMinify: 'lightningcss', // vs 'esbuild' (current)
   }
   ```

8. **Disable All Build Optimizations**
   ```javascript
   build: {
     minify: false,
     cssMinify: false,
     cssCodeSplit: false,
     rollupOptions: {
       output: {
         manualChunks: undefined, // Disable chunk splitting
       },
     },
   }
   ```

9. **Compare Bundle Sizes**
   - Dev: Unbundled modules
   - Prod: Optimized bundles
   - Check if large bundles delay CSS application

---

## Key Files

### Production Build Output
- `dist/index.html` - Built HTML (line 78: CSS link, line 79: JS script)
- `dist/assets/index-LpcKqxzy.css` - Main CSS bundle
- `dist/assets/index-BlYv6wg4.js` - Main JS bundle

### Vite Configuration
- `vite.config.mts` - Current build config
  - `build.cssMinify: 'esbuild'`
  - `build.target: 'es2022'`
  - `base: './'`

---

## Relevant Code Comparison

### Dev Mode (index.html source)
```html
<head>
  <style>
    /* Inline @font-face declarations */
    @font-face { font-family: "Ubuntu"; src: url("/fonts/ubuntu-regular.woff2"); }
  </style>
  <link rel="preload" href="/fonts/ubuntu-regular.woff2" as="font" />
  <script type="module" src="/src/root.tsx"></script>
</head>
```

### Prod Mode (dist/index.html)
```html
<head>
  <style>
    /* Inline @font-face declarations */
    @font-face { font-family: "Ubuntu"; src: url("fonts/ubuntu-regular.woff2"); }
  </style>
  <link rel="preload" href="./fonts/ubuntu-regular.woff2" as="font" />
  <script type="module" crossorigin src="./assets/index-BlYv6wg4.js"></script>
  <link rel="stylesheet" crossorigin href="./assets/index-LpcKqxzy.css">
</head>
```

**Difference:**
- Prod has separate CSS bundle: `./assets/index-LpcKqxzy.css`
- Dev loads CSS via JS modules (Vite HMR)
- Path differences: `/fonts/` vs `fonts/` vs `./fonts/`

---

## Next Actions

1. ✅ Commit current diagnostic tools (DONE)
2. ⏭️ **Test production build without CSS minification**
3. ⏭️ **Test production build without CSS code splitting**
4. ⏭️ **Compare dev vs prod network waterfalls**
5. ⏭️ **Inspect `dist/assets/index-*.css` for CSS loading issues**

---

## Hypothesis Priority

### HIGH Priority
1. **CSS Code Splitting** - Most likely cause
2. **CSS Loading Order** - CSS bundle loads after layout paint
3. **Path Resolution** - Fonts fail to load in production

### MEDIUM Priority
4. **CSS Minification** - Minifier reordering rules
5. **Asset Hashing** - Cache busting causing delays

### LOW Priority
6. **Build Target** - ES2022 vs other targets
7. **Base Path** - `./ ` vs `/` resolution

---

## Conclusion

**The inline @font-face fix was correct but insufficient.** Fonts load fine in dev mode (CLS < 0.1), but something about Vite's production build process introduces the 0.264 CLS.

The issue is NOT content-related (fonts, images, React). It's a **build configuration issue** that only manifests in production.

**Recommended Next Step:**
Test production build with CSS code splitting disabled:

```javascript
// vite.config.mts
build: {
  cssCodeSplit: false,
}
```

Then rebuild and measure CLS again.
