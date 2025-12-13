export interface ContactFormFlags {
  enabled: boolean;
  message?: string;
}

export interface FeatureFlags {
  contactForm: ContactFormFlags;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  contactForm: {
    enabled: false, // Safe default - disabled until explicitly enabled via Worker
  },
};

/**
 * Email validation regex
 * RFC 5322 compliant pattern for validating email addresses
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
