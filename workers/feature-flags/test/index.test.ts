/**
 * Feature Flags Worker Tests
 *
 * Tests the Cloudflare Worker implementation using Vitest with Workers pool
 */

import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";

// Mock KV namespace for testing
const mockKVNamespace = {
  get: async (key: string) => {
    if (key === "feature_flags") {
      return JSON.stringify({
        contactForm: {
          enabled: true,
          message: "Test message",
        },
      });
    }
    // Return null for rate_limit keys (allow requests)
    if (key.startsWith("rate_limit:")) {
      return null;
    }
    return null;
  },
  put: async () => {},
  delete: async () => {},
  list: async () => ({ keys: [], list_complete: true, cursor: "" }),
};

describe("Feature Flags Worker", () => {
  beforeEach(() => {
    // Reset any mocks if needed
  });

  describe("GET /api/flags", () => {
    it("should return default flags when KV is empty", async () => {
      const emptyKV = {
        ...mockKVNamespace,
        get: async () => null,
      };

      const request = new Request("http://localhost/api/flags", {
        method: "GET",
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: emptyKV as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/json");

      const flags = await response.json();
      expect(flags).toEqual({
        contactForm: {
          enabled: false, // Safe default
        },
      });
    });

    it("should return stored flags from KV", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "GET",
        headers: {
          Origin: "https://tylerearls.com",
        },
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: mockKVNamespace as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);

      const flags = await response.json();
      expect(flags.contactForm.enabled).toBe(true);
      expect(flags.contactForm.message).toBe("Test message");
    });

    it("should include proper cache headers", async () => {
      const request = new Request("http://localhost/api/flags");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: mockKVNamespace as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.headers.get("Cache-Control")).toMatch(/max-age=60/);
      expect(response.headers.get("ETag")).toBeTruthy();
    });

    it("should handle CORS for allowed origins", async () => {
      const request = new Request("http://localhost/api/flags", {
        headers: {
          Origin: "https://tylerearls.com",
        },
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: mockKVNamespace as any,
          ALLOWED_ORIGINS: "https://tylerearls.com,http://localhost:3000",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://tylerearls.com"
      );
      expect(response.headers.get("Vary")).toBe("Origin");
    });

    it("should handle CORS preflight (OPTIONS)", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "OPTIONS",
        headers: {
          Origin: "https://tylerearls.com",
        },
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: mockKVNamespace as any,
          ALLOWED_ORIGINS: "https://tylerearls.com",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(204);
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("GET");
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("PUT");
    });
  });

  describe("PUT /api/flags", () => {
    it("should reject requests without API key", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactForm: { enabled: true },
        }),
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: mockKVNamespace as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(401);
      expect(response.headers.get("WWW-Authenticate")).toBe("API-Key");
    });

    it("should reject requests with invalid API key", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "wrong-key",
        },
        body: JSON.stringify({
          contactForm: { enabled: true },
        }),
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: mockKVNamespace as any,
          ADMIN_API_KEY: "correct-key",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(401);
    });

    it("should accept valid requests with correct API key", async () => {
      let featureFlagsPutCalled = false;
      const putMock = {
        ...mockKVNamespace,
        put: async (key: string, value: string) => {
          // Allow rate_limit keys to pass through
          if (key.startsWith("rate_limit:")) {
            return;
          }
          // Validate feature_flags put
          if (key === "feature_flags") {
            featureFlagsPutCalled = true;
            const parsed = JSON.parse(value);
            expect(parsed.contactForm.enabled).toBe(false);
          }
        },
      };

      const request = new Request("http://localhost/api/flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify({
          contactForm: { enabled: false },
        }),
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: putMock as any,
          ADMIN_API_KEY: "test-api-key",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(featureFlagsPutCalled).toBe(true);
    });

    it("should reject invalid flag structure", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify({
          contactForm: { enabled: "not-a-boolean" }, // Invalid
        }),
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: mockKVNamespace as any,
          ADMIN_API_KEY: "test-api-key",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
    });

    it("should handle JSON parse errors", async () => {
      const request = new Request("http://localhost/api/flags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "test-api-key",
        },
        body: "invalid json",
      });

      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        {
          ...env,
          FEATURE_FLAGS_KV: mockKVNamespace as any,
          ADMIN_API_KEY: "test-api-key",
        },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.message).toContain("Invalid JSON");
    });
  });

  describe("Rate Limiting", () => {
    it("should rate limit excessive requests", async () => {
      const rateLimitKV = {
        ...mockKVNamespace,
        get: async (key: string) => {
          if (key.startsWith("rate_limit:")) {
            return "101"; // Over the limit
          }
          return mockKVNamespace.get(key);
        },
      };

      const request = new Request("http://localhost/api/flags");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: rateLimitKV as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("60");
    });
  });

  describe("Error Handling", () => {
    it("should return default flags on KV errors", async () => {
      const errorKV = {
        ...mockKVNamespace,
        get: async (key: string) => {
          // Allow rate_limit checks to pass
          if (key.startsWith("rate_limit:")) {
            return null;
          }
          // Throw error for feature_flags
          throw new Error("KV error");
        },
      };

      const request = new Request("http://localhost/api/flags");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: errorKV as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const flags = await response.json();
      expect(flags.contactForm.enabled).toBe(false); // Safe default
    });

    it("should return 404 for unknown routes", async () => {
      const request = new Request("http://localhost/api/unknown");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: mockKVNamespace as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(404);
    });
  });

  describe("Type Validation", () => {
    it("should validate contactForm.enabled is boolean", async () => {
      const invalidKV = {
        ...mockKVNamespace,
        get: async () =>
          JSON.stringify({
            contactForm: { enabled: "true" }, // String instead of boolean
          }),
      };

      const request = new Request("http://localhost/api/flags");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: invalidKV as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(200);
      const flags = await response.json();
      // Should return safe defaults on validation failure
      expect(flags.contactForm.enabled).toBe(false);
    });

    it("should allow optional message field", async () => {
      const request = new Request("http://localhost/api/flags");
      const ctx = createExecutionContext();
      const response = await worker.fetch(
        request,
        { ...env, FEATURE_FLAGS_KV: mockKVNamespace as any },
        ctx
      );
      await waitOnExecutionContext(ctx);

      const flags = await response.json();
      expect(flags.contactForm.message).toBe("Test message");
    });
  });
});
