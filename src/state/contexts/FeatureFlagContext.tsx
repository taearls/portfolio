/**
 * Feature Flag Context
 *
 * Provides runtime-configurable feature flags fetched from Cloudflare Worker
 * with multi-layer caching and safe defaults
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_FLAGS, type FeatureFlags } from '@/types/featureFlags';

interface FeatureFlagContextValue {
	flags: FeatureFlags;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

const FEATURE_FLAGS_URL = import.meta.env.VITE_FEATURE_FLAGS_API_URL;
const CACHE_KEY = 'portfolio:feature-flags';
const CACHE_TTL = 60_000; // 1 minute (matches Worker cache)
const REFETCH_INTERVAL = 60_000; // 1 minute
const REQUEST_TIMEOUT = 5_000; // 5 seconds

interface CachedFlags {
	flags: FeatureFlags;
	timestamp: number;
}

/**
 * Get flags from localStorage cache
 */
function getCachedFlags(): FeatureFlags | null {
	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (!cached) return null;

		const { flags, timestamp }: CachedFlags = JSON.parse(cached);
		const age = Date.now() - timestamp;

		if (age > CACHE_TTL) {
			// Cache expired
			localStorage.removeItem(CACHE_KEY);
			return null;
		}

		return flags;
	} catch (error) {
		console.error('Error reading cached feature flags:', error);
		return null;
	}
}

/**
 * Save flags to localStorage cache
 */
function setCachedFlags(flags: FeatureFlags): void {
	try {
		const cached: CachedFlags = {
			flags,
			timestamp: Date.now(),
		};
		localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
	} catch (error) {
		console.error('Error caching feature flags:', error);
	}
}

/**
 * Fetch flags from Worker with timeout
 */
async function fetchFlags(): Promise<FeatureFlags> {
	if (!FEATURE_FLAGS_URL) {
		throw new Error('VITE_FEATURE_FLAGS_API_URL environment variable not configured');
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

	try {
		const response = await fetch(FEATURE_FLAGS_URL, {
			signal: controller.signal,
			headers: {
				Accept: 'application/json',
			},
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`Failed to fetch feature flags: ${response.status} ${response.statusText}`);
		}

		const flags = (await response.json()) as FeatureFlags;
		return flags;
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new Error('Feature flags request timed out');
			}
			throw error;
		}

		throw new Error('Unknown error fetching feature flags');
	}
}

interface FeatureFlagProviderProps {
	children: ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
	const [flags, setFlags] = useState<FeatureFlags>(() => {
		// Try to load from cache first for instant display
		const cached = getCachedFlags();
		return cached ?? DEFAULT_FLAGS;
	});

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadFlags = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const fetchedFlags = await fetchFlags();

			setFlags(fetchedFlags);
			setCachedFlags(fetchedFlags);
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to load feature flags');
			console.error('Feature flags error:', error);
			setError(error);

			// On error, keep existing flags (cached or default)
			// Don't reset to DEFAULT_FLAGS to preserve last known good state
		} finally {
			setIsLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		loadFlags();
	}, []);

	// Periodic refetch
	useEffect(() => {
		const interval = setInterval(() => {
			loadFlags();
		}, REFETCH_INTERVAL);

		return () => clearInterval(interval);
	}, []);

	const value: FeatureFlagContextValue = {
		flags,
		isLoading,
		error,
		refetch: loadFlags,
	};

	return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

/**
 * Hook to access feature flags context
 */
export function useFeatureFlags(): FeatureFlagContextValue {
	const context = useContext(FeatureFlagContext);

	if (context === undefined) {
		throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
	}

	return context;
}

/**
 * Hook to check if a specific feature is enabled
 */
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
	const { flags } = useFeatureFlags();
	return flags[feature].enabled;
}

/**
 * Hook to get contact form configuration
 */
export function useContactFormFlag() {
	const { flags } = useFeatureFlags();
	return flags.contactForm;
}
