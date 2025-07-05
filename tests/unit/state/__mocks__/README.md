# Theme Mock Utilities

This directory contains shared mock utilities for theme-related tests.

## Available Utilities

### `setupMatchMediaMock(matches: boolean)`

Sets up a mock for `window.matchMedia` that returns the specified `matches` value.

**Usage:**

```typescript
import { setupMatchMediaMock } from "./__mocks__/themeMocks.ts";

// Mock light mode preference
setupMatchMediaMock(false);

// Mock dark mode preference
setupMatchMediaMock(true);
```

### `setupDocumentElementMock()`

Sets up a mock for `document.documentElement` with a classList that can be spied on.

**Usage:**

```typescript
import { setupDocumentElementMock } from "./__mocks__/themeMocks.ts";

const mockElement = setupDocumentElementMock();
// Now you can spy on mockElement.classList.add and mockElement.classList.remove
```

### `setupThemeMocks(prefersDark: boolean = false)`

Convenience function that sets up both matchMedia and documentElement mocks.

**Usage:**

```typescript
import { setupThemeMocks } from "./__mocks__/themeMocks.ts";

const { mockElement } = setupThemeMocks(true); // Dark mode
```

## Best Practices

1. **Set up mocks before importing modules** - If you need to test initial state based on system preferences, set up the mock before importing the module that uses `getInitialThemeState()`.

2. **Use in beforeEach** - For tests that need consistent mocks, set them up in `beforeEach` to ensure a clean state for each test.

3. **Reset to defaults** - Always reset mocks to their default state (usually light mode) in `beforeEach` unless the specific test requires a different state.

## Example

```typescript
import { setupMatchMediaMock, setupDocumentElementMock } from "./__mocks__/themeMocks.ts";

describe("Theme functionality", () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = setupDocumentElementMock();
    setupMatchMediaMock(false); // Default to light mode
  });

  it("should handle dark mode preference", () => {
    setupMatchMediaMock(true); // Override for this test
    // ... test logic
  });
});
```
