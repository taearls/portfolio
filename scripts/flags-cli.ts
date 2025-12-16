#!/usr/bin/env npx tsx
/**
 * Feature Flags CLI
 *
 * GitOps-style management of feature flags via flipt.yaml
 *
 * Commands:
 *   list              - List all flags and their current state
 *   enable <flag>     - Enable a flag (build-time or runtime)
 *   disable <flag>    - Disable a flag
 *   sync              - Sync runtime flags to Cloudflare Worker KV
 *   status            - Show flag status summary
 *
 * Usage:
 *   npx tsx scripts/flags-cli.ts list
 *   npx tsx scripts/flags-cli.ts enable contact_form
 *   npx tsx scripts/flags-cli.ts disable contact_form
 *   npx tsx scripts/flags-cli.ts sync
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const CONFIG_PATH = resolve(process.cwd(), "flipt.yaml");

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

function loadConfig(): FliptConfig {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`Error: flipt.yaml not found at ${CONFIG_PATH}`);
    process.exit(1);
  }

  const content = readFileSync(CONFIG_PATH, "utf-8");
  return parseYaml(content) as FliptConfig;
}

function saveConfig(config: FliptConfig): void {
  const content = stringifyYaml(config, {
    lineWidth: 0,
    defaultStringType: "QUOTE_DOUBLE",
  });
  writeFileSync(CONFIG_PATH, content, "utf-8");
}

function listFlags(): void {
  const config = loadConfig();

  console.log("\n=== Feature Flags ===\n");

  console.log("Build-time Flags (tree-shakeable):");
  console.log("─".repeat(50));
  if (config.build_time_flags) {
    for (const [key, value] of Object.entries(config.build_time_flags)) {
      const status = value.enabled ? "✅ enabled" : "❌ disabled";
      console.log(`  ${key}: ${status}`);
      if (value.description) {
        console.log(`    └─ ${value.description}`);
      }
    }
  } else {
    console.log("  (none defined)");
  }

  console.log("\nRuntime Flags (dynamic):");
  console.log("─".repeat(50));
  if (config.runtime_flags) {
    for (const [key, value] of Object.entries(config.runtime_flags)) {
      const status = value.enabled ? "✅ enabled" : "❌ disabled";
      console.log(`  ${key}: ${status}`);
      if (value.description) {
        console.log(`    └─ ${value.description}`);
      }
    }
  } else {
    console.log("  (none defined)");
  }

  console.log("\nEnvironment Overrides:");
  console.log("─".repeat(50));
  if (config.environments) {
    for (const [env, envConfig] of Object.entries(config.environments)) {
      console.log(`  ${env}:`);
      if (envConfig.build_time_flags) {
        for (const [key, value] of Object.entries(envConfig.build_time_flags)) {
          const status = value.enabled ? "✅" : "❌";
          console.log(`    build: ${key} = ${status}`);
        }
      }
      if (envConfig.runtime_flags) {
        for (const [key, value] of Object.entries(envConfig.runtime_flags)) {
          const status = value.enabled ? "✅" : "❌";
          console.log(`    runtime: ${key} = ${status}`);
        }
      }
    }
  }

  console.log("\n");
}

function enableFlag(flagKey: string): void {
  const config = loadConfig();
  let found = false;

  // Check build-time flags
  if (config.build_time_flags?.[flagKey] !== undefined) {
    config.build_time_flags[flagKey].enabled = true;
    found = true;
    console.log(`✅ Enabled build-time flag: ${flagKey}`);

    // Also update environment overrides
    if (config.environments) {
      for (const [env, envConfig] of Object.entries(config.environments)) {
        if (envConfig.build_time_flags?.[flagKey] !== undefined) {
          envConfig.build_time_flags[flagKey].enabled = true;
          console.log(`   └─ Updated ${env} environment`);
        }
      }
    }
  }

  // Check runtime flags
  if (config.runtime_flags?.[flagKey] !== undefined) {
    config.runtime_flags[flagKey].enabled = true;
    found = true;
    console.log(`✅ Enabled runtime flag: ${flagKey}`);

    if (config.environments) {
      for (const [env, envConfig] of Object.entries(config.environments)) {
        if (envConfig.runtime_flags?.[flagKey] !== undefined) {
          envConfig.runtime_flags[flagKey].enabled = true;
          console.log(`   └─ Updated ${env} environment`);
        }
      }
    }
  }

  if (!found) {
    console.error(`❌ Flag not found: ${flagKey}`);
    console.log("\nAvailable flags:");
    if (config.build_time_flags) {
      console.log(
        "  Build-time:",
        Object.keys(config.build_time_flags).join(", "),
      );
    }
    if (config.runtime_flags) {
      console.log("  Runtime:", Object.keys(config.runtime_flags).join(", "));
    }
    process.exit(1);
  }

  saveConfig(config);
  console.log("\n💾 Changes saved to flipt.yaml");
  console.log(
    "📝 Remember to commit: git add flipt.yaml && git commit -m 'feat(flags): enable " +
      flagKey +
      "'",
  );
}

function disableFlag(flagKey: string): void {
  const config = loadConfig();
  let found = false;

  // Check build-time flags
  if (config.build_time_flags?.[flagKey] !== undefined) {
    config.build_time_flags[flagKey].enabled = false;
    found = true;
    console.log(`❌ Disabled build-time flag: ${flagKey}`);

    if (config.environments) {
      for (const [env, envConfig] of Object.entries(config.environments)) {
        if (envConfig.build_time_flags?.[flagKey] !== undefined) {
          envConfig.build_time_flags[flagKey].enabled = false;
          console.log(`   └─ Updated ${env} environment`);
        }
      }
    }
  }

  // Check runtime flags
  if (config.runtime_flags?.[flagKey] !== undefined) {
    config.runtime_flags[flagKey].enabled = false;
    found = true;
    console.log(`❌ Disabled runtime flag: ${flagKey}`);

    if (config.environments) {
      for (const [env, envConfig] of Object.entries(config.environments)) {
        if (envConfig.runtime_flags?.[flagKey] !== undefined) {
          envConfig.runtime_flags[flagKey].enabled = false;
          console.log(`   └─ Updated ${env} environment`);
        }
      }
    }
  }

  if (!found) {
    console.error(`❌ Flag not found: ${flagKey}`);
    process.exit(1);
  }

  saveConfig(config);
  console.log("\n💾 Changes saved to flipt.yaml");
  console.log(
    "📝 Remember to commit: git add flipt.yaml && git commit -m 'feat(flags): disable " +
      flagKey +
      "'",
  );
}

async function syncToWorker(): Promise<void> {
  const config = loadConfig();

  console.log("\n=== Syncing Runtime Flags to Cloudflare Worker ===\n");

  // Build the runtime flags object in the format the Worker expects
  const runtimeFlags: Record<
    string,
    { enabled: boolean; message?: string | null }
  > = {};

  // Get production runtime flags
  const prodFlags =
    config.environments?.production?.runtime_flags ??
    config.runtime_flags ??
    {};

  for (const [key, value] of Object.entries(prodFlags)) {
    // Convert snake_case to kebab-case for the API
    const apiKey = key.replace(/_/g, "-");
    runtimeFlags[apiKey] = {
      enabled: value.enabled,
      message: value.message,
    };
  }

  console.log("Flags to sync:");
  for (const [key, value] of Object.entries(runtimeFlags)) {
    const status = value.enabled ? "✅" : "❌";
    console.log(`  ${key}: ${status}`);
  }

  console.log("\n📋 To sync manually, run:");
  console.log(
    'npx wrangler kv key put --binding=FEATURE_FLAGS --preview false "flags" \\',
  );
  console.log(`  '${JSON.stringify(runtimeFlags)}' \\`);
  console.log("  --config packages/feature-flags/wrangler.toml");

  console.log(
    "\n✨ Or deploy the Worker which will use these flags as defaults",
  );
}

function showStatus(): void {
  const config = loadConfig();

  const buildTimeEnabled = Object.values(config.build_time_flags ?? {}).filter(
    (f) => f.enabled,
  ).length;
  const buildTimeTotal = Object.keys(config.build_time_flags ?? {}).length;

  const runtimeEnabled = Object.values(config.runtime_flags ?? {}).filter(
    (f) => f.enabled,
  ).length;
  const runtimeTotal = Object.keys(config.runtime_flags ?? {}).length;

  console.log("\n=== Feature Flags Status ===\n");
  console.log(
    `Build-time flags: ${buildTimeEnabled}/${buildTimeTotal} enabled`,
  );
  console.log(`Runtime flags: ${runtimeEnabled}/${runtimeTotal} enabled`);
  console.log(`\nNamespace: ${config.namespace}`);
  console.log(`Config version: ${config.version}`);
  console.log(`\nConfig path: ${CONFIG_PATH}`);
}

function showHelp(): void {
  console.log(`
Feature Flags CLI

Usage: npx tsx scripts/flags-cli.ts <command> [args]

Commands:
  list              List all flags and their current state
  enable <flag>     Enable a flag (updates flipt.yaml)
  disable <flag>    Disable a flag (updates flipt.yaml)
  sync              Show commands to sync runtime flags to Worker
  status            Show flag status summary

Examples:
  npx tsx scripts/flags-cli.ts list
  npx tsx scripts/flags-cli.ts enable contact_form
  npx tsx scripts/flags-cli.ts disable email_contact_form
  npx tsx scripts/flags-cli.ts sync
  npx tsx scripts/flags-cli.ts status

GitOps Workflow:
  1. Edit flags with 'enable' or 'disable' commands
  2. Review changes: git diff flipt.yaml
  3. Commit: git add flipt.yaml && git commit -m "feat(flags): ..."
  4. Push to deploy (CI/CD will rebuild with new flags)
`);
}

// Main CLI logic
const [, , command, ...args] = process.argv;

switch (command) {
  case "list":
    listFlags();
    break;
  case "enable":
    if (!args[0]) {
      console.error("Error: Missing flag name");
      console.log("Usage: npx tsx scripts/flags-cli.ts enable <flag_name>");
      process.exit(1);
    }
    enableFlag(args[0]);
    break;
  case "disable":
    if (!args[0]) {
      console.error("Error: Missing flag name");
      console.log("Usage: npx tsx scripts/flags-cli.ts disable <flag_name>");
      process.exit(1);
    }
    disableFlag(args[0]);
    break;
  case "sync":
    syncToWorker();
    break;
  case "status":
    showStatus();
    break;
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    if (command) {
      console.error(`Unknown command: ${command}`);
    }
    showHelp();
    process.exit(command ? 1 : 0);
}
