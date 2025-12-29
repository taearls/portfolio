import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { FormEvent } from "react";

import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

import {
  API_URIS,
  EMAIL_REGEX,
  PORTFOLIO_EMAIL,
  TURNSTILE_SITE_KEY,
} from "@/util/constants.ts";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormError {
  message: string;
  fields?: Array<string>;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Array<string>;
  retryAfter?: number;
}

/**
 * ContactEmailForm - Email contact form for portfolio with Postmark integration
 *
 * Features:
 * - Cloudflare Turnstile CAPTCHA for spam protection
 * - Honeypot field for additional bot detection
 * - Server-side rate limiting (5 requests/hour/IP)
 * - Client-side email validation
 * - Loading, success, and error states
 * - Accessibility: ARIA attributes, screen reader announcements
 */
const ContactEmailForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    name: "",
    website: "", // Honeypot field
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<FormError | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const validateEmail = (email: string): boolean => {
    const regex = new RegExp(EMAIL_REGEX.source, "i");
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    // Client-side email validation
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Ensure Turnstile token is present
    if (!turnstileToken) {
      setError({ message: "Please complete the verification challenge" });
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(API_URIS.CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website, // Honeypot
          turnstileToken,
        }),
      });

      const data = (await response.json()) as ContactResponse;

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = data.retryAfter ?? 60;
          setError({
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          });
        } else if (response.status === 400 && data.details) {
          setError({
            message: "Please fix the following errors:",
            fields: data.details,
          });
        } else {
          const errorMessage =
            data.error ?? "Failed to send message. Please try again.";
          setError({
            message: errorMessage,
          });
        }
        setStatus("error");
        // Reset Turnstile on error
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setStatus("success");
      setFormData({ email: "", message: "", name: "", website: "" });
      // Reset Turnstile on success
      turnstileRef.current?.reset();
      setTurnstileToken(null);

      // Reset to idle after 5 seconds so user can submit again if needed
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (err) {
      console.error("Form submission error:", err);
      setError({
        message: "Network error. Please check your connection and try again.",
      });
      setStatus("error");
      // Reset Turnstile on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear email error when user starts typing
    if (name === "email" && emailError) {
      setEmailError(null);
    }
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setError({ message: "Verification failed. Please try again." });
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "" &&
    !emailError &&
    turnstileToken !== null;

  const isSubmitting = status === "submitting";

  return (
    <form
      id="contact-email-form"
      className="form-boxshadow mx-auto my-8 w-full max-w-sm rounded-md bg-gray-200 px-4 py-6 dark:bg-gray-900"
      method="POST"
      onSubmit={handleSubmit}
      aria-describedby={error ? "form-error" : undefined}
    >
      <fieldset className="space-y-4" disabled={isSubmitting}>
        <legend className="sr-only">Contact Form</legend>

        {/* Success Message */}
        {status === "success" && (
          <div
            role="alert"
            className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm">
              Thank you for reaching out. I&apos;ll get back to you soon.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            id="form-error"
            role="alert"
            className="rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            <p className="font-medium">{error.message}</p>
            {error.fields && (
              <ul className="mt-1 list-inside list-disc text-sm">
                {error.fields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            className="mb-1 block font-bold text-gray-800 dark:text-gray-200"
            htmlFor="contactName"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="contactName"
            className="form-input w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            maxLength={100}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            className="mb-1 block font-bold text-gray-800 dark:text-gray-200"
            htmlFor="contactEmail"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="contactEmail"
            className={`form-input w-full rounded border px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              emailError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-700"
            }`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            placeholder="beammeup@scotty.com"
            required
            aria-required="true"
            aria-invalid={emailError ? "true" : "false"}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {emailError}
            </p>
          )}
          <input type="hidden" name="to" value={PORTFOLIO_EMAIL} />
        </div>

        {/* Honeypot Field (hidden from users, visible to bots) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contactWebsite">Website</label>
          <input
            id="contactWebsite"
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Message Field */}
        <div>
          <label
            className="mb-1 block font-bold text-gray-800 dark:text-gray-200"
            htmlFor="contactMessage"
          >
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="contactMessage"
            className="form-textarea h-32 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            aria-required="true"
            maxLength={5000}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.message.length}/5000 characters
          </p>
        </div>

        {/* Cloudflare Turnstile Widget */}
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={handleTurnstileSuccess}
            onError={handleTurnstileError}
            onExpire={handleTurnstileExpire}
            options={{
              theme: "auto",
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="btn-accent bg-accent-hover ring-accent-focus flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
          >
            {isSubmitting && (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default ContactEmailForm;
