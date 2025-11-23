/**
 * CLS Monitor - Runtime Cumulative Layout Shift tracking
 *
 * Monitors layout shifts during page lifecycle and reports detailed
 * information about shift sources for debugging.
 *
 * Usage:
 *   import { initCLSMonitor } from '@/util/clsMonitor';
 *   initCLSMonitor({ debug: true }); // Enable in development
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

export type CLSEntry = {
  value: number;
  entries: LayoutShift[];
  timestamp: number;
};

export type CLSMonitorConfig = {
  /** Enable console logging */
  debug?: boolean;
  /** Threshold for "good" CLS (default: 0.1) */
  threshold?: number;
  /** Callback for each layout shift */
  onShift?: (entry: CLSEntry) => void;
  /** Callback for final CLS score */
  onFinal?: (cls: number) => void;
  /** Enable visual debugging overlay */
  visualDebug?: boolean;
};

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources?: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}

const DEFAULT_THRESHOLD = 0.1;
let cumulativeCLS = 0;
let layoutShifts: CLSEntry[] = [];

/**
 * Initialize CLS monitoring
 */
export function initCLSMonitor(config: CLSMonitorConfig = {}) {
  const {
    debug = false,
    threshold = DEFAULT_THRESHOLD,
    onShift,
    onFinal,
    visualDebug = false,
  } = config;

  if (debug) {
    console.log("🔍 CLS Monitor initialized", { threshold, visualDebug });
  }

  // Monitor CLS using Web Vitals
  onCLS((metric: Metric) => {
    cumulativeCLS = metric.value;

    const entry: CLSEntry = {
      value: metric.value,
      entries: metric.entries as LayoutShift[],
      timestamp: Date.now(),
    };

    layoutShifts.push(entry);

    if (debug) {
      const status = metric.value <= threshold ? "✅" : "🔴";
      console.log(`${status} CLS Update:`, {
        value: metric.value.toFixed(4),
        threshold,
        rating: metric.rating,
        numEntries: metric.entries.length,
      });

      // Log individual layout shift sources
      metric.entries.forEach((shift, index) => {
        const layoutShift = shift as LayoutShift;
        if (!layoutShift.hadRecentInput) {
          console.log(`  Shift #${index + 1}:`, {
            value: layoutShift.value.toFixed(4),
            time: layoutShift.startTime.toFixed(0),
            sources: layoutShift.sources?.map((source) => ({
              node:
                source.node instanceof Element
                  ? `${source.node.tagName}${source.node.className ? "." + source.node.className : ""}`
                  : "unknown",
              previousRect: {
                width: source.previousRect.width.toFixed(0),
                height: source.previousRect.height.toFixed(0),
                x: source.previousRect.x.toFixed(0),
                y: source.previousRect.y.toFixed(0),
              },
              currentRect: {
                width: source.currentRect.width.toFixed(0),
                height: source.currentRect.height.toFixed(0),
                x: source.currentRect.x.toFixed(0),
                y: source.currentRect.y.toFixed(0),
              },
            })),
          });

          // Visual debugging: highlight shifted elements
          if (visualDebug && layoutShift.sources) {
            layoutShift.sources.forEach((source) => {
              if (source.node instanceof Element) {
                highlightShiftedElement(source.node as HTMLElement, layoutShift.value);
              }
            });
          }
        }
      });
    }

    onShift?.(entry);
  });

  // Also monitor other Core Web Vitals for context
  if (debug) {
    onLCP((metric) => {
      console.log("⚡ LCP:", {
        value: `${metric.value.toFixed(0)}ms`,
        rating: metric.rating,
      });
    });

    onFCP((metric) => {
      console.log("🎨 FCP:", {
        value: `${metric.value.toFixed(0)}ms`,
        rating: metric.rating,
      });
    });

    onINP((metric) => {
      console.log("🖱️ INP:", {
        value: `${metric.value.toFixed(0)}ms`,
        rating: metric.rating,
      });
    });

    onTTFB((metric) => {
      console.log("🌐 TTFB:", {
        value: `${metric.value.toFixed(0)}ms`,
        rating: metric.rating,
      });
    });
  }

  // Report final CLS on page unload
  if (onFinal) {
    window.addEventListener("pagehide", () => {
      onFinal(cumulativeCLS);
    });
  }

  return {
    getCLS: () => cumulativeCLS,
    getShifts: () => layoutShifts,
    reset: () => {
      cumulativeCLS = 0;
      layoutShifts = [];
    },
  };
}

/**
 * Visually highlight elements that caused layout shifts
 */
function highlightShiftedElement(element: HTMLElement, shiftValue: number) {
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.border = "3px solid red";
  overlay.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "9999";
  overlay.style.transition = "opacity 2s";

  const rect = element.getBoundingClientRect();
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;

  // Add label
  const label = document.createElement("div");
  label.textContent = `CLS: ${shiftValue.toFixed(4)}`;
  label.style.position = "absolute";
  label.style.top = "-25px";
  label.style.left = "0";
  label.style.backgroundColor = "red";
  label.style.color = "white";
  label.style.padding = "2px 8px";
  label.style.fontSize = "12px";
  label.style.fontWeight = "bold";
  label.style.borderRadius = "3px";
  overlay.appendChild(label);

  document.body.appendChild(overlay);

  // Fade out and remove after 3 seconds
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 2000);
  }, 3000);
}

/**
 * Get summary report of all layout shifts
 */
export function getCLSSummary() {
  return {
    totalCLS: cumulativeCLS,
    numShifts: layoutShifts.length,
    shifts: layoutShifts.map((shift) => ({
      value: shift.value,
      timestamp: shift.timestamp,
      numEntries: shift.entries.length,
    })),
    worstShift: layoutShifts.length > 0 ? Math.max(...layoutShifts.map((s) => s.value)) : 0,
  };
}

/**
 * Development helper: Log CLS summary to console
 */
export function logCLSSummary() {
  const summary = getCLSSummary();
  console.group("📊 CLS Summary");
  console.log("Total CLS:", summary.totalCLS.toFixed(4));
  console.log("Number of shifts:", summary.numShifts);
  console.log("Worst shift:", summary.worstShift.toFixed(4));
  console.table(summary.shifts);
  console.groupEnd();
}
