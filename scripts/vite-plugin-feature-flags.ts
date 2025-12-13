/**
 * Vite Plugin: Feature Flags
 *
 * Reads feature flags from flipt.yaml and injects them as build-time constants.
 * This enables Rollup to tree-shake disabled feature code from the bundle.
 *
 * Usage in components:
 *   if (import.meta.env.FEATURE_CONTACT_FORM) {
 *     // This code is eliminated if FEATURE_CONTACT_FORM is false
 *   }
 *
 * @example
 * // vite.config.mts
 * import { featureFlagsPlugin } from './scripts/vite-plugin-feature-flags'
 *
 * export default defineConfig({
 *   plugins: [featureFlagsPlugin()],
 * })
 */

import type { Plugin } from "vite";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse as parseYaml } from "yaml";

interface FliptFlag {
  enabled: boolean;
  description?: string;
  message?: string | null;
}

interface FliptEnvironment {
  build_time_flags?: Record<string, FliptFlag>;
  runtime_flags?: Record<string, FliptFlag>;
}

interface FliptConfig {
  version: string;
  namespace: string;
  build_time_flags?: Record<string, FliptFlag>;
  runtime_flags?: Record<string, FliptFlag>;
  environments?: Record<string, FliptEnvironment>;
}

export interface FeatureFlagsPluginOptions {
  /**
   * Path to flipt.yaml configuration file
   * @default './flipt.yaml'
   */
  configPath?: string;

  /**
   * Prefix for environment variables
   * @default 'FEATURE_'
   */
  prefix?: string;

  /**
   * Whether to log flag values during build
   * @default true in development
   */
  verbose?: boolean;
}

/**
 * Convert snake_case to SCREAMING_SNAKE_CASE
 */
function toEnvKey(key: string, prefix: string): string {
  return `${prefix}${key.toUpperCase()}`;
}

/**
 * Load and parse flipt.yaml configuration
 */
function loadFliptConfig(configPath: string): FliptConfig | null {
  const absolutePath = resolve(process.cwd(), configPath);

  if (!existsSync(absolutePath)) {
    console.warn(`[feature-flags] Config file not found: ${absolutePath}`);
    return null;
  }

  try {
    const content = readFileSync(absolutePath, "utf-8");
    return parseYaml(content) as FliptConfig;
  } catch (error) {
    console.error(`[feature-flags] Error parsing ${configPath}:`, error);
    return null;
  }
}

/**
 * Get flags for a specific environment with fallback to base config
 */
function getFlagsForEnvironment(
  config: FliptConfig,
  environment: string,
): Record<string, boolean> {
  const flags: Record<string, boolean> = {};

  // Start with base build_time_flags
  if (config.build_time_flags) {
    for (const [key, value] of Object.entries(config.build_time_flags)) {
      flags[key] = value.enabled;
    }
  }

  // Override with environment-specific flags if available
  const envConfig = config.environments?.[environment];
  if (envConfig?.build_time_flags) {
    for (const [key, value] of Object.entries(envConfig.build_time_flags)) {
      flags[key] = value.enabled;
    }
  }

  return flags;
}

/**
 * Vite plugin that injects feature flags as build-time constants
 */
export function featureFlagsPlugin(
  options: FeatureFlagsPluginOptions = {},
): Plugin {
  const {
    configPath = "./flipt.yaml",
    prefix = "FEATURE_",
    verbose = process.env.NODE_ENV === "development",
  } = options;

  let flagDefines: Record<string, string> = {};

  return {
    name: "vite-plugin-feature-flags",
    enforce: "pre",

    config(_, { mode }) {
      const config = loadFliptConfig(configPath);

      if (!config) {
        console.warn("[feature-flags] Using default flags (all disabled)");
        return {};
      }

      const environment = mode === "production" ? "production" : "development";
      const flags = getFlagsForEnvironment(config, environment);

      // Build define object for Vite
      flagDefines = {};
      for (const [key, enabled] of Object.entries(flags)) {
        const envKey = `import.meta.env.${toEnvKey(key, prefix)}`;
        flagDefines[envKey] = JSON.stringify(enabled);
      }

      if (verbose) {
        console.log("\n[feature-flags] Build-time flags:");
        for (const [key, value] of Object.entries(flagDefines)) {
          console.log(`  ${key}: ${value}`);
        }
        console.log("");
      }

      return {
        define: flagDefines,
      };
    },

    // Provide flag values for import.meta.env type checking
    configResolved(resolvedConfig) {
      // Log final configuration
      if (verbose && resolvedConfig.command === "build") {
        console.log(
          "[feature-flags] Flags will be statically replaced during build",
        );
        console.log(
          "[feature-flags] Disabled features will be tree-shaken from bundle",
        );
      }
    },
  };
}

/**
 * Export flag configuration for use in other scripts
 */
export function getFeatureFlags(
  environment: "development" | "production" = "development",
  configPath = "./flipt.yaml",
): Record<string, boolean> {
  const config = loadFliptConfig(configPath);

  if (!config) {
    return {};
  }

  return getFlagsForEnvironment(config, environment);
}

/**
 * Get runtime flags configuration
 */
export function getRuntimeFlags(
  environment: "development" | "production" = "development",
  configPath = "./flipt.yaml",
): Record<string, FliptFlag> {
  const config = loadFliptConfig(configPath);

  if (!config) {
    return {};
  }

  const flags: Record<string, FliptFlag> = {};

  // Start with base runtime_flags
  if (config.runtime_flags) {
    for (const [key, value] of Object.entries(config.runtime_flags)) {
      flags[key] = value;
    }
  }

  // Override with environment-specific flags
  const envConfig = config.environments?.[environment];
  if (envConfig?.runtime_flags) {
    for (const [key, value] of Object.entries(envConfig.runtime_flags)) {
      flags[key] = { ...flags[key], ...value };
    }
  }

  return flags;
}

export default featureFlagsPlugin;
