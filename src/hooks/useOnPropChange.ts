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
function useOnPropChange<T>(
  value: T,
  onChange: (previous: T, current: T) => void,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b,
): void {
  const previousRef = useRef<T>(value);

  // This pattern follows React's recommendation for adjusting state when props change:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  // The React Compiler cannot optimize this pattern (react-hooks/todo), but it's intentional.
  if (!isEqual(value, previousRef.current)) {
    const previous = previousRef.current;
    previousRef.current = value;
    onChange(previous, value);
  }
}

export default useOnPropChange;
