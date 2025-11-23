#!/usr/bin/env node

/**
 * CLS Measurement Script using Lighthouse
 *
 * Measures Cumulative Layout Shift across multiple pages and viewports.
 * Outputs detailed reports with threshold checking.
 *
 * Usage:
 *   npm run measure:cls
 *   npm run measure:cls -- --url http://localhost:4173/code
 *   npm run measure:cls -- --mobile-only
 */

import { spawn } from "child_process";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const CLS_THRESHOLD = 0.1; // "Good" threshold
const CLS_POOR_THRESHOLD = 0.25; // "Poor" threshold

// Parse CLI arguments
const args = process.argv.slice(2);
const customUrl = args.find((arg) => arg.startsWith("--url="))?.split("=")[1];
const mobileOnly = args.includes("--mobile-only");
const desktopOnly = args.includes("--desktop-only");
const verbose = args.includes("--verbose");

const BASE_URL = customUrl || "http://localhost:4173";

// Test configuration
const PAGES = [
  { path: "/", name: "Home" },
  { path: "/code", name: "Code" },
  { path: "/contact", name: "Contact" },
];

const VIEWPORTS = [];
if (!desktopOnly) {
  VIEWPORTS.push(
    { name: "Mobile (iPhone 13)", width: 390, height: 844, mobile: true },
    { name: "Mobile (Pixel 5)", width: 393, height: 851, mobile: true },
  );
}
if (!mobileOnly) {
  VIEWPORTS.push(
    { name: "Desktop", width: 1920, height: 1080, mobile: false },
    { name: "Tablet", width: 768, height: 1024, mobile: false },
  );
}

// Results storage
const results = [];
let totalTests = PAGES.length * VIEWPORTS.length;
let completedTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🔍 CLS Measurement Suite");
console.log("━".repeat(80));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Pages: ${PAGES.map((p) => p.name).join(", ")}`);
console.log(`Viewports: ${VIEWPORTS.map((v) => v.name).join(", ")}`);
console.log(`Total tests: ${totalTests}`);
console.log(`CLS Threshold: ${CLS_THRESHOLD} (good), ${CLS_POOR_THRESHOLD} (poor)`);
console.log("━".repeat(80));
console.log();

/**
 * Run Lighthouse for a specific URL and viewport
 */
async function runLighthouse(url, viewport, pageName) {
  return new Promise((resolve, reject) => {
    const formFactor = viewport.mobile ? "mobile" : "desktop";
    const args = [
      url,
      "--only-categories=performance",
      "--output=json",
      "--quiet",
      // Note: --chrome-flags=--headless causes false positive CLS in Chrome headless mode
      // Lighthouse runs in headless mode by default, explicit flag triggers rendering bug
      `--form-factor=${formFactor}`,
      `--screenEmulation.width=${viewport.width}`,
      `--screenEmulation.height=${viewport.height}`,
      `--screenEmulation.mobile=${viewport.mobile}`,
      "--screenEmulation.deviceScaleFactor=2",
    ];

    if (verbose) {
      console.log(`  Running: lighthouse ${args.join(" ")}`);
    }

    const lighthouse = spawn("npx", ["lighthouse", ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    lighthouse.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    lighthouse.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    lighthouse.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Lighthouse failed: ${stderr}`));
        return;
      }

      try {
        const report = JSON.parse(stdout);
        resolve(report);
      } catch (err) {
        reject(new Error(`Failed to parse Lighthouse output: ${err.message}`));
      }
    });
  });
}

/**
 * Extract CLS data from Lighthouse report
 */
function extractCLSData(report) {
  const clsAudit = report.audits["cumulative-layout-shift"];
  const lcp = report.audits["largest-contentful-paint"];
  const tbt = report.audits["total-blocking-time"];

  return {
    cls: clsAudit.numericValue,
    clsDisplay: clsAudit.displayValue,
    clsScore: clsAudit.score,
    lcp: lcp.numericValue,
    tbt: tbt.numericValue,
    performanceScore: report.categories.performance.score * 100,
    shiftElements: clsAudit.details?.items || [],
  };
}

/**
 * Determine status emoji and color
 */
function getStatus(cls) {
  if (cls <= CLS_THRESHOLD) return { emoji: "✅", label: "GOOD", color: "\x1b[32m" };
  if (cls <= CLS_POOR_THRESHOLD)
    return { emoji: "⚠️", label: "NEEDS IMPROVEMENT", color: "\x1b[33m" };
  return { emoji: "🔴", label: "POOR", color: "\x1b[31m" };
}

/**
 * Format results table
 */
function formatResultsTable(results) {
  console.log("\n📊 Results Summary");
  console.log("━".repeat(80));

  // Group by page
  const byPage = results.reduce((acc, r) => {
    if (!acc[r.page]) acc[r.page] = [];
    acc[r.page].push(r);
    return acc;
  }, {});

  for (const [page, pageResults] of Object.entries(byPage)) {
    console.log(`\n📄 ${page}`);
    console.log("─".repeat(80));

    for (const result of pageResults) {
      const status = getStatus(result.cls);
      console.log(
        `  ${status.emoji} ${status.color}${result.viewport.padEnd(25)}${"\x1b[0m"} CLS: ${result.cls.toFixed(3)} (${status.label})`,
      );
      if (verbose) {
        console.log(`     LCP: ${result.lcp}ms | TBT: ${result.tbt}ms | Perf: ${result.performanceScore.toFixed(0)}`);
        if (result.shiftElements.length > 0) {
          console.log(`     Layout shift elements: ${result.shiftElements.length}`);
        }
      }
    }
  }

  console.log("\n━".repeat(80));
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`🔴 Failed: ${failedTests}/${totalTests}`);

  const avgCLS =
    results.reduce((sum, r) => sum + r.cls, 0) / results.length;
  const worstCLS = Math.max(...results.map((r) => r.cls));
  const bestCLS = Math.min(...results.map((r) => r.cls));

  console.log(`\n📈 Statistics:`);
  console.log(`   Average CLS: ${avgCLS.toFixed(3)}`);
  console.log(`   Best CLS: ${bestCLS.toFixed(3)}`);
  console.log(`   Worst CLS: ${worstCLS.toFixed(3)}`);
  console.log("━".repeat(80));
}

/**
 * Save detailed JSON report
 */
function saveReport(results) {
  const reportsDir = join(process.cwd(), "reports");
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `cls-report-${timestamp}.json`;
  const filepath = join(reportsDir, filename);

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    threshold: CLS_THRESHOLD,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      avgCLS: results.reduce((sum, r) => sum + r.cls, 0) / results.length,
      worstCLS: Math.max(...results.map((r) => r.cls)),
      bestCLS: Math.min(...results.map((r) => r.cls)),
    },
    results: results.map((r) => ({
      page: r.page,
      url: r.url,
      viewport: r.viewport,
      cls: r.cls,
      lcp: r.lcp,
      tbt: r.tbt,
      performanceScore: r.performanceScore,
      shiftElements: r.shiftElements,
    })),
  };

  writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved: ${filepath}`);
}

/**
 * Main execution
 */
async function main() {
  for (const page of PAGES) {
    for (const viewport of VIEWPORTS) {
      const url = `${BASE_URL}${page.path}`;
      const testName = `${page.name} - ${viewport.name}`;

      process.stdout.write(
        `⏳ Testing ${testName}... (${completedTests + 1}/${totalTests})`,
      );

      try {
        const report = await runLighthouse(url, viewport, page.name);
        const data = extractCLSData(report);
        const status = getStatus(data.cls);

        results.push({
          page: page.name,
          url,
          viewport: viewport.name,
          cls: data.cls,
          lcp: data.lcp,
          tbt: data.tbt,
          performanceScore: data.performanceScore,
          shiftElements: data.shiftElements,
        });

        if (data.cls <= CLS_THRESHOLD) {
          passedTests++;
        } else {
          failedTests++;
        }

        // Clear line and show result
        process.stdout.write(
          `\r${status.emoji} ${testName.padEnd(50)} CLS: ${data.cls.toFixed(3)}\n`,
        );
      } catch (error) {
        process.stdout.write(`\r🔴 ${testName.padEnd(50)} ERROR\n`);
        console.error(`   Error: ${error.message}`);
        failedTests++;
      }

      completedTests++;
    }
  }

  formatResultsTable(results);
  saveReport(results);

  // Exit with error code if any tests failed
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if server is running
console.log(`🔌 Checking if server is running at ${BASE_URL}...`);
try {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }
  console.log("✅ Server is running\n");
} catch (error) {
  console.error(`🔴 Cannot connect to ${BASE_URL}`);
  console.error(
    "   Please start the server first: npm run preview (for production) or npm run dev (for development)",
  );
  process.exit(1);
}

main().catch((error) => {
  console.error("\n🔴 Fatal error:", error);
  process.exit(1);
});
