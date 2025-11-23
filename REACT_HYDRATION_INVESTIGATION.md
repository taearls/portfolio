# React Hydration Investigation - Testing Guide

**Date:** November 23, 2025
**Branch:** `fix/cumulative-layout-shift-mobile`
**Investigation:** Option A - React Component CLS Analysis
**Status:** 🧪 Active Testing

---

## What We've Built

### 1. React Hydration Monitor (`src/util/reactHydrationMonitor.ts`)

**Purpose:** Detect React hydration mismatches that might cause layout shifts

**Features:**
- Intercepts `console.error` and `console.warn` to catch hydration warnings
- Tracks hydration timing and completion
- Monitors component render performance
- Identifies slow renders (>16ms)
- Analyzes CLS risk from React patterns

**Detection Capabilities:**
- Hydration errors ("Hydration failed", "did not match")
- Hydration warnings
- Server/client HTML mismatches
- Expected vs actual value differences

### 2. CLS + React Monitor (`src/util/clsReactMonitor.ts`)

**Purpose:** Correlate layout shifts with React component activity

**Features:**
- Tracks layout shifts with React context
- Identifies which components rendered before shifts
- Determines if shifts occur before/after hydration
- Finds React Fiber (component name) for shifted DOM nodes
- Visual debugging with red overlays
- Timeline analysis (when shifts occur)

**Key Insights:**
- Whether shifts happen during hydration vs after
- Which React components were active during shifts
- Timing patterns (0-100ms, 100-500ms, etc.)
- React Fiber attribution for shifted elements

### 3. Integrated Monitoring (`src/root.tsx`)

**Activation:** Development mode only (`import.meta.env.DEV`)

**Auto-Features:**
- Monitors start automatically when dev server runs
- Reports auto-generate 2 seconds after page load
- All data exposed to `window.__REACT_MONITOR__` for manual inspection

---

## How to Use

### Step 1: Start Dev Server

```bash
npm run dev
```

The server will open your browser automatically. You should see:
```
🔬 React/CLS Monitoring Active - Reports will auto-generate after page load
💡 Manual commands: window.__REACT_MONITOR__.logHydrationReport()
```

### Step 2: Navigate and Observe

1. **Watch the Console** - Reports will auto-generate after 2 seconds
2. **Look for Red Overlays** - Shifted elements will be highlighted with CLS values
3. **Check Console Groups** - Expandable sections with detailed analysis

### Step 3: Read the Reports

#### A. React Hydration Report

```
📊 React Hydration Report
├── Status: OK | WARNING | FAILED
├── Duration: Xms
├── Errors: N
└── Warnings: N
    ├── ❌ Hydration Errors (if any)
    ├── ⚠️ Hydration Warnings (if any)
    └── 🔄 Component Renders (slow renders highlighted)
```

**What to Look For:**
- **Hydration Errors:** Definitive proof of server/client mismatch
- **Slow Renders:** Components taking >16ms (one frame)
- **Error Messages:** Specific "expected X but was Y" details

#### B. CLS + React Analysis Report

```
📊 CLS + React Analysis Report
├── Total CLS: X.XXXX
├── Total Shifts: N
├── ⏱️ Timing Analysis
│   ├── 0-100ms: N shifts, CLS X.XXXX
│   ├── 100-500ms: N shifts, CLS X.XXXX
│   └── 1000ms+: N shifts, CLS X.XXXX
└── 🔄 Hydration Impact
    ├── Shifts before hydration: N
    ├── CLS before hydration: X.XXXX
    ├── Shifts after hydration: N
    ├── CLS after hydration: X.XXXX
    └── XX% of shifts occur before hydration completes
```

**What to Look For:**
- **High % before hydration:** Indicates hydration-related CLS
- **Shifts in 0-100ms:** Very early, likely hydration
- **Shifts after 1000ms:** Late shifts, likely async content

#### C. CLS Risk Analysis

```
🎯 CLS Risk Analysis
├── [HIGH] Hydration Errors Detected
│   └── Hydration mismatches force React to re-render, causing layout shifts
├── [MEDIUM] Slow Hydration
│   └── Hydration taking >100ms can cause visible layout changes
└── [LOW] Slow Component Renders
    └── Components taking >16ms to render might cause jank
```

**Risk Levels:**
- **HIGH:** Definitely causes CLS
- **MEDIUM:** Likely contributes to CLS
- **LOW:** Might cause jank, unlikely to cause CLS

### Step 4: Manual Investigation

#### Console Commands

```javascript
// View all available commands
window.__REACT_MONITOR__

// Re-run hydration report
window.__REACT_MONITOR__.logHydrationReport()

// Re-run CLS + React report
window.__REACT_MONITOR__.logCLSReactReport()

// Analyze CLS risks
window.__REACT_MONITOR__.analyzeHydrationForCLS()

// Raw data access
window.__REACT_MONITOR__.getHydrationEvents()
window.__REACT_MONITOR__.getRenderEvents()
window.__REACT_MONITOR__.getCLSShifts()
```

#### Investigate Specific Pages

```bash
# Home page
http://localhost:5173/

# Code page (where CLS is highest)
http://localhost:5173/code

# Contact page
http://localhost:5173/contact
```

---

## Expected Test Results

### Scenario A: Hydration Mismatch Found

**Indicators:**
- ❌ Hydration errors in console
- Specific "expected X but was Y" messages
- CLS occurs in 0-100ms timeframe
- High % of shifts before hydration completes

**Interpretation:**
- Server-rendered HTML doesn't match client-rendered HTML
- React forced to re-render, causing layout shift
- **Solution:** Fix the mismatch source

**Common Causes:**
- Date/time formatting (server vs client timezone)
- Random values (Math.random(), UUID generation)
- Browser-specific APIs used during SSR
- Conditional rendering based on `window` or `document`

### Scenario B: Slow Hydration

**Indicators:**
- ✅ No hydration errors
- Hydration duration >100ms
- CLS occurs during 100-500ms window
- Medium CLS risk flagged

**Interpretation:**
- Hydration takes too long
- User sees content shift as React "wakes up"
- **Solution:** Optimize hydration performance

**Common Causes:**
- Large component tree
- Heavy JavaScript execution
- Third-party scripts blocking
- Too many event listeners

### Scenario C: Post-Hydration Shifts

**Indicators:**
- ✅ No hydration errors
- Fast hydration (<100ms)
- CLS occurs after 500ms+
- Shifts happen after hydration completes

**Interpretation:**
- Issue is NOT hydration-related
- Layout shifts from async content loading
- **Solution:** Reserve space for async content

**Common Causes:**
- Images loading without dimensions
- Fonts loading (FOUT/FOIT)
- API data fetching
- Dynamic imports

### Scenario D: No React Issues (Current Hypothesis)

**Indicators:**
- ✅ No hydration errors
- ✅ Fast hydration
- ✅ No slow renders
- BUT: CLS still 0.264

**Interpretation:**
- React is NOT the cause
- Issue is framework/CSS/build-level
- **Next Steps:** Investigate Option B or C

---

## Interpreting the 0.264 CLS Pattern

Given our previous findings (CLS identical with/without images/fonts), here's what to watch for:

### If CLS Happens at 0-50ms:
- **Likely:** CSS variable calculation
- **Reason:** Browser calculating `calc()`, `var()`, `light-dark()` before first paint
- **Test:** Check if disabling CSS custom properties helps

### If CLS Happens at 50-150ms:
- **Likely:** React hydration
- **Reason:** Server HTML height ≠ client React height
- **Test:** Look for hydration mismatches in report

### If CLS Happens at 150-500ms:
- **Likely:** Async resource loading
- **Reason:** Fonts, images, or dynamic imports
- **Test:** Network waterfall analysis

### If CLS is Consistent Across All Pages:
- **Likely:** Global layout issue (header, footer, root container)
- **Reason:** Something in layout template causing shift
- **Test:** Inspect shared components (Header, Footer, PageContainer)

---

## Visual Debugging

When layout shifts occur, you'll see:

1. **Red Border** - Outlines the shifted element
2. **Red Label** - Shows CLS value for that element
3. **3-Second Fade** - Overlay fades out automatically

**How to Capture:**
- Take screenshots when overlays appear
- Note which elements are highlighted
- Check console for React component attribution

---

## Data Collection Checklist

For each page tested, record:

- [ ] Page URL
- [ ] CLS value (from CLS + React report)
- [ ] Number of layout shifts
- [ ] Hydration status (errors/warnings)
- [ ] Hydration duration
- [ ] Timing of shifts (0-100ms, 100-500ms, etc.)
- [ ] % of shifts before hydration
- [ ] Shifted element types (from visual overlays)
- [ ] React components involved (from console logs)

---

## Next Steps Based on Findings

### If Hydration Errors Found:

1. **Identify the Mismatch:**
   - Check error message for "expected X but was Y"
   - Find the component mentioned in stack trace
   - Look for server/client differences

2. **Common Fixes:**
   ```typescript
   // ❌ Bad: Uses client-only API during SSR
   const date = new Date().toLocaleDateString()

   // ✅ Good: Check for browser environment
   const date = typeof window !== 'undefined'
     ? new Date().toLocaleDateString()
     : new Date().toISOString()
   ```

3. **Verify Fix:**
   - Refresh page
   - Check if hydration error is gone
   - Re-run CLS measurement

### If No Hydration Issues Found:

1. **Document the Negative Result:**
   - React is ruled out as the cause
   - Update hypothesis testing report
   - Move to next investigation option

2. **Consider Option B: CSS Runtime:**
   - Test disabling `light-dark()`
   - Pre-calculate CSS variables
   - Inline critical CSS

3. **Consider Option C: Framework Change:**
   - Evaluate SSR/SSG options
   - Test different build configurations
   - Profile Vite build process

---

## Troubleshooting

### Reports Not Appearing

**Check:**
1. Dev server is running (not production build)
2. Console is open (reports won't show if closed during auto-generation)
3. Wait full 2 seconds after page load

**Solution:**
```javascript
// Manually trigger reports
window.__REACT_MONITOR__.logHydrationReport()
window.__REACT_MONITOR__.logCLSReactReport()
```

### Visual Overlays Not Showing

**Check:**
1. `visualDebug: true` is set (it is by default)
2. Layout shifts are actually occurring
3. Overlays might have already faded out (3-second duration)

**Solution:**
- Refresh page to see overlays again
- Check console for shift events even without visual

### No Layout Shifts Detected

**Possible Reasons:**
1. CLS happening before monitoring initializes
2. Lighthouse vs browser DevTools difference
3. Production build behavior vs dev build

**Solution:**
- Run production build with monitoring
- Use Lighthouse CLI for comparison
- Check Network panel for timing

---

## Success Criteria

Investigation is successful if we can answer:

1. ✅ **Does React hydration cause the 0.264 CLS?**
   - Yes: We see hydration errors/warnings
   - No: Reports show clean hydration

2. ✅ **When do the layout shifts occur?**
   - Timeline analysis shows exact timing
   - Before vs after hydration percentage

3. ✅ **Which components are involved?**
   - React Fiber attribution identifies components
   - Visual overlays show shifted DOM elements

4. ✅ **What's the next investigation step?**
   - If React is the cause: Fix hydration
   - If React is clean: Move to Option B/C

---

## Additional Resources

- **React Hydration Docs:** https://react.dev/reference/react-dom/client/hydrateRoot
- **React DevTools Profiler:** Enable in browser extensions
- **Chrome Performance Panel:** Record page load for detailed timing
- **Layout Instability API:** https://wicg.github.io/layout-instability/

---

**Investigation Lead:** Claude
**Status:** Ready for Testing
**Tools Deployed:** 3 monitoring utilities + integration
**Expected Duration:** 30-60 minutes of manual testing
