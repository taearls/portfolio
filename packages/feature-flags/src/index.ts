import type { FeatureFlags } from "@portfolio/shared-types";

import { DEFAULT_FLAGS } from "@portfolio/shared-types";

interface Env {
  FEATURE_FLAGS: KVNamespace;
  ALLOWED_ORIGINS: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = env.ALLOWED_ORIGINS.split(",");

    const corsOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Origin": corsOrigin,
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/flags" && request.method === "GET") {
      try {
        const flagsJson = await env.FEATURE_FLAGS.get("flags");
        const flags: FeatureFlags = flagsJson
          ? JSON.parse(flagsJson)
          : DEFAULT_FLAGS;

        return new Response(JSON.stringify(flags), {
          headers: {
            "Cache-Control": "public, max-age=60",
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error("Error fetching flags:", error);
        return new Response(JSON.stringify(DEFAULT_FLAGS), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
          status: 500,
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
