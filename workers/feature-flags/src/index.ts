/**
 * Cloudflare Worker for Feature Flags API
 *
 * Provides a runtime-configurable feature flag system using Cloudflare Workers + KV
 * for the portfolio website. Enables/disables features without redeployment.
 */

interface FeatureFlags {
  "email-contact-form": {
    enabled: boolean;
    message?: string;
  };
}

interface Env {
  FEATURE_FLAGS_KV: KVNamespace;
  ADMIN_API_KEY?: string;
  ALLOWED_ORIGINS?: string; // Comma-separated list
}

const DEFAULT_FLAGS: FeatureFlags = {
  "email-contact-form": {
    enabled: false, // Safe default - disabled until explicitly enabled
  },
};

const CACHE_TTL = 60; // 1 minute cache
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window

/**
 * Main request handler
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // Get allowed origins from environment or use defaults
    const allowedOrigins = env.ALLOWED_ORIGINS
      ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : [
          "https://tylerearls.com",
          "http://localhost:3000",
          "http://localhost:4173",
        ];

    const corsHeaders = getCorsHeaders(
      request.headers.get("Origin"),
      allowedOrigins,
    );

    // Handle OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Rate limiting
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const isRateLimited = await checkRateLimit(clientIP, env.FEATURE_FLAGS_KV);

    if (isRateLimited) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        },
      );
    }

    // Route handlers
    if (request.method === "GET" && url.pathname === "/api/flags") {
      return handleGetFlags(request, env, ctx, corsHeaders);
    }

    if (request.method === "PUT" && url.pathname === "/api/flags") {
      return handlePutFlags(request, env, corsHeaders);
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({
        error: "Not Found",
        message: "The requested endpoint does not exist",
      }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  },
};

/**
 * GET /api/flags - Public endpoint to fetch feature flags
 */
async function handleGetFlags(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  try {
    // Check cache first (using Cloudflare's Cache API)
    const cache = caches.default;
    let response = await cache.match(request);

    if (response) {
      // Add CORS headers to cached response
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          ...corsHeaders,
        },
      });
      return response;
    }

    // Fetch from KV
    const flagsJson = await env.FEATURE_FLAGS_KV.get("feature_flags", "text");
    const flags: FeatureFlags = flagsJson
      ? JSON.parse(flagsJson)
      : DEFAULT_FLAGS;

    // Validate flags structure
    if (!isValidFeatureFlags(flags)) {
      console.error("Invalid feature flags structure in KV:", flags);
      // Return default flags on validation failure
      const safeFlags = DEFAULT_FLAGS;
      response = createFlagsResponse(safeFlags, corsHeaders);
    } else {
      response = createFlagsResponse(flags, corsHeaders);
    }

    // Cache the response (waitUntil to not block response)
    ctx.waitUntil(cache.put(request, response.clone()));

    return response;
  } catch (error) {
    console.error("Error fetching feature flags:", error);

    // Return default flags on error (safe fallback)
    return createFlagsResponse(DEFAULT_FLAGS, corsHeaders);
  }
}

/**
 * PUT /api/flags - Admin endpoint to update feature flags
 */
async function handlePutFlags(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  // Authentication check
  const apiKey = request.headers.get("X-API-Key");

  if (!apiKey || !env.ADMIN_API_KEY || apiKey !== env.ADMIN_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: "Valid API key required",
      }),
      {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "WWW-Authenticate": "API-Key",
        },
      },
    );
  }

  try {
    // Parse and validate request body
    const flags = (await request.json()) as FeatureFlags;

    if (!isValidFeatureFlags(flags)) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Invalid feature flags structure",
          expected: {
            "email-contact-form": {
              enabled: "boolean",
              message: "string (optional)",
            },
          },
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Store in KV
    await env.FEATURE_FLAGS_KV.put("feature_flags", JSON.stringify(flags));

    // Purge cache for GET endpoint
    const cache = caches.default;
    const flagsUrl = new URL("/api/flags", request.url);
    const flagsRequest = new Request(flagsUrl.toString(), {
      method: "GET",
    });
    await cache.delete(flagsRequest);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Feature flags updated successfully",
        flags,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error updating feature flags:", error);

    const errorMessage =
      error instanceof SyntaxError
        ? "Invalid JSON in request body"
        : "Internal server error";

    return new Response(
      JSON.stringify({
        error: "Server Error",
        message: errorMessage,
      }),
      {
        status: error instanceof SyntaxError ? 400 : 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

/**
 * Create a standardized flags response with proper headers
 */
function createFlagsResponse(
  flags: FeatureFlags,
  corsHeaders: Record<string, string>,
): Response {
  const body = JSON.stringify(flags);
  const etag = generateETag(body);

  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL}, stale-while-revalidate=30`,
      ETag: etag,
    },
  });
}

/**
 * Generate ETag for response caching
 */
function generateETag(content: string): string {
  // Simple hash for ETag (could use crypto.subtle for better hash)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Get CORS headers based on origin
 */
function getCorsHeaders(
  origin: string | null,
  allowedOrigins: Array<string>,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    "Access-Control-Max-Age": "86400",
  };

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  } else {
    // Default to first allowed origin for non-matching origins
    headers["Access-Control-Allow-Origin"] = allowedOrigins[0];
  }

  return headers;
}

/**
 * Type guard for FeatureFlags
 */
function isValidFeatureFlags(data: unknown): data is FeatureFlags {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const flags = data as Record<string, unknown>;

  // Check email-contact-form structure
  if (
    typeof flags["email-contact-form"] !== "object" ||
    flags["email-contact-form"] === null
  ) {
    return false;
  }

  const emailContactForm = flags["email-contact-form"] as Record<
    string,
    unknown
  >;

  if (typeof emailContactForm.enabled !== "boolean") {
    return false;
  }

  if (
    emailContactForm.message !== undefined &&
    typeof emailContactForm.message !== "string"
  ) {
    return false;
  }

  return true;
}

/**
 * Rate limiting check using KV
 */
async function checkRateLimit(
  clientIP: string,
  kv: KVNamespace,
): Promise<boolean> {
  const key = `rate_limit:${clientIP}`;
  const countStr = await kv.get(key);

  if (!countStr) {
    // First request - set count to 1
    await kv.put(key, "1", { expirationTtl: RATE_LIMIT_WINDOW });
    return false;
  }

  const count = parseInt(countStr, 10);

  if (count >= RATE_LIMIT_MAX) {
    return true; // Rate limited
  }

  // Increment counter
  await kv.put(key, (count + 1).toString(), {
    expirationTtl: RATE_LIMIT_WINDOW,
  });
  return false;
}
