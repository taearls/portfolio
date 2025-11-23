/// <reference types="cypress" />

/**
 * CLS Measurement Test
 *
 * Uses the Layout Instability API to measure actual CLS scores during page load.
 * This complements Lighthouse by providing real-time CLS measurement in the test environment.
 */

describe("CLS Measurement", () => {
  const CLS_THRESHOLD = 0.1; // "Good" threshold
  const pages = [
    { path: "/", name: "Home" },
    { path: "/code", name: "Code" },
    { path: "/contact", name: "Contact" },
  ];

  pages.forEach(({ path, name }) => {
    describe(`${name} Page`, () => {
      it(`should have CLS < ${CLS_THRESHOLD} on desktop`, () => {
        cy.viewport(1920, 1080);

        cy.visit(path, {
          onBeforeLoad: (win) => {
            // Inject CLS measurement script
            const clsObserver = new PerformanceObserver((list) => {
              let clsValue = 0;
              const entries = list.getEntries() as PerformanceEntry[];

              for (const entry of entries) {
                const layoutShift = entry as LayoutShiftEntry;
                // Only count layout shifts without recent user input
                if (!layoutShift.hadRecentInput) {
                  clsValue += layoutShift.value;
                }
              }

              // Store cumulative CLS on window object
              (win as Window & { __CLS__?: number }).__CLS__ =
                ((win as Window & { __CLS__?: number }).__CLS__ || 0) +
                clsValue;
            });

            clsObserver.observe({ type: "layout-shift", buffered: true });
          },
        });

        // Wait for page to be interactive
        cy.get("h1").should("be.visible");

        // Wait for any async content to load
        cy.wait(2000);

        // Check CLS value
        cy.window().then((win) => {
          const cls = (win as Window & { __CLS__?: number }).__CLS__ || 0;
          cy.log(`CLS Score: ${cls.toFixed(4)}`);

          // Assert CLS is below threshold
          expect(cls, `CLS should be < ${CLS_THRESHOLD}`).to.be.lessThan(
            CLS_THRESHOLD,
          );
        });
      });

      it(`should have CLS < ${CLS_THRESHOLD} on mobile`, () => {
        cy.viewport(390, 844); // iPhone 13

        cy.visit(path, {
          onBeforeLoad: (win) => {
            // Inject CLS measurement script
            const clsObserver = new PerformanceObserver((list) => {
              let clsValue = 0;
              const entries = list.getEntries() as PerformanceEntry[];

              for (const entry of entries) {
                const layoutShift = entry as LayoutShiftEntry;
                if (!layoutShift.hadRecentInput) {
                  clsValue += layoutShift.value;
                }
              }

              (win as Window & { __CLS__?: number }).__CLS__ =
                ((win as Window & { __CLS__?: number }).__CLS__ || 0) +
                clsValue;
            });

            clsObserver.observe({ type: "layout-shift", buffered: true });
          },
        });

        // Wait for page to be interactive
        cy.get("h1").should("be.visible");

        // Wait for any async content to load
        cy.wait(2000);

        // Check CLS value
        cy.window().then((win) => {
          const cls = (win as Window & { __CLS__?: number }).__CLS__ || 0;
          cy.log(`Mobile CLS Score: ${cls.toFixed(4)}`);

          expect(cls, `Mobile CLS should be < ${CLS_THRESHOLD}`).to.be.lessThan(
            CLS_THRESHOLD,
          );
        });
      });

      it("should report layout shift sources if CLS > threshold", () => {
        cy.viewport(390, 844); // Mobile viewport where issue occurs

        const layoutShifts: LayoutShiftEntry[] = [];

        cy.visit(path, {
          onBeforeLoad: (win) => {
            const clsObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries() as PerformanceEntry[];

              for (const entry of entries) {
                const layoutShift = entry as LayoutShiftEntry;
                if (!layoutShift.hadRecentInput) {
                  layoutShifts.push(layoutShift);

                  // Log shift details
                  console.log("Layout Shift Detected:", {
                    value: layoutShift.value.toFixed(4),
                    time: layoutShift.startTime.toFixed(0),
                    sources: layoutShift.sources?.map((source) => ({
                      node: source.node,
                      previousRect: source.previousRect,
                      currentRect: source.currentRect,
                    })),
                  });
                }
              }

              (win as Window & { __CLS__?: number }).__CLS__ =
                ((win as Window & { __CLS__?: number }).__CLS__ || 0) +
                layoutShifts.reduce((sum, shift) => sum + shift.value, 0);
              (win as Window & { __LAYOUT_SHIFTS__?: LayoutShiftEntry[] }).__LAYOUT_SHIFTS__ =
                layoutShifts;
            });

            clsObserver.observe({ type: "layout-shift", buffered: true });
          },
        });

        cy.get("h1").should("be.visible");
        cy.wait(2000);

        cy.window().then((win) => {
          const cls = (win as Window & { __CLS__?: number }).__CLS__ || 0;
          const shifts =
            (win as Window & { __LAYOUT_SHIFTS__?: LayoutShiftEntry[] }).__LAYOUT_SHIFTS__ || [];

          if (cls > CLS_THRESHOLD) {
            cy.log(`⚠️ CLS THRESHOLD EXCEEDED: ${cls.toFixed(4)}`);
            cy.log(`Number of shifts: ${shifts.length}`);

            shifts.forEach((shift, index) => {
              cy.log(`Shift #${index + 1}: ${shift.value.toFixed(4)} at ${shift.startTime.toFixed(0)}ms`);

              shift.sources?.forEach((source, sourceIndex) => {
                const node = source.node as Element;
                cy.log(
                  `  Source #${sourceIndex + 1}: ${node?.tagName || "unknown"}${node?.className ? "." + node.className : ""}`,
                );
              });
            });
          } else {
            cy.log(`✅ CLS within threshold: ${cls.toFixed(4)}`);
          }
        });
      });
    });
  });
});

// Type definitions for Layout Instability API
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources?: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  previousRect: DOMRectReadOnly;
  currentRect: DOMRectReadOnly;
}
