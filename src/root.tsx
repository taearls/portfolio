import "../wdyr.ts";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./styles/globals.css";

import PageContainer from "./components/layout/containers/PageContainer/PageContainer.tsx";
import Footer from "./components/layout/Footer/Footer.tsx";
import Header from "./components/layout/Header/Header.tsx";
import Meta from "./components/layout/Meta/Meta.tsx";
import routes from "./routes.tsx";
import ThemeContext from "./state/contexts/ThemeContext.tsx";

// Initialize React + CLS monitoring (development only)
if (import.meta.env.DEV) {
  void (async () => {
    const { initReactHydrationMonitor, logHydrationReport, analyzeHydrationForCLS } =
      await import("./util/reactHydrationMonitor.ts");
    const { initCLSReactMonitor, logCLSReactReport } =
      await import("./util/clsReactMonitor.ts");

    // Initialize monitoring
    const hydrationMonitor = initReactHydrationMonitor({
      debug: true,
      trackRenders: true,
    });

    const clsMonitor = initCLSReactMonitor({
      debug: true,
      visualDebug: true,
    });

    // Expose to window for console access
    (window as Window & { __REACT_MONITOR__?: unknown }).__REACT_MONITOR__ = {
      logHydrationReport,
      logCLSReactReport,
      analyzeHydrationForCLS,
      getHydrationEvents: hydrationMonitor.getHydrationEvents,
      getRenderEvents: hydrationMonitor.getRenderEvents,
      getCLSShifts: clsMonitor.getLayoutShifts,
    };

    // Auto-log reports after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        console.log("\n");
        logHydrationReport();
        console.log("\n");
        logCLSReactReport();
        console.log("\n");
        analyzeHydrationForCLS();
      }, 2000);
    });

    console.log("🔬 React/CLS Monitoring Active - Reports will auto-generate after page load");
    console.log("💡 Manual commands: window.__REACT_MONITOR__.logHydrationReport()");
  })();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContext.Provider>
      <BrowserRouter>
        <Meta />
        <Header />
        <PageContainer>{routes}</PageContainer>

        <Footer />
      </BrowserRouter>
    </ThemeContext.Provider>
  </StrictMode>,
);
