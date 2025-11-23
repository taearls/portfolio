/**
 * React Hydration Monitor
 *
 * Detects and logs React hydration mismatches, render timing issues,
 * and component lifecycle events that might cause CLS.
 */

export type HydrationEvent = {
  type: "hydration-error" | "hydration-warning" | "hydration-complete";
  message: string;
  timestamp: number;
  stack?: string;
};

export type RenderEvent = {
  componentName: string;
  phase: "mount" | "update" | "unmount";
  timestamp: number;
  duration?: number;
};

const hydrationEvents: HydrationEvent[] = [];
const renderEvents: RenderEvent[] = [];
let hydrationStartTime = 0;
let hydrationEndTime = 0;

/**
 * Initialize React hydration monitoring
 */
export function initReactHydrationMonitor(config: {
  debug?: boolean;
  trackRenders?: boolean;
} = {}) {
  const { debug = false, trackRenders = false } = config;

  hydrationStartTime = performance.now();

  if (debug) {
    console.log("🔬 React Hydration Monitor initialized", {
      startTime: hydrationStartTime.toFixed(2) + "ms",
    });
  }

  // Intercept console.error to catch hydration mismatches
  const originalError = console.error;
  console.error = function (...args: unknown[]) {
    const message = String(args[0] || "");

    // React 18+ hydration errors
    if (
      message.includes("Hydration failed") ||
      message.includes("hydration") ||
      message.includes("did not match") ||
      message.includes("server-rendered HTML")
    ) {
      const event: HydrationEvent = {
        type: "hydration-error",
        message: message,
        timestamp: performance.now(),
        stack: new Error().stack,
      };

      hydrationEvents.push(event);

      console.warn("🚨 HYDRATION MISMATCH DETECTED:", {
        message,
        timestamp: event.timestamp.toFixed(2) + "ms",
        timeSinceLoad: (event.timestamp - hydrationStartTime).toFixed(2) + "ms",
      });

      // Extract specific mismatch details
      if (message.includes("expected") && message.includes("but was")) {
        const match = message.match(/expected `([^`]+)`.+but was `([^`]+)`/);
        if (match) {
          console.warn("  Expected:", match[1]);
          console.warn("  Actual:", match[2]);
        }
      }
    }

    // Call original console.error
    originalError.apply(console, args);
  };

  // Intercept console.warn for hydration warnings
  const originalWarn = console.warn;
  console.warn = function (...args: unknown[]) {
    const message = String(args[0] || "");

    if (
      message.includes("hydration") ||
      message.includes("did not match") ||
      message.includes("server-rendered")
    ) {
      const event: HydrationEvent = {
        type: "hydration-warning",
        message: message,
        timestamp: performance.now(),
      };

      hydrationEvents.push(event);

      if (debug) {
        console.log("⚠️ Hydration Warning:", {
          message,
          timestamp: event.timestamp.toFixed(2) + "ms",
        });
      }
    }

    originalWarn.apply(console, args);
  };

  // Detect when React finishes hydration
  // React 18 uses window.onload or requestIdleCallback after hydration
  const checkHydrationComplete = () => {
    hydrationEndTime = performance.now();
    const event: HydrationEvent = {
      type: "hydration-complete",
      message: "React hydration completed",
      timestamp: hydrationEndTime,
    };
    hydrationEvents.push(event);

    if (debug) {
      console.log("✅ React Hydration Complete", {
        duration: (hydrationEndTime - hydrationStartTime).toFixed(2) + "ms",
        errors: hydrationEvents.filter((e) => e.type === "hydration-error").length,
        warnings: hydrationEvents.filter((e) => e.type === "hydration-warning")
          .length,
      });
    }
  };

  // Multiple strategies to detect hydration completion
  if (document.readyState === "complete") {
    setTimeout(checkHydrationComplete, 100);
  } else {
    window.addEventListener("load", () => {
      setTimeout(checkHydrationComplete, 100);
    });
  }

  // Track render timing if enabled
  if (trackRenders) {
    setupRenderTracking(debug);
  }

  return {
    getHydrationEvents: () => hydrationEvents,
    getRenderEvents: () => renderEvents,
    getHydrationDuration: () => hydrationEndTime - hydrationStartTime,
    hasHydrationErrors: () =>
      hydrationEvents.some((e) => e.type === "hydration-error"),
  };
}

/**
 * Setup component render tracking using Performance Observer
 */
function setupRenderTracking(debug: boolean) {
  // Use PerformanceObserver to track React component renders
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // React DevTools marks render phases
        if (entry.name.startsWith("⚛")) {
          const event: RenderEvent = {
            componentName: entry.name.replace("⚛ ", ""),
            phase: "update",
            timestamp: entry.startTime,
            duration: entry.duration,
          };
          renderEvents.push(event);

          if (debug && entry.duration > 16) {
            // Flag slow renders (>1 frame)
            console.warn("🐢 Slow React Render:", {
              component: event.componentName,
              duration: entry.duration.toFixed(2) + "ms",
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });
  } catch (error) {
    console.warn("Could not setup render tracking:", error);
  }
}

/**
 * Get a summary report of hydration issues
 */
export function getHydrationReport() {
  const errors = hydrationEvents.filter((e) => e.type === "hydration-error");
  const warnings = hydrationEvents.filter((e) => e.type === "hydration-warning");

  return {
    duration: hydrationEndTime - hydrationStartTime,
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    events: hydrationEvents,
    renders: renderEvents,
    summary: {
      status: errors.length > 0 ? "FAILED" : warnings.length > 0 ? "WARNING" : "OK",
      message:
        errors.length > 0
          ? `${errors.length} hydration error(s) detected`
          : warnings.length > 0
            ? `${warnings.length} hydration warning(s) detected`
            : "No hydration issues detected",
    },
  };
}

/**
 * Log hydration report to console
 */
export function logHydrationReport() {
  const report = getHydrationReport();

  console.group("📊 React Hydration Report");
  console.log("Status:", report.summary.status);
  console.log("Message:", report.summary.message);
  console.log("Duration:", report.duration.toFixed(2) + "ms");
  console.log("Errors:", report.errorCount);
  console.log("Warnings:", report.warningCount);

  if (report.hasErrors) {
    console.group("❌ Hydration Errors");
    report.events
      .filter((e) => e.type === "hydration-error")
      .forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.message}`);
        console.log(`   Time: ${event.timestamp.toFixed(2)}ms`);
      });
    console.groupEnd();
  }

  if (report.hasWarnings) {
    console.group("⚠️ Hydration Warnings");
    report.events
      .filter((e) => e.type === "hydration-warning")
      .forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.message}`);
        console.log(`   Time: ${event.timestamp.toFixed(2)}ms`);
      });
    console.groupEnd();
  }

  if (report.renders.length > 0) {
    console.group(`🔄 Component Renders (${report.renders.length})`);
    const slowRenders = report.renders.filter((r) => r.duration && r.duration > 16);
    console.log(`Slow renders (>16ms): ${slowRenders.length}`);
    if (slowRenders.length > 0) {
      console.table(
        slowRenders.map((r) => ({
          component: r.componentName,
          duration: r.duration?.toFixed(2) + "ms",
          timestamp: r.timestamp.toFixed(2) + "ms",
        })),
      );
    }
    console.groupEnd();
  }

  console.groupEnd();

  return report;
}

/**
 * Check for specific hydration patterns that might cause CLS
 */
export function analyzeHydrationForCLS() {
  const report = getHydrationReport();

  const clsRisks = [];

  // Check 1: Hydration errors present
  if (report.hasErrors) {
    clsRisks.push({
      risk: "HIGH",
      issue: "Hydration Errors Detected",
      description:
        "Hydration mismatches force React to re-render, causing layout shifts",
      count: report.errorCount,
    });
  }

  // Check 2: Slow hydration (>100ms)
  if (report.duration > 100) {
    clsRisks.push({
      risk: "MEDIUM",
      issue: "Slow Hydration",
      description: "Hydration taking >100ms can cause visible layout changes",
      duration: report.duration.toFixed(2) + "ms",
    });
  }

  // Check 3: Many re-renders
  if (report.renders.length > 10) {
    clsRisks.push({
      risk: "MEDIUM",
      issue: "Excessive Re-renders",
      description: "Multiple component re-renders can accumulate layout shifts",
      count: report.renders.length,
    });
  }

  // Check 4: Slow component renders
  const slowRenders = report.renders.filter((r) => r.duration && r.duration > 16);
  if (slowRenders.length > 0) {
    clsRisks.push({
      risk: "LOW",
      issue: "Slow Component Renders",
      description: "Components taking >16ms to render might cause jank",
      count: slowRenders.length,
      components: slowRenders.map((r) => r.componentName),
    });
  }

  console.group("🎯 CLS Risk Analysis");
  if (clsRisks.length === 0) {
    console.log("✅ No obvious CLS risks from React hydration detected");
  } else {
    console.log(`⚠️ ${clsRisks.length} potential CLS risk(s) identified:`);
    clsRisks.forEach((risk, index) => {
      console.log(`\n${index + 1}. [${risk.risk}] ${risk.issue}`);
      console.log(`   ${risk.description}`);
      if (risk.count) console.log(`   Count: ${risk.count}`);
      if (risk.duration) console.log(`   Duration: ${risk.duration}`);
      if (risk.components) {
        console.log(`   Components:`, risk.components.join(", "));
      }
    });
  }
  console.groupEnd();

  return clsRisks;
}
