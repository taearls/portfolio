# Scripts

Utility scripts for the portfolio project.

## CLS Measurement (`measure-cls.mjs`)

Automated Cumulative Layout Shift (CLS) measurement using Google Lighthouse.

### Usage

```bash
# Production build measurement (recommended)
npm run measure:cls

# Mobile viewports only
npm run measure:cls:mobile

# Desktop viewports only
npm run measure:cls:desktop

# Quick check during development (no build required)
npm run measure:cls:dev

# Custom URL
npm run measure:cls -- --url=http://localhost:4173/code

# Verbose output
npm run measure:cls -- --verbose
```

### Output

- **Console:** Formatted table with results for all pages/viewports
- **JSON Report:** Saved to `reports/cls-report-{timestamp}.json`
- **Exit Code:** 0 if all tests pass, 1 if any fail

### Configuration

Edit `scripts/measure-cls.mjs` to customize:
- Pages to test (default: Home, Code, Contact)
- Viewports (default: iPhone 13, Pixel 5, Desktop, Tablet)
- CLS thresholds (default: 0.1 good, 0.25 poor)

See [CLS Diagnostics Guide](../docs/CLS_DIAGNOSTICS.md) for full documentation.
