/**
 * Unit tests for FeatureFlagContext
 */

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	FeatureFlagProvider,
	useContactFormFlag,
	useFeatureFlag,
	useFeatureFlags,
} from '@/state/contexts/FeatureFlagContext';
import { DEFAULT_FLAGS, type FeatureFlags } from '@/types/featureFlags';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
const localStorageMock = {
	getItem: (key: string) => mockLocalStorage[key] ?? null,
	setItem: (key: string, value: string) => {
		mockLocalStorage[key] = value;
	},
	removeItem: (key: string) => {
		delete mockLocalStorage[key];
	},
	clear: () => {
		Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
	},
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock environment variable
vi.stubEnv('VITE_FEATURE_FLAGS_API_URL', 'http://localhost:8787/api/flags');

describe('FeatureFlagContext', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('FeatureFlagProvider', () => {
		it('should provide default flags initially', () => {
			function TestComponent() {
				const { flags } = useFeatureFlags();
				return <div>{flags.contactForm.enabled ? 'enabled' : 'disabled'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			expect(screen.getByText('disabled')).toBeInTheDocument();
		});

		it('should fetch flags from API on mount', async () => {
			const mockFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
					message: 'Contact form is enabled',
				},
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFlags,
			});

			function TestComponent() {
				const { flags, isLoading } = useFeatureFlags();
				return (
					<div>
						{isLoading ? 'loading' : flags.contactForm.enabled ? 'enabled' : 'disabled'}
					</div>
				);
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			expect(screen.getByText('loading')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText('enabled')).toBeInTheDocument();
			});

			expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/api/flags', {
				signal: expect.any(AbortSignal),
				headers: {
					Accept: 'application/json',
				},
			});
		});

		it('should cache flags in localStorage', async () => {
			const mockFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
				},
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFlags,
			});

			function TestComponent() {
				const { flags } = useFeatureFlags();
				return <div>{flags.contactForm.enabled ? 'enabled' : 'disabled'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			await waitFor(() => {
				const cached = localStorageMock.getItem('portfolio:feature-flags');
				expect(cached).toBeDefined();
				const parsed = JSON.parse(cached!);
				expect(parsed.flags).toEqual(mockFlags);
				expect(parsed.timestamp).toBeDefined();
			});
		});

		it('should load flags from cache if available', () => {
			const cachedFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
					message: 'Cached message',
				},
			};

			localStorageMock.setItem(
				'portfolio:feature-flags',
				JSON.stringify({
					flags: cachedFlags,
					timestamp: Date.now(),
				}),
			);

			function TestComponent() {
				const { flags } = useFeatureFlags();
				return <div>{flags.contactForm.enabled ? 'enabled' : 'disabled'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			// Should immediately show cached value
			expect(screen.getByText('enabled')).toBeInTheDocument();
		});

		it('should fall back to default flags on fetch error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			function TestComponent() {
				const { flags, error } = useFeatureFlags();
				return (
					<div>
						<div>{flags.contactForm.enabled ? 'enabled' : 'disabled'}</div>
						<div>{error ? 'error' : 'no-error'}</div>
					</div>
				);
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('disabled')).toBeInTheDocument();
				expect(screen.getByText('error')).toBeInTheDocument();
			});
		});

		it('should handle fetch timeout', async () => {
			mockFetch.mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(
							() =>
								resolve({
									ok: true,
									json: async () => DEFAULT_FLAGS,
								}),
							10000,
						);
					}),
			);

			function TestComponent() {
				const { error } = useFeatureFlags();
				return <div>{error ? error.message : 'no-error'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			// Fast-forward past timeout (5 seconds)
			await vi.advanceTimersByTimeAsync(6000);

			await waitFor(() => {
				expect(screen.getByText(/timed out/i)).toBeInTheDocument();
			});
		});

		it('should refetch flags periodically', async () => {
			const mockFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
				},
			};

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockFlags,
			});

			function TestComponent() {
				const { flags } = useFeatureFlags();
				return <div>{flags.contactForm.enabled ? 'enabled' : 'disabled'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			// Initial fetch
			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(1);
			});

			// Fast-forward 1 minute (refetch interval)
			await vi.advanceTimersByTimeAsync(60000);

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe('useFeatureFlag hook', () => {
		it('should return boolean flag status', async () => {
			const mockFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
				},
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFlags,
			});

			function TestComponent() {
				const isEnabled = useFeatureFlag('contactForm');
				return <div>{isEnabled ? 'enabled' : 'disabled'}</div>;
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('enabled')).toBeInTheDocument();
			});
		});
	});

	describe('useContactFormFlag hook', () => {
		it('should return contact form configuration', async () => {
			const mockFlags: FeatureFlags = {
				contactForm: {
					enabled: true,
					message: 'Custom message',
				},
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFlags,
			});

			function TestComponent() {
				const contactForm = useContactFormFlag();
				return (
					<div>
						<div>{contactForm.enabled ? 'enabled' : 'disabled'}</div>
						<div>{contactForm.message}</div>
					</div>
				);
			}

			render(
				<FeatureFlagProvider>
					<TestComponent />
				</FeatureFlagProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('enabled')).toBeInTheDocument();
				expect(screen.getByText('Custom message')).toBeInTheDocument();
			});
		});
	});

	describe('Error handling', () => {
		it('should throw error if used outside provider', () => {
			// Suppress console.error for this test
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			function TestComponent() {
				useFeatureFlags();
				return <div>test</div>;
			}

			expect(() => render(<TestComponent />)).toThrow(
				'useFeatureFlags must be used within a FeatureFlagProvider',
			);

			consoleSpy.mockRestore();
		});
	});
});
