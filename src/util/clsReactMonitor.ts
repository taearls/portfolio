/**
 * CLS + React Integration Monitor
 *
 * Combines CLS tracking with React render timing to identify
 * which React components might be causing layout shifts.
 */

import { onCLS, type Metric } from "web-vitals";

type LayoutShiftWithReact = {
  cls: number;
  timestamp: number;
  sources?: LayoutShiftSource[];
  reactContext?: {
    recentRenders: string[];
    hydrationComplete: boolean;
    timeSinceHydration?: number;
  };
};

interface LayoutShiftSource {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

const layoutShifts: LayoutShiftWithReact[] = [];
let hydrationCompleteTime: number | null = null;
const recentRenderQueue: Array<{ component: string; timestamp: number }> = [];

/**
 * Initialize combined CLS + React monitoring
 */
export function initCLSReactMonitor(config: {
  debug?: boolean;
  visualDebug?: boolean;
} = {}) {
  const { debug = false, visualDebug = false } = config;

  if (debug) {
    console.log("🔬 CLS + React Monitor initialized");
  }

  // Track hydration completion
  window.addEventListener("load", () => {
    setTimeout(() => {
      hydrationCompleteTime = performance.now();
      if (debug) {
        console.log("✅ Hydration marked complete at", hydrationCompleteTime.toFixed(2) + "ms");
      }
    }, 100);
  });

  // Monitor CLS with React context
  onCLS((metric: Metric) => {
    const shift: LayoutShiftWithReact = {
      cls: metric.value,
      timestamp: performance.now(),
      sources: (metric.entries as Array<PerformanceEntry & { sources?: LayoutShiftSource[] }>).flatMap(
        (entry) => entry.sources || []
      ),
      reactContext: {
        recentRenders: recentRenderQueue.slice(-5).map((r) => r.component),
        hydrationComplete: hydrationCompleteTime !== null,
        timeSinceHydration:
          hydrationCompleteTime !== null
            ? performance.now() - hydrationCompleteTime
            : undefined,
      },
    };

    layoutShifts.push(shift);

    if (debug) {
      console.group("🔴 Layout Shift Detected");
      console.log("CLS:", shift.cls.toFixed(4));
      console.log("Timestamp:", shift.timestamp.toFixed(2) + "ms");
      console.log("Hydration Complete:", shift.reactContext?.hydrationComplete);
      if (shift.reactContext?.timeSinceHydration !== undefined) {
        console.log(
          "Time Since Hydration:",
          shift.reactContext.timeSinceHydration.toFixed(2) + "ms"
        );
      }
      console.log("Recent React Renders:", shift.reactContext?.recentRenders);

      if (shift.sources && shift.sources.length > 0) {
        console.log("\nShift Sources:");
        shift.sources.forEach((source, index) => {
          const node = source.node as Element | null;
          console.log(`  ${index + 1}. ${node?.tagName || "Unknown"}${node?.className ? "." + node.className : ""}`);
          console.log("     Previous:", {
            x: source.previousRect.x.toFixed(0),
            y: source.previousRect.y.toFixed(0),
            width: source.previousRect.width.toFixed(0),
            height: source.previousRect.height.toFixed(0),
          });
          console.log("     Current:", {
            x: source.currentRect.x.toFixed(0),
            y: source.currentRect.y.toFixed(0),
            width: source.currentRect.width.toFixed(0),
            height: source.currentRect.height.toFixed(0),
          });

          // Check if this element has a React Fiber
          const fiber = findReactFiber(node);
          if (fiber) {
            console.log("     React Component:", fiber);
          }
        });
      }
      console.groupEnd();

      // Visual debugging
      if (visualDebug && shift.sources) {
        shift.sources.forEach((source) => {
          if (source.node instanceof Element) {
            highlightShiftedElement(source.node as HTMLElement, shift.cls);
          }
        });
      }
    }
  });

  return {
    getLayoutShifts: () => layoutShifts,
    trackRender: (componentName: string) => {
      recentRenderQueue.push({
        component: componentName,
        timestamp: performance.now(),
      });
      // Keep only last 10 renders
      if (recentRenderQueue.length > 10) {
        recentRenderQueue.shift();
      }
    },
    getReport: () => generateCLSReactReport(),
  };
}

/**
 * Find React Fiber (component info) for a DOM node
 */
function findReactFiber(node: Node | null): string | null {
  if (!node || !(node instanceof Element)) return null;

  // React 18 stores fiber on element with __reactFiber$ prefix
  const keys = Object.keys(node);
  const fiberKey = keys.find((key) => key.startsWith("__reactFiber$"));

  if (fiberKey) {
    const fiber = (node as unknown as Record<string, { type?: { name?: string; displayName?: string } }>)[fiberKey];
    if (fiber?.type) {
      return (fiber.type.displayName || fiber.type.name || "Unknown Component");
    }
  }

  return null;
}

/**
 * Visual highlight for shifted elements
 */
function highlightShiftedElement(element: HTMLElement, shiftValue: number) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: absolute;
    border: 3px solid red;
    background-color: rgba(255, 0, 0, 0.2);
    pointer-events: none;
    z-index: 9999;
    transition: opacity 2s;
  `;

  const rect = element.getBoundingClientRect();
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;

  const label = document.createElement("div");
  label.textContent = `CLS: ${shiftValue.toFixed(4)}`;
  label.style.cssText = `
    position: absolute;
    top: -25px;
    left: 0;
    background-color: red;
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 3px;
  `;
  overlay.appendChild(label);

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 2000);
  }, 3000);
}

/**
 * Generate comprehensive CLS + React report
 */
function generateCLSReactReport() {
  const totalCLS = layoutShifts.reduce((sum, shift) => sum + shift.cls, 0);
  const shiftsBeforeHydration = layoutShifts.filter(
    (s) => !s.reactContext?.hydrationComplete
  );
  const shiftsAfterHydration = layoutShifts.filter(
    (s) => s.reactContext?.hydrationComplete
  );

  // Analyze timing patterns
  const shiftsByTiming = {
    "0-100ms": layoutShifts.filter((s) => s.timestamp < 100),
    "100-500ms": layoutShifts.filter((s) => s.timestamp >= 100 && s.timestamp < 500),
    "500-1000ms": layoutShifts.filter(
      (s) => s.timestamp >= 500 && s.timestamp < 1000
    ),
    "1000ms+": layoutShifts.filter((s) => s.timestamp >= 1000),
  };

  return {
    totalCLS,
    shiftCount: layoutShifts.length,
    hydrationStatus: {
      shiftsBeforeHydration: shiftsBeforeHydration.length,
      shiftsAfterHydration: shiftsAfterHydration.length,
      clsBeforeHydration: shiftsBeforeHydration.reduce((sum, s) => sum + s.cls, 0),
      clsAfterHydration: shiftsAfterHydration.reduce((sum, s) => sum + s.cls, 0),
    },
    timing: Object.entries(shiftsByTiming).map(([range, shifts]) => ({
      range,
      count: shifts.length,
      cls: shifts.reduce((sum, s) => sum + s.cls, 0),
    })),
    shifts: layoutShifts,
  };
}

/**
 * Log CLS + React report to console
 */
export function logCLSReactReport() {
  const report = generateCLSReactReport();

  console.group("📊 CLS + React Analysis Report");
  console.log("Total CLS:", report.totalCLS.toFixed(4));
  console.log("Total Shifts:", report.shiftCount);

  console.group("⏱️ Timing Analysis");
  report.timing.forEach((t) => {
    console.log(
      `${t.range}: ${t.count} shifts, CLS ${t.cls.toFixed(4)}`
    );
  });
  console.groupEnd();

  console.group("🔄 Hydration Impact");
  console.log("Shifts before hydration:", report.hydrationStatus.shiftsBeforeHydration);
  console.log("CLS before hydration:", report.hydrationStatus.clsBeforeHydration.toFixed(4));
  console.log("Shifts after hydration:", report.hydrationStatus.shiftsAfterHydration);
  console.log("CLS after hydration:", report.hydrationStatus.clsAfterHydration.toFixed(4));

  const beforePercentage =
    report.shiftCount > 0
      ? ((report.hydrationStatus.shiftsBeforeHydration / report.shiftCount) * 100).toFixed(1)
      : "0";
  console.log(`\n${beforePercentage}% of shifts occur before hydration completes`);
  console.groupEnd();

  if (report.shifts.length > 0) {
    console.group("📍 Shift Details");
    report.shifts.forEach((shift, index) => {
      console.log(`\n${index + 1}. CLS: ${shift.cls.toFixed(4)} at ${shift.timestamp.toFixed(2)}ms`);
      console.log("   Hydration complete:", shift.reactContext?.hydrationComplete);
      console.log("   Recent renders:", shift.reactContext?.recentRenders.join(", ") || "none");
    });
    console.groupEnd();
  }

  console.groupEnd();

  return report;
}
