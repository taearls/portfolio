import { useRef } from "react";

/**
 * A custom React hook that executes a callback when a watched value changes.
 *
 * Uses the React-recommended pattern of comparing during render rather than
 * in a useEffect, which avoids the extra render cycle with stale values.
 *
 * @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 *
 * @param value - The prop or state value to watch for changes
 * @param onChange - Callback executed when value changes (receives previous and current values)
 * @param isEqual - Optional custom equality function (defaults to strict equality ===)
 *
 * @example
 * // Reset selection when items array changes
 * function List({ items }) {
 *   const [selection, setSelection] = useState(null);
 *
 *   useOnPropChange(items, (prevItems, currentItems) => {
 *     setSelection(null);
 *   });
 *
 *   return <ul>{...}</ul>;
 * }
 *
 * @example
 * // Track price trend direction
 * function PriceDisplay({ price }) {
 *   const [trend, setTrend] = useState<'up' | 'down' | null>(null);
 *
 *   useOnPropChange(price, (prev, current) => {
 *     setTrend(current > prev ? 'up' : 'down');
 *   });
 *
 *   return <span>{price} {trend === 'up' ? '📈' : '📉'}</span>;
 * }
 *
 * @example
 * // With custom equality for objects
 * function UserProfile({ user }) {
 *   useOnPropChange(
 *     user,
 *     (prevUser, currentUser) => {
 *       console.log('User changed from', prevUser.id, 'to', currentUser.id);
 *     },
 *     (a, b) => a.id === b.id
 *   );
 *
 *   return <div>{user.name}</div>;
 * }
 *
 * @important The onChange callback runs during render, so it should only be used
 * for state adjustments (calling setState). For side effects like API calls or
 * logging to external services, use useEffect instead.
 *
 * @note The default equality uses `===` which treats `NaN !== NaN`. If working
 * with values that may be NaN, consider using `Object.is` for the isEqual parameter.
 */
// Default equality function defined at module level for React Compiler optimization
function defaultIsEqual<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * This hook uses React's recommended pattern for adjusting state when props change.
 * It intentionally reads/writes refs during render, which the React Compiler flags
 * but is correct for this specific use case.
 * @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 */
/* eslint-disable react-hooks/refs -- Intentional: React docs recommend reading refs during render for this pattern */
function useOnPropChange<T>(
  value: T,
  onChange: (previous: T, current: T) => void,
  isEqual: (a: T, b: T) => boolean = defaultIsEqual,
): void {
  const previousRef = useRef<T>(value);

  if (!isEqual(value, previousRef.current)) {
    const previous = previousRef.current;
    previousRef.current = value;
    onChange(previous, value);
  }
}
/* eslint-enable react-hooks/refs */

export default useOnPropChange;
