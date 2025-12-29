export default {
  extends: [
    "stylelint-config-standard",
    "@dreamsicle.io/stylelint-config-tailwindcss",
  ],
  plugins: ["stylelint-order"],
  ignoreFiles: [
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "workers/**/node_modules/**",
    "tests/**",
  ],
  rules: {
    // CSS Modules support
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global", "local"] },
    ],

    // Allow camelCase for CSS Modules class names
    "selector-class-pattern": null,

    // Enforce consistent property order (alphabetical)
    // This makes properties easy to find and prevents duplicates
    "order/properties-alphabetical-order": [true, { severity: "warning" }],

    // Allow empty :root blocks (common for CSS custom properties setup)
    "block-no-empty": [true, { ignore: ["comments"] }],

    // Enforce shorthand hex when possible (#fff instead of #ffffff)
    "color-hex-length": "short",

    // Enforce consistent function name casing
    "function-name-case": "lower",

    // Prevent redundant longhand properties
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["flex-flow"] },
    ],

    // Allow font family names with quotes (they may contain spaces)
    "font-family-name-quotes": null,

    // Allow legacy rgba() function notation (commonly used in animations)
    "color-function-notation": null,

    // Allow decimal alpha values (0.5) in addition to percentages (50%)
    "alpha-value-notation": null,

    // Disable zero-unit rule - allows 0deg in animations for clarity
    "length-zero-no-unit": null,

    // Allow descending specificity (common in component CSS)
    "no-descending-specificity": null,

    // Allow custom property patterns with double-dashes (Tailwind generates these)
    "custom-property-pattern": null,

    // Allow PascalCase font-family names (e.g., "Asul", "Helvetica")
    "value-keyword-case": [
      "lower",
      { ignoreFunctions: ["local"], ignoreKeywords: [/^[A-Z]/] },
    ],

    // Allow traditional media query syntax (min-width: 640px)
    // Modern range syntax isn't universally supported yet
    "media-feature-range-notation": null,

    // Disable empty line rules for more compact CSS
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,

    // Allow camelCase keyframe names (common with CSS Modules)
    "keyframes-name-pattern": null,
  },
};
