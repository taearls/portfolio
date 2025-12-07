/**
 * Contact Form Worker
 *
 * Handles contact form submissions with:
 * - Cloudflare Turnstile verification
 * - Honeypot spam detection
 * - Rate limiting
 * - Postmark email delivery
 */

interface Env {
  RATE_LIMIT?: KVNamespace;
  ALLOWED_ORIGINS: string;
  RECIPIENT_EMAIL: string;
  POSTMARK_SERVER_TOKEN: string;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT_MAX: string;
  RATE_LIMIT_WINDOW_SECONDS: string;
}

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  website?: string; // Honeypot field
  turnstileToken: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Array<string>;
  retryAfter?: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: Array<string>;
  challenge_ts?: string;
  hostname?: string;
}

// Email validation regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * Validate contact request body
 */
function validateContactRequest(body: unknown): {
  success: boolean;
  data?: ContactRequest;
  errors?: Array<string>;
} {
  const errors: Array<string> = [];

  if (!body || typeof body !== "object") {
    return { success: false, errors: ["Request body must be a JSON object"] };
  }

  const { name, email, message, website, turnstileToken } = body as Record<
    string,
    unknown
  >;

  // Name validation
  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length > 100) {
    errors.push("Name must be 100 characters or less");
  }

  // Email validation
  if (typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email format");
  }

  // Message validation
  if (typeof message !== "string" || message.trim().length === 0) {
    errors.push("Message is required");
  } else if (message.trim().length > 5000) {
    errors.push("Message must be 5000 characters or less");
  }

  // Turnstile token validation
  if (
    typeof turnstileToken !== "string" ||
    turnstileToken.trim().length === 0
  ) {
    errors.push("Turnstile verification is required");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      message: (message as string).trim(),
      website: typeof website === "string" ? website : undefined,
      turnstileToken: (turnstileToken as string).trim(),
    },
  };
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  clientIP: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", clientIP);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      },
    );

    const result = (await response.json()) as TurnstileVerifyResponse;

    if (!result.success) {
      console.error("Turnstile verification failed:", result["error-codes"]);
      return { success: false, error: "Turnstile verification failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Failed to verify Turnstile token" };
  }
}

/**
 * Check rate limit using KV storage
 */
async function checkRateLimit(
  kv: KVNamespace | undefined,
  clientIP: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  // If KV is not configured, allow all requests (development mode)
  if (!kv) {
    return { allowed: true, remaining: maxRequests };
  }

  const key = `rate-limit:${clientIP}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    const entry = await kv.get<RateLimitEntry>(key, "json");

    if (!entry) {
      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Check if window has expired
    if (now - entry.windowStart > windowMs) {
      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Check if rate limit exceeded
    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    return { allowed: true, remaining: maxRequests - entry.count - 1 };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Allow request if rate limit check fails
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Record request for rate limiting
 */
async function recordRequest(
  kv: KVNamespace | undefined,
  clientIP: string,
  windowSeconds: number,
): Promise<void> {
  if (!kv) return;

  const key = `rate-limit:${clientIP}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    const entry = await kv.get<RateLimitEntry>(key, "json");

    let newEntry: RateLimitEntry;

    if (!entry || now - entry.windowStart > windowMs) {
      // Start new window
      newEntry = { count: 1, windowStart: now };
    } else {
      // Increment count in current window
      newEntry = { count: entry.count + 1, windowStart: entry.windowStart };
    }

    await kv.put(key, JSON.stringify(newEntry), {
      expirationTtl: windowSeconds * 2,
    });
  } catch (error) {
    console.error("Rate limit record error:", error);
  }
}

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send email via Postmark API
 */
async function sendEmail(params: {
  serverToken: string;
  to: string;
  replyTo: string;
  name: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const { serverToken, to, replyTo, name, message } = params;

  // Use a verified sender domain address
  const fromAddress = "Portfolio Contact Form <contact@tylerearls.com>";

  try {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": serverToken,
      },
      body: JSON.stringify({
        From: fromAddress,
        To: to,
        ReplyTo: replyTo,
        Subject: `Portfolio Contact: ${name}`,
        TextBody: `
New contact form submission:

Name: ${name}
Email: ${replyTo}

Message:
${message}
        `.trim(),
        HtmlBody: `
<h2>New Portfolio Contact Form Submission</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> <a href="mailto:${escapeHtml(replyTo)}">${escapeHtml(replyTo)}</a></p>
<hr>
<h3>Message:</h3>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `.trim(),
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { Message?: string };
      console.error("Postmark API error:", errorData);
      return {
        success: false,
        error: errorData.Message ?? "Failed to send email",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle contact form submission
 */
async function handleContactSubmission(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response> {
  const clientIP = request.headers.get("CF-Connecting-IP") ?? "unknown";

  try {
    // Rate limit check
    const rateLimitResult = await checkRateLimit(
      env.RATE_LIMIT,
      clientIP,
      parseInt(env.RATE_LIMIT_MAX, 10),
      parseInt(env.RATE_LIMIT_WINDOW_SECONDS, 10),
    );

    if (!rateLimitResult.allowed) {
      const response: ContactResponse = {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      };
      return new Response(JSON.stringify(response), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimitResult.retryAfter),
          ...corsHeaders,
        },
      });
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const response: ContactResponse = {
        success: false,
        error: "Invalid JSON in request body",
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const validation = validateContactRequest(body);

    if (!validation.success || !validation.data) {
      const response: ContactResponse = {
        success: false,
        error: "Invalid request",
        details: validation.errors,
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check honeypot (spam detection)
    if (validation.data.website) {
      // Honeypot triggered - silently succeed to not reveal detection
      console.log("Honeypot triggered for IP:", clientIP);
      const response: ContactResponse = {
        success: true,
        message: "Message sent successfully",
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify Turnstile token
    const turnstileResult = await verifyTurnstileToken(
      validation.data.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      clientIP,
    );

    if (!turnstileResult.success) {
      const response: ContactResponse = {
        success: false,
        error:
          turnstileResult.error ?? "Verification failed. Please try again.",
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send email via Postmark
    const emailResult = await sendEmail({
      serverToken: env.POSTMARK_SERVER_TOKEN,
      to: env.RECIPIENT_EMAIL,
      replyTo: validation.data.email,
      name: validation.data.name,
      message: validation.data.message,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      const response: ContactResponse = {
        success: false,
        error: "Failed to send message. Please try again.",
      };
      return new Response(JSON.stringify(response), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Record successful request for rate limiting
    await recordRequest(
      env.RATE_LIMIT,
      clientIP,
      parseInt(env.RATE_LIMIT_WINDOW_SECONDS, 10),
    );

    const response: ContactResponse = {
      success: true,
      message: "Message sent successfully",
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    const response: ContactResponse = {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Origin": corsOrigin,
    };

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === "/health" && request.method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Contact form endpoint
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactSubmission(request, env, corsHeaders);
    }

    return new Response("Not Found", { status: 404 });
  },
};
